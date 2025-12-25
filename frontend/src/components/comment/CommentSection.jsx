import React, { useState } from "react";
import useComments from "../../hooks/comment/useComments";

const CommentItem = ({ comment, onReply, onEdit, onDelete }) => {
  return (
    <div className="comment-item" style={{ marginBottom: "8px" }}>
      <div>
        <strong>{comment.writerName || comment.writerId}</strong>{" "}
        <span>#{comment.commentId}</span>
      </div>
      <div>{comment.content}</div>
      {comment.files?.length ? (
        <ul>
          {comment.files.map((f) => (
            <li key={f.id}>{f.originalName}</li>
          ))}
        </ul>
      ) : null}
      <div>
        <button onClick={() => onReply(comment.commentId)}>답글</button>
        <button onClick={() => onEdit(comment)}>수정</button>
        <button onClick={() => onDelete(comment.commentId)}>삭제</button>
      </div>
      {comment.replies?.length ? (
        <div style={{ paddingLeft: "16px" }}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.commentId}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const CommentSection = ({ brandId, boardId }) => {
  const { tree, status, createComment, deleteComment } = useComments(
    brandId,
    boardId
  );
  const [content, setContent] = useState("");
  const [parentId, setParentId] = useState(null);

  const submit = async () => {
    await createComment({
      data: { content, parentCommentId: parentId, keepFileIds: null },
      files: [],
    });
    setContent("");
    setParentId(null);
  };

  const handleReply = (id) => setParentId(id);

  const handleDelete = async (id) => {
    await deleteComment(id);
  };

  return (
    <div>
      <h4>댓글</h4>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentId ? "대댓글 작성..." : "댓글 작성..."}
        />
        <div>
          {parentId && (
            <span>
              대댓글 대상 #{parentId}{" "}
              <button onClick={() => setParentId(null)}>해제</button>
            </span>
          )}
          <button onClick={submit} disabled={!content}>
            등록
          </button>
        </div>
      </div>
      <div style={{ marginTop: "12px" }}>
        {status === "loading" ? (
          <div>불러오는 중...</div>
        ) : (
          tree.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
              onEdit={() => {}}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;