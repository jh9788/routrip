import { AppDataSource } from "@/config/ormSetting";
import { Comments } from "@/models/comments.model";
import { Likes } from "@/models/likes.model";
import { Picks } from "@/models/picks.model";

const reqPicksList = async (userId: number) => {
  const pickRepo = AppDataSource.getRepository(Picks);
  const picksResult = await pickRepo.find({
    where: { user: { id: userId } },
  });
  if (!picksResult || picksResult.length === 0) return { success: false, msg: "does not exist Like Place" };
  const returnData = picksResult?.map((place) => {
    const locationSplit = place.place.location.split(",");
    return {
      id: place.id,
      placeName: place.place.name,
      address: place.place.address,
      tel: place.place.tel,
      location: {
        lat: locationSplit[0].trim(),
        lng: locationSplit[1].trim(),
      },
      placeImg: place.place.img,
    };
  });

  return { success: true, data: returnData };
};
const reqPicksInsertData = async (userId: number, placeId: string) => {
  const pickRepo = AppDataSource.getRepository(Picks);
  const pick = {
    user: { id: userId },
    place: { id: placeId },
  };

  const insertResult = await pickRepo.save(pick);
  if (!insertResult) return { success: false };
  return { success: true };
};

const reqPicksDeleteData = async (userId: number, placeId: string) => {
  const pickRepo = AppDataSource.getRepository(Picks);
  const deleteResult = await pickRepo.delete({ user: { id: userId }, place: { id: placeId } });
  if (!deleteResult.affected || deleteResult.affected < 1) return { success: false, msg: "failed" };
  return { success: true };
};

const reqLikesList = async (userId: number) => {
  const likeRepo = AppDataSource.getRepository(Likes);
  const likesResult = await likeRepo.find({ where: { user: { id: userId } } });
  const returnData = await Promise.all(
    likesResult.map(async (like) => {
      const likeNum = await getTotalLike(like.post.id);
      const commnetNum = await getTotalComment(like.post.id);
      return {
        title: like.post.title,
        date: like.post.startDate + "~" + like.post.endDate,
        author: like.user.nickName,
        profileImg: like.user.profileImg,
        continent: like.post.continent.name,
        county: like.post.country.name,
        likeNum: likeNum,
        commentNum: commnetNum,
      };
    }),
  );

  if (likesResult.length === 0) return { success: false, msg: "find not list" };
  console.log("return", returnData);
  return { success: true, data: returnData };
};

const reqLikesInsertData = async (userId: number, postId: number) => {
  const likeRepo = AppDataSource.getRepository(Likes);
  const like = {
    user: { id: userId },
    post: { id: postId },
  };

  const insertResult = await likeRepo.save(like);
  if (!insertResult) return { success: false };
  return { success: true };
};
const reqLikesDeleteData = async (userId: number, postId: number) => {
  const likeRepo = AppDataSource.getRepository(Likes);
  const insertResult = await likeRepo.delete({
    user: { id: userId },
    post: { id: postId },
  });
  if (!insertResult) return { success: false };
  return { success: true };
};

const existDataCheck = async (type: string, userId: number, itemId: number | string) => {
  if (type === "likes") {
    const repo = AppDataSource.getRepository(Likes);
    const data = await repo.findOne({
      where: {
        user: { id: userId },
        post: { id: itemId as number },
      },
    });
    return data ? { success: true } : { success: false };
  } else if (type === "picks") {
    const repo = AppDataSource.getRepository(Picks);
    const data = await repo.findOne({ where: { user: { id: userId }, place: { id: itemId as string } } });
    return data ? { success: true } : { success: false };
  }
};

const getTotalLike = async (postId: number) => {
  const likeRepo = AppDataSource.getRepository(Likes);
  const result = await likeRepo.count({ where: { post: { id: postId } } });
  return result;
};

const getTotalComment = async (postId: number) => {
  const commentRepo = AppDataSource.getRepository(Comments);
  return await commentRepo.count({ where: { post: { id: postId } } });
};

const likesService = {
  reqPicksList,
  reqPicksInsertData,
  reqPicksDeleteData,
  reqLikesList,
  existDataCheck,
  reqLikesInsertData,
  reqLikesDeleteData,
};
export default likesService;
