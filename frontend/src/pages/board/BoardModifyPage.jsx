import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchBoardDetail,
  selectBoardDetail,
  updateBoardThunk,
} from "../../../store/slices/boardSlice";
import useBoardRouteParams from "../../../hooks/common/useBoardRouteParams";
import useKeepFiles from "../../../hooks/common/useKeepFiles";

const BoardModifyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { brandId, boardId } = useBoardRouteParams();

  const detail = useSelector((state) => selectBoardDetail(state, boardId));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const { keepFileIds, toggleKeep, resetKeep } = useKeepFiles(
    detail?.files || []
  );

  useEffect(() => {
    dispatch(fetchBoardDetail({ brandId, boardId }));
  }, [brandId, boardId, dispatch]);

  useEffect(() => {
    if (detail) {
      setTitle(detail.title);
      setContent(detail.content);
      resetKeep();
    }
  }, [detail, resetKeep]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(
      updateBoardThunk({
        brandId,
        boardId,
        payload: {
          data: { title, content, keepFileIds },
          files: Array.from(files),
        },
      })
    );

    if (updateBoardThunk.fulfilled.match(resultAction)) {
      navigate(`/app/${brandId}/board/discussion/read/${boardId}`);
    }
  };

  if (!detail) return <div>불러오는 중...</div>;

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>제목</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <h4>기존 파일</h4>
        {(detail.files || []).map((file) => (
          <label key={file.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={keepFileIds.includes(file.id)}
              onChange={() => toggleKeep(file.id)}
            />
            {file.originalName}
          </label>
        ))}
      </div>
      <div>
        <label>신규 파일</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
      </div>
      <button type="submit" disabled={!title || !content}>
        수정
      </button>
    </form>
  );
};

export default BoardModifyPage;