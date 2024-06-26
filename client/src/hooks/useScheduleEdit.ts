import { EditScheduleRequest, editSchedule } from "@/apis/schedule.api";
import { useAddPlaceStore } from "@/stores/addPlaceStore";
import { useBookmarkPlacesStore } from "@/stores/bookmarkPlacesStore";
import { useShowMarkerTypeStore } from "@/stores/dayMarkerStore";
import { useDayPlaceStore } from "@/stores/dayPlaces";
import { useNearPlacesStore } from "@/stores/nearPlacesStore";
import { useSearchKeywordStore } from "@/stores/searchKeywordStore";
import { useSearchPlacesStore } from "@/stores/searchPlaceStore";
import { showAlert } from "@/utils/showAlert";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useScheduleEdit = () => {
  const { setDayPlaces } = useDayPlaceStore();
  const { setAddPlaces } = useAddPlaceStore();
  const { setMarkerType } = useShowMarkerTypeStore();
  const { setNearPlaces } = useNearPlacesStore();
  const { setSearchPlaces } = useSearchPlacesStore();
  const { setBookmarkPlaces } = useBookmarkPlacesStore();
  const { setSearchKeywordToServer, setSearchKeywordToGoogle } = useSearchKeywordStore();

  const navigate = useNavigate();

  const { mutate: editScheduleMutate } = useMutation({
    mutationFn: ({ id, title, startDate, endDate, allDaysPlaces }: EditScheduleRequest) =>
      id ? editSchedule({ id, title, startDate, endDate, allDaysPlaces }) : Promise.resolve(null),
    onSuccess: (_, variables) => {
      showAlert("일정 수정이 완료되었습니다.", "logo", () => {
        navigate(`/schedule/${variables.id}`);

        setAddPlaces([]);
        setMarkerType("searchApi");
        setNearPlaces([]);
        setDayPlaces([[]]);
        setSearchPlaces([]);
        setBookmarkPlaces([]);
        setSearchKeywordToServer("");
        setSearchKeywordToGoogle("");
      });
    },
    onError: (err: any) => {
      showAlert("일정 수정에 실패했습니다.\n문제가 지속될 경우 고객센터로 문의해주세요.", "error");
      console.error(err);
    },
  });

  return { editScheduleMutate };
};
