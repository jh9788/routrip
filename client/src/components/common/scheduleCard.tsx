import { Schedule as ISchedule } from "@/models/schedule.model";
import styled from "styled-components";
import { CardContentStyle, CardImageStyle, CardStyle, ViewMode } from "./postCard";
import { Link } from "react-router-dom";

interface Props {
  scheduleProps: ISchedule;
  view: ViewMode;
}

const ScheduleCard = ({ scheduleProps, view }: Props) => {
  return (
    <ScheduleCardStyle $view={view}>
      <Link to={`/journeys/${scheduleProps.id}`}>
        <CardImageStyle $image={scheduleProps.thumbnail} $view={view} />
      </Link>
      <CardContentStyle>
        <h3 className="card-title">{scheduleProps.title}</h3>
        <p className="card-date">{scheduleProps.date}</p>
      </CardContentStyle>
    </ScheduleCardStyle>
  );
};

const ScheduleCardStyle = styled(CardStyle)`
  width: ${({ $view }) => ($view === "grid" ? "300px" : "800px")};
  height: ${({ $view }) => ($view === "grid" ? "250px" : "100px")};

  @media (max-width: 768px) {
    width: ${({ $view }) => ($view === "grid" ? "160px" : "300px")};
    height: ${({ $view }) => ($view === "grid" ? "160px" : "80px")};
  }
`;

export default ScheduleCard;
