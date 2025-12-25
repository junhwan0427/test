import React from "react";

const PageComponent = ({ pageResponse, onChangePage, onChangeSize }) => {
  if (!pageResponse) return null;

  const { page, size, prev, next, pageNumList = [] } = pageResponse;

  return (
    <div className="pagination">
      <select
        value={size}
        onChange={(e) => onChangeSize(Number(e.target.value))}
      >
        {[10, 20, 50].map((s) => (
          <option key={s} value={s}>
            {s}개
          </option>
        ))}
      </select>
      <button disabled={!prev} onClick={() => onChangePage(page - 1)}>
        이전
      </button>
      {pageNumList.map((p) => (
        <button
          key={p}
          onClick={() => onChangePage(p)}
          disabled={p === page}
        >
          {p}
        </button>
      ))}
      <button disabled={!next} onClick={() => onChangePage(page + 1)}>
        다음
      </button>
    </div>
  );
};

export default PageComponent;