// [기능] 게시글 상세 페이지 (read)
// - params(brandId, boardId)로 상세 GET
// - 목록 복귀 시 query(page,size) 복원
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getBoardDetail } from "../../../api/boardApi";

export default function BoardReadPage() {
  const { brandId, boardId } = useParams();
  const brandIdNum = Number(brandId);
  const boardIdNum = Number(boardId);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page") ?? 1);
  const size = Number(searchParams.get("size") ?? 10);

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!brandIdNum || !boardIdNum) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await getBoardDetail({ brandId: brandIdNum, boardId: boardIdNum });

        console.log("[GET][boardDetail]", {
          brandId: brandIdNum,
          boardId: boardIdNum,
          files: (data.files ?? []).length,
        });

        setDetail(data);
      } catch (err) {
        console.log("[GET][boardDetail][ERROR]", err);
        setErrorMsg("게시글 상세 조회 실패");
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [brandIdNum, boardIdNum]);

  const goBackToList = () => {
    navigate(`/app/${brandIdNum}/board/discussion?page=${page}&size=${size}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Discussion Read</h1>

        <button
          onClick={goBackToList}
          className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
        >
          목록으로
        </button>
      </div>

      {loading && <div className="mt-4 text-sm text-gray-500">불러오는 중...</div>}
      {!loading && errorMsg && <div className="mt-4 text-sm text-red-500">{errorMsg}</div>}

      {!loading && !errorMsg && detail && (
        <div className="mt-4 rounded border p-4">
          <div className="text-sm text-gray-500">#{detail.id}</div>
          <div className="mt-2 text-lg font-semibold">{detail.title}</div>
          <div className="mt-3 whitespace-pre-wrap text-sm">{detail.content}</div>

          {/* ✅ 파일 메타 출력(다운로드는 나중에) */}
          <div className="mt-6">
            <div className="font-medium">첨부파일</div>

            {(!detail.files || detail.files.length === 0) && (
              <div className="mt-2 text-sm text-gray-500">첨부파일 없음</div>
            )}

            {detail.files && detail.files.length > 0 && (
              <ul className="mt-2 space-y-2">
                {detail.files.map((f) => (
                  <li key={f.id} className="rounded border p-3">
                    <div className="text-sm font-medium">{f.originalName}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      id={f.id} / {f.contentType} / {f.size} bytes
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
