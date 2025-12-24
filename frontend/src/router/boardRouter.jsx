import { lazy } from "react";

const StrategyBoard = lazy(() => import("../pages/board/StrategyBoard"));
const BoardListPage   = lazy(() => import("../pages/board/BoardListPage"));
const BoardReadPage   = lazy(() => import("../pages/board/BoardReadPage"));
const BoardAddPage    = lazy(() => import("../pages/board/BoardAdd"));
const BoardModifyPage = lazy(() => import("../pages/board/BoardModify"));

const boardRouter = (wrap) => [
  { path: "discussion", element: wrap(StrategyBoard) },
  { path: "discussion", element: wrap(BoardListPage) },
  { path: "discussion/read/:boardId", element: wrap(BoardReadPage) },
  { path: "discussion/add", element: wrap(BoardAddPage) },
  { path: "discussion/modify/:boardId", element: wrap(BoardModifyPage) },
];

export default boardRouter;