import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBoardThunk } from "../../../store/slices/boardSlice";
import useBoardRouteParams from "../../../hooks/common/useBoardRouteParams";

const BoardAddPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { brandId } = useBoardRouteParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(
      createBoardThunk({
        brandId,
        payload: { data: { title, content }, files: Array.from(files) },
      })
    );

    if (createBoardThunk.fulfilled.match(resultAction)) {
      const newBoard = resultAction.payload;
      navigate(`/app/${brandId}/board/discussion/read/${newBoard.id}`);
    }
  };

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
        <label>파일</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
      </div>
      <button type="submit" disabled={!title || !content}>
        등록
      </button>
    </form>
  );
};

export default BoardAddPage;