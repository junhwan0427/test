import React from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import useBoardRouteParams from "../../../hooks/common/useBoardRouteParams";

const BoardLayout = () => {
  const { brandId } = useBoardRouteParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const goList = () => {
    const query = searchParams.toString();
    navigate(`/app/${brandId}/board/discussion${query ? `?${query}` : ""}`);
  };

  const goAdd = () => navigate(`/app/${brandId}/board/discussion/add`);

  return (
    <div>
      <div className="board-header">
        <h2>브랜드 커뮤니티</h2>
        <div>
          <button onClick={goList}>목록</button>
          <button onClick={goAdd}>글쓰기</button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default BoardLayout;