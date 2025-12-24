// [기능] 게시글 목록 페이지 (query 기반 fetch + BoardList props 전달)
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getBoardList } from "../../../api/boardApi";
import BoardList from "../../../components/board/BoardList";

export default function BoardListPage() {
  const { brandId } = useParams();
  const brandIdNum = Number(brandId);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page") ?? 1);
  const size = Number(searchParams.get("size") ?? 10);

  const [boards, setBoards] = useState([]);
  const [pageData, setPageData] = useState(null); // 나중에 PageComponent 붙일 때 사용
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 0) query 기본값 강제 세팅 (없으면 URL에 붙여서 단일 진실로 만듦)
  useEffect(() => {
    if (!brandIdNum) return;

    const hasPage = searchParams.get("page");
    const hasSize = searchParams.get("size");
    if (!hasPage || !hasSize) {
      setSearchParams(
        { page: String(page || 1), size: String(size || 10) },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandIdNum]);

  // 1) 목록 fetch
  useEffect(() => {
    if (!brandIdNum) return;

    const fetchList = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await getBoardList({ brandId: brandIdNum, page, size });

        console.log(
          "[GET][boards] brandId=",
          brandIdNum,
          "count=",
          (data.dtoList ?? []).length
        );

        setPageData(data);
        setBoards(data.dtoList ?? []);
      } catch (err) {
        console.log("[GET][boards][ERROR]", err);
        setErrorMsg("게시글 목록 조회 실패");
        setPageData(null);
        setBoards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [brandIdNum, page, size]);

  // 클릭 → read 페이지로 이동 (page/size 유지)
  const handleItemClick = (board) => {
    const boardId = board?.id;
    if (!boardId) return;

    console.log("[UI][boardClick]", { boardId, page, size });

    navigate(`read/${boardId}?page=${page}&size=${size}`);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Discussion</h1>

      <BoardList
        boards={boards}
        loading={loading}
        errorMsg={errorMsg}
        onItemClick={handleItemClick}
      />

      {/* 3단계에서 PageComponent(pageData 기반) 붙일 자리 */}
    </div>
  );
}
