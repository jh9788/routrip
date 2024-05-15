export interface iPostsInsertProps {
  title: string;
  startDate: string;
  endDate: string;
  continent: number;
  country: number;
  totalExpense: number;
  journeyId: number;
  contents: string;
  postsImg: string;
}
export interface iSearchDataProps {
  filter: string;
  keyword: string;
}

export interface iPagination {
  pages?: number;
  totalPosts?: number;
}

export interface iSpots {
  day: number;
  spot: iSpotData[];
}
export interface iSpotData {
  placeId: string;
  tel: string;
  name: string;
  address: string;
  openingHours: string[];
}
