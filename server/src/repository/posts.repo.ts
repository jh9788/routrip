import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { Continents } from "@/models/continents.model";
import { Countries } from "@/models/countries.model";
import { Journeys } from "@/models/journeys.model";
import { Likes } from "@/models/likes.model";
import { Posts } from "@/models/posts.model";
import { Users } from "@/models/users.model";
import { getOffset, setAreaType } from "@/utils/posts.utils";
import { iPageDataProps, iSearchDataProps } from "@/types/posts.types";

export const getAllPosts = async (
  area: string,
  pageData?: iPageDataProps,
  sort?: string,
  searchData?: iSearchDataProps,
  type?: string,
) => {
  const postsRepo = AppDataSource.getRepository(Posts);
  try {
    const offset: number = await getOffset(pageData);
    const areaType = await setAreaType(area);
    const result = await postsRepo
      .createQueryBuilder("posts")
      .select([
        "posts.id, posts.title, posts.postsImg, us.nickName, us.profileImg, DATE_FORMAT(posts.startDate, '%Y.%m.%d') AS startDate, DATE_FORMAT(posts.endDate, '%Y.%m.%d') AS endDate, coun.name as country, con.name as continent",
      ])
      .addSelect((subQuery) => {
        return subQuery.select(`COUNT(*)`).from(Likes, "lk").where("lk.postId = posts.id");
      }, "likesNum")
      .addSelect((subQuery) => {
        return subQuery.select(`COUNT(*)`).from(Comments, "cm").where("cm.postId = posts.id");
      }, "commentsNum")
      .leftJoin(Users, "us", "us.id = posts.userId")
      .leftJoin(Journeys, "jn", "jn.id = posts.journeyId")
      .leftJoin(Countries, "coun", "coun.id = posts.countryId")
      .leftJoin(Continents, "con", "con.id = posts.continentId")
      .where("posts.countryId =:id", { id: areaType });
    if (searchData?.filter) {
      await result.andWhere("country like :filter", { filter: `%${searchData.filter}%` });
    } else if (searchData?.keyword) {
      await result.andWhere("posts.title like :keyword", { keyword: `%${searchData.keyword}%` });
    } else if (searchData?.filter && searchData?.keyword) {
      await result.andWhere("country like :filter", { filter: `%${searchData?.filter}%` });
      await result.andWhere("posts.title like :keyword", { keyword: `%${searchData?.keyword}%` });
    }
    await result.groupBy("posts.id");

    if (sort === "recent" || typeof sort === "undefined") {
      await result.orderBy("posts.id", "DESC");
    } else {
      await result.orderBy({ likesNum: "DESC", "posts.id": "DESC" });
    }
    if (type && type == "list") {
      return await result.limit(pageData?.limit).offset(offset).getRawMany();
    } else {
      return await result.getCount();
    }
  } catch (err) {
    return null;
  }
};
const postsRepository = { getAllPosts };
export default postsRepository;
