import styled from "styled-components";
import icons from "@/icons/icons";
import PostCard, { AreaType } from "@/components/common/postCard";
import { Post } from "@/models/post.model";
import { useEffect, useRef, useState } from "react";
import { ViewMode } from "@/components/common/postCard";
import { useLocation, useNavigate } from "react-router-dom";
import { Country, regions } from "@/data/region";
import RegionCountrySelector from "@/components/common/RegionCountrySelector";

interface PostPageStyleProps {
  view: ViewMode;
  area: AreaType;
}

const PostPage = () => {
  const { SearchIcon, GridIcon, ListIcon } = icons;
  const [view, setView] = useState<ViewMode>("grid");
  const [sortOrder, setSortOrder] = useState<string>("recent");
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 12;

  const location = useLocation();
  const nav = useNavigate();
  const params = new URLSearchParams(location.search);
  const areaParam = params.get("area");
  const countryId = params.get("filter") || "";

  const area: AreaType = areaParam === "home" || areaParam === "abroad" ? areaParam : "home";

  const clickListBtn = () => setView("list");
  const clickGridBtn = () => setView("grid");

  const fetchPosts = async (page: number, reset = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:1234/api/posts?area=${area}&filter=${countryId}&pages=${page}&limit=${itemsPerPage}`,
      );
      const data = await response.json();

      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setHasMore(page * itemsPerPage < data.pagination.totalItems);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (page === 1) {
      fetchPosts(1, true); // 초기 로드 시 페이지 1을 설정하고 데이터 리셋
    } else {
      setPage(1); // 페이지 초기화
    }
  }, [area, countryId]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log("Loader is visible. Fetching next page...");
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader, hasMore, loading]);

  const handleRegionChange = (event: { target: { value: string } }) => {
    const regionId = parseInt(event.target.value);
    const region = regions.find((region) => region.id === regionId);
    setCountries(region ? region.countries : []);
    setSelectedRegion(regionId);
    setSelectedCountry(0);
    params.delete("filter");
    nav({ search: params.toString() });
  };

  const handleCountryChange = (event: { target: { value: string } }) => {
    const countryId = parseInt(event.target.value);
    setSelectedCountry(countryId);
    if (countryId === 0) {
      params.delete("filter");
    } else {
      params.set("filter", countryId.toString());
    }
    nav({ search: params.toString() });
  };

  const sortedPosts =
    sortOrder === "recent"
      ? [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [...posts].sort((a, b) => parseInt(b.likesNum, 10) - parseInt(a.likesNum, 10));

  console.log("Sorted posts:", sortedPosts); // 정렬된 게시물 로그 출력

  return (
    <PostPageStyle view={view} area={area}>
      <div className="main-content">
        <div className="control-wrapper">
          <div className="select-wrapper">
            {area === "abroad" ? (
              <RegionCountrySelector
                regions={regions}
                selectedRegion={selectedRegion}
                selectedCountry={selectedCountry}
                countries={countries}
                onRegionChange={handleRegionChange}
                onCountryChange={handleCountryChange}
              />
            ) : null}
            <div className="input-wrapper">
              <input type="search" placeholder="검색어를 입력하세요." />
              <SearchIcon />
            </div>
          </div>
          <div className="view-toggle">
            <select onChange={(e) => setSortOrder(e.target.value)}>
              <option value="recent">최신순</option>
              <option value="likes">인기순</option>
            </select>
            <GridIcon width="24px" height="24px" onClick={clickGridBtn} />
            <ListIcon width="24px" height="24px" onClick={clickListBtn} />
          </div>
        </div>
      </div>

      <div className="post">
        {posts.length === 0 ? (
          <div className="none-posts">게시글이 없습니다</div>
        ) : (
          sortedPosts.map((post, index) => <PostCard key={post.id || index} PostProps={post} view={view} />)
        )}
        {posts.length > 0 && <div ref={loader} />}
      </div>
    </PostPageStyle>
  );
};

const PostPageStyle = styled.div<PostPageStyleProps>`
  .main-content {
    justify-content: center;
    align-items: center;
    max-width: ${(props) => (props.view === "list" ? "790px" : "1080px")};
    border-bottom: 1px solid #e7e7e7;
    padding: 20px 0px;
    margin: 0 auto;
  }

  .control-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: ${(props) => (props.view === "list" ? "790px" : "1080px")};
    gap: 20px;
  }

  .select-wrapper {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .continent-country {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .continent,
  .country {
    width: 120px;
    padding: 8px 12px;
  }

  select {
    padding: 8px;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid ${({ theme }) => theme.color.commentGray};
    width: 360px;
    padding: 8px;
    border-radius: ${({ theme }) => theme.borderRadius.default};

    svg {
      color: ${({ theme }) => theme.color.commentGray};
    }
  }

  input {
    border: none;
    flex-grow: 1;
    padding: 0 8px;
    font-size: 16px;
    outline: none;
  }

  .view-toggle {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: flex-end;

    select {
      border: 1px solid ${({ theme }) => theme.color.commentGray};
      border-radius: ${({ theme }) => theme.borderRadius.default};
      padding: 8px;
    }
  }

  .post {
    display: grid;
    grid-template-columns: ${(props) =>
      props.view === "grid" ? "repeat(auto-fill, minmax(32%, auto))" : "repeat(auto-fill, minmax(100%, auto))"};
    max-width: ${(props) => (props.view === "grid" ? "unset" : "790px")};
    gap: 14px;
    margin: 0 auto;
    padding: 20px 0;

    .none-posts {
      width: 100%;
      margin: 0 auto;
      text-align: center;
    }
  }
  @media screen and (max-width: 1080px) {
    .control-wrapper {
      width: 90%;
      margin: 0 auto;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      width: 100%;
    }

    .control-wrapper {
      flex-direction: column;
      width: 100%;
    }
    .select-wrapper {
      width: 100%;
      justify-content: center;
      flex-flow: ${(props) => (props.area === "abroad" ? "row wrap" : "row")};

      .continent-country {
        width: 90%;
      }
      .continent-country > * {
        width: 50%;
      }
    }

    .input-wrapper,
    .view-toggle {
      width: 90%;
    }
    .view-toggle {
      justify-content: flex-end;
    }

    .post {
      width: 100%;
      grid-template-columns: ${(props) =>
        props.view === "grid" ? "repeat(auto-fill, minmax(45%, auto))" : "repeat(auto-fill, minmax(100%, auto))"};
    }
  }
`;

export default PostPage;
