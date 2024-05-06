import { JoinProps, LoginProps } from "@/hooks/useAuth";
import { httpClient } from "./https";

export const authJoin = async (data: JoinProps) => {
  const response = await httpClient.post("/api/users/join", data);
  return response.data;
};

export interface LoginResponse {
  userId: number;
  nickname: string;
  Authorization: string;
}

export const authLogin = async (data: LoginProps) => {
  const response = await httpClient.post<LoginResponse>("api/users/login", data);
  return response.data;
};
interface authMessageResponse {
  message: string;
}

// 이메일 중복 확인
export const isEmailUnique = async (email: string) => {
  const response = await httpClient.post<authMessageResponse>("api/users/check/email", email);
  return response.data;
};

// 닉네임 중복 확인
export const isNicknameUnique = async (nickname: string) => {
  const response = await httpClient.post<authMessageResponse>("api/users/check/nickname", nickname);
  return response.data;
};

// 비밀번호 초기화를 위한 이메일 확인
export const authEmailComfirm = async (email: string) => {
  const response = await httpClient.post<authMessageResponse>("api/users/reset", email);
  return response.data;
};

// 비밀번호 초기화
export const authReset = async (data: LoginProps) => {
  const response = await httpClient.put<authMessageResponse>("api/users/reset", data);
  return response.data;
};
