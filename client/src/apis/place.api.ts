import { Place, PlaceDetails } from "@/models/place.model";
import { httpClient } from "./https";
import { showAlert } from "@/utils/showAlert";
import { mockRealPlaceWithUuid } from "@/utils/makeMockSelectedPlaces";

// 백엔드 서버로 장소 검색 요청
export const searchPlaceApi = async (keyword: string, setPlaces: (places: Place[]) => void) => {
  try {
    const { data } = await httpClient.get<Place[]>("/spots", { params: { keyword } });
    setPlaces(data);
    return data;
  } catch (err: any) {
    if (err.response.status === 404) {
      // showAlert(err.response.message,"error")
      showAlert("검색 결과가 없습니다.\n신규 장소로 먼저 등록해 주세요.", "error");
      return;
    }
    throw err;
  }
};

// 장소 검색 mock api
// export const searchPlaceApi = async (keyword: string, setPlaces: (places: Place[]) => void) => {
//   const data = mockRealPlaceWithUuid;
//   setPlaces(data);
//   return data;
// };

// 백엔드 서버로 장소 중복 체크 요청
export const checkPlaceApi = async (id: string) => {
  try {
    const res = await httpClient.post(`/spots/check/${id}`);
    return res.data;
    // const error = new Error("Duplicate place");
    // throw error;

    // return Promise.resolve("OK");
  } catch (err: any) {
    throw err;
  }
};

// 백엔드 서버로 신규 장소 등록 요청
export const addNewPlaceApi = async (placeDetailData: PlaceDetails) => {
  try {
    const { data } = await httpClient.post<PlaceDetails>(`/spots`, placeDetailData);
    return data;
  } catch (err: any) {
    throw err;
  }
};

// 백엔드 서버로 장소 상세 정보 요청 -> 장소 상세보기 모달 컴포넌트, 일정 등록 및 수정페이지에서 내가 찜한 장소
export const getPlaceDetailApi = async (id: string) => {
  try {
    const { data } = await httpClient.get<PlaceDetails>(`/spots/${id}`);
    return data;
  } catch (err: any) {
    throw err;
  }
};
