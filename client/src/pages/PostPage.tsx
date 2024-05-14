import styled from "styled-components";
import icons from "@/icons/icons";
import PostCard from "@/components/common/postCard";
import { Post } from "@/models/post.model";
import { useEffect, useRef, useState } from "react";
import { ViewMode } from "@/components/common/postCard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Country, regions } from "@/data/region";
import RegionCountrySelector from "@/components/common/RegionCountrySelector";

interface PostPageStyleProps {
  view: string;
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
  const loader = useRef(null);

  const location = useLocation();
  const nav = useNavigate();
  const params = new URLSearchParams(location.search);
  const area = params.get("area") || "home";
  const countryId = params.get("filter") || "";

  const clickListBtn = () => setView("list");
  const clickGridBtn = () => setView("grid");

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`http://localhost:1234/api/posts?area=${area}&filter=${countryId}&pages=${page}`);
      const data = await response.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.pagination.page * 2 < data.pagination.totalPosts);
    };

    fetchPosts();
  }, [page, countryId]); // countryId를 의존성 배열에 추가

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
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
  }, [loader, hasMore]);

  const handleRegionChange = (event: { target: { value: string } }) => {
    const regionId = parseInt(event.target.value);
    const region = regions.find((region) => region.id === regionId);
    setCountries(region ? region.countries : []);
    setSelectedRegion(regionId);
    setSelectedCountry(0); // Reset country selection when region changes
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

  return (
    <PostPageStyle view={view}>
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
        {sortedPosts.map((post) => (
          <PostCard key={post.id} PostProps={post} view={view} />
        ))}
        <div ref={loader} />
      </div>
    </PostPageStyle>
  );
};

const PostPageStyle = styled.div<PostPageStyleProps>`
  .main-content {
    display: grid;
    justify-content: center;
    align-items: center;
    width: ${(props) => (props.view === "list" ? "790px" : "1080px")};
    border-bottom: 1px solid #e7e7e7;
    padding: 0px 0px 20px 0px;
    margin: 10px auto 20px auto;
  }

  .control-wrapper {
    display: grid;
    justify-content: center;
    align-items: center;
    width: 960px;
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
    border: 1px solid black;
    width: 360px;
    padding: 8px;
    border-radius: ${({ theme }) => theme.borderRadius.default};
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
  }

  .post {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    justify-content: center;
    width: 1080px;
  }

  @media (max-width: 768px) {
    .main-content {
      width: 100%;
    }

    .control-wrapper {
      flex-direction: column;
      width: 100%;
    }

    .select-wrapper,
    .input-wrapper,
    .view-toggle {
      width: 100%;
    }
    .view-toggle {
      justify-content: flex-end;
    }

    .post {
      width: 100%;
    }
  }
`;

export default PostPage;
