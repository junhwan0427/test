import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./memberApi"; // 또는 constants로 분리 추천

const host = `${API_SERVER_HOST}/api/brands`;

// 게시글 목록
export const getBoardList = async ({ brandId, page = 1, size = 10 }) => {
    const res = await jwtAxios.get(`${host}/${brandId}/boards`, {params: { page, size },});
    return res.data;
  };
  
  // 게시글 상세
export const getBoardDetail = async ({ brandId, boardId }) => {
    const res = await jwtAxios.get(`${host}/${brandId}/boards/${boardId}`);
    return res.data;
  };
  
  // 댓글 트리
export const getCommentTree = async ({ brandId, boardId }) => {
    const res = await jwtAxios.get(`${host}/${brandId}/boards/${boardId}/comments`);
    return res.data;
  };

  // 게시글 삭제(soft delete)
export const deleteBoard = async ({ brandId, boardId }) => {
    const res = await jwtAxios.delete(`${host}/${brandId}/boards/${boardId}`);
    return res.data;
  };