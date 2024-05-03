import styled from "styled-components";
import MypageTabItem from "./MypageTabItem";
import { useState } from "react";
interface Props {}

const TABLIST = ["일정 모음", "내 여행글", "내 댓글", "좋아요 한글", "찜한 장소"];

const MypageTab = () => {
  const [activeTab, setActiveTab] = useState([true, false, false, false, false]);

  return (
    <MypageTabStyle>
      {TABLIST.map((item, idx) => (
        <MypageTabItem title={item} ative={activeTab[idx]} key={idx} />
      ))}
    </MypageTabStyle>
  );
};

const MypageTabStyle = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
  white-space: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};

  @media (max-width: 768px) {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
`;

export default MypageTab;
