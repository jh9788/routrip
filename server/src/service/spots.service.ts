import { Places } from "@/models/places.model";
import { Location, PlaceDetailDTO, SearchPlaceDTO } from "@/types/spots.types";
import { AppDataSource } from "@/config/ormSetting";
import { s3 } from "@/middlewares/awsUpload";
import axios from "axios";
import { v4 } from "uuid";
import { S3_BUCKET_NAME } from "@/settings";
import { Picks } from "@/models/picks.model";

const placeRepository = AppDataSource.getRepository(Places);
const picksRepository = AppDataSource.getRepository(Picks);

const register = async (
  id: string,
  name: string,
  address: string,
  siteUrl: string,
  tel: string,
  location: Location,
  openingHours: string[],
  placeImg: string,
): Promise<void> => {
  const exists = await placeRepository.findOneBy({ id: id });

  if (exists) {
    throw new Error("이미 등록된 장소가 있습니다.\n해당 장소를 추가하시겠습니까?");
  }

  let placeS3Img: string = "";
  if (placeImg.length > 0) placeS3Img = await placeImgUpload(placeImg);

  const place: Places = new Places();
  place.id = id;
  place.name = name;
  place.address = address;
  place.siteUrl = siteUrl;
  place.tel = tel;
  place.img = placeS3Img;

  const locationStr: string = location.lat + ", " + location.lng;
  place.location = locationStr;

  const openingHoursArr: string[] = openingHours;
  place.openingHours = openingHoursArr.join(", ");

  await placeRepository.save(place);
};

const checkDuplicate = async (id: string): Promise<boolean> => {
  return await placeRepository.findOneBy({ id: id }) !== null;
};

const getDetail = async (
  id: string,
  user: { id?: number; nickName?: string; isLoggedIn: boolean },
): Promise<PlaceDetailDTO> => {
  let foundPlace: Places | null = await placeRepository.findOneBy({ id: id });

  if (!foundPlace) {
    throw new Error("장소 정보를 찾을 수 없습니다.");
  }

  const locationStrArr: string[] = foundPlace.location.split(", ");
  const location: Location = {
    lat: parseFloat(locationStrArr[0]),
    lng: parseFloat(locationStrArr[1]),
  };

  const openingHoursArr: string[] = foundPlace.openingHours.split(", ");

  let isPicked: boolean;

  if (!user) {
    throw new Error("유저 정보가 존재하지 않습니다");
  } else if (user.isLoggedIn) {
    isPicked = await picksRepository.existsBy({ user: { id: user.id }, place: { id: id } });
  } else {
    isPicked = false;
  }

  let placeDetailDTO: PlaceDetailDTO = {
    id: foundPlace.id,
    placeName: foundPlace.name,
    location: location,
    address: foundPlace.address,
    siteUrl: foundPlace.siteUrl,
    tel: foundPlace.tel,
    openingHours: openingHoursArr,
    placeImg: foundPlace.img,
    isPicked: isPicked,
  };

  return placeDetailDTO;
};

const search = async (keyword: string, zoom: number, lat: number, lng: number): Promise<SearchPlaceDTO[]> => {
  const places = await placeRepository
    .createQueryBuilder("places")
    .where("places.name LIKE :keyword", { keyword: `%${keyword}%` })
    .getMany();

  if (places.length === 0) {
    throw new Error("등록된 장소가 없습니다.\n신규 장소를 등록해 주세요.");
  }

  let searchedPlaces: SearchPlaceDTO[] = [];

  places.forEach((place) => {
    const locationStrArr: string[] = place.location.split(", ");
    const location: Location = {
      lat: parseFloat(locationStrArr[0]),
      lng: parseFloat(locationStrArr[1]),
    };
    const searchedPlace: SearchPlaceDTO = {
      id: place.id,
      placeName: place.name,
      address: place.address,
      location: location,
      placeImg: place.img,
    };
    searchedPlaces.push(searchedPlace);
  });

  let filteredPlaces: SearchPlaceDTO[] = [];
  let searchDistance: number;

  if (zoom < 10) searchDistance = 50000;
  else if (zoom < 15) searchDistance = 30000;
  else searchDistance = 10000;

  searchedPlaces.forEach((place) => {
    const distance = getDistance(place.location.lat, place.location.lng, lat, lng);
    if (distance <= searchDistance) {
      filteredPlaces.push(place);
    }
  });
  return filteredPlaces;
};

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const PI = Math.PI;
  const radius = 6371; // 지구 반지름 (단위: km)
  const dLat = (lat2 - lat1) * (PI / 180);
  const dLon = (lng2 - lng1) * (PI / 180);
  const temp1 =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (PI / 180)) * Math.cos(lat2 * (PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const temp2 = 2 * Math.atan2(Math.sqrt(temp1), Math.sqrt(1 - temp1));
  const distance = radius * temp2;
  return distance * 1000; // 거리 (단위: m)
}

const placeImgUpload = async (imageUrl: string): Promise<string> => {
  let response;
  try {
    response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  } catch (error) {
    throw new Error("이미지 요청에 실패했습니다.");
  }

  const imageBuffer = Buffer.from(response.data, "binary");
  const imageName = `placeImg/${Date.now() + v4() + ".jpg"}`;

  const params: AWS.S3.PutObjectRequest = {
    Bucket: S3_BUCKET_NAME,
    Key: imageName,
    Body: imageBuffer,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  let result;
  try {
    result = await s3.upload(params).promise();
  } catch (error) {
    throw new Error("이미지 저장에 실패했습니다.");
  }
  return result.Location;
};

export const SpotsService = {
  register,
  checkDuplicate,
  getDetail,
  search,
};
