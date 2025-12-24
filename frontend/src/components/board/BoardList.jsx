// [기능] 게시글 목록 섹션(UI만 담당)
export default function BoardList({ boards, loading, errorMsg, onItemClick }) {
    return (
      <section className="mt-4">
        {loading && <div className="text-sm text-gray-500">불러오는 중...</div>}
  
        {!loading && errorMsg && (
          <div className="text-sm text-red-500">{errorMsg}</div>
        )}
  
        {!loading && !errorMsg && (!boards || boards.length === 0) && (
          <div className="text-sm text-gray-500">게시글이 없습니다.</div>
        )}
  
        {!loading && !errorMsg && boards && boards.length > 0 && (
          <ul className="space-y-2">
            {boards.map((b) => (
              <li
                key={b.id}
                onClick={() => onItemClick?.(b)}
                className="cursor-pointer rounded border p-3 hover:bg-gray-50"
              >
                <div className="font-medium">{b.title}</div>
                <div className="text-sm text-gray-500">#{b.id}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }
  