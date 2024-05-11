import { Profile } from "@/models/profile.model";
import { httpClient } from "./https";
import { Comment } from "@/models/comment.model";
import { Schedule } from "@/models/schedule.model";
import { Post } from "@/models/post.model";
import { PlaceDetails } from "@/models/place.model";

interface FetchProfileResponse {
  profile: Profile;
}

// 내 프로필
export const fetchProfile = async () => {
  try {
    const response = await httpClient.get<FetchProfileResponse>("/mypages/total-data-quantity");
    return response.data;
  } catch (error) {
    // 에러 처리
    return {
      profile: {
        journeysNum: 0,
        postsNum: 0,
        commentsNum: 0,
        likePostsNum: 0,
        likeSpotsNum: 0,
        profile: "",
      },
    };
  }
};

// 내 일정
interface FetchMyPageParams {
  list: string;
}

export const fetchMySchedule = async (params: FetchMyPageParams) => {
  try {
    const { data } = await httpClient.get<Schedule[]>("/mypages/journeys");
    return data;
  } catch (error) {
    // 에러 처리
    return [];
  }
};

// 내 게시글

export const fetchMyPosts = async (params: FetchMyPageParams) => {
  try {
    const { data } = await httpClient.get<Post[]>("/mypages/posts");
    return data;
  } catch (error) {
    // 에러 처리
    return [];
  }
};

// 내 댓글
export const fetchMyComments = async (params: FetchMyPageParams) => {
  try {
    const { data } = await httpClient.get<Comment[]>("/mypages/comments");
    return data;
  } catch (error) {
    // 에러 처리
    return [];
  }
};

// 여행글 좋아요
interface FetchPostResponse {
  posts: Post[];
}
export const fetchLikePost = async () => {
  try {
    const { data } = await httpClient.get<Post[]>("/likes/place");
    return data;
  } catch (error) {
    // 에러 처리
    return [];
  }
};

// 찜한 장소

export const fetchLikePlace = async () => {
  try {
    const response = await httpClient.get<PlaceDetails[]>("/likes/places");
    return response.data;
  } catch (error) {
    // 에러 처리
    return [];
  }
};
