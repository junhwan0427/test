package com.InsightMarket.repository.community;

import com.InsightMarket.domain.community.Comment;
import com.InsightMarket.domain.files.FileTargetType;
import com.InsightMarket.domain.files.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 부모 댓글 (최신순)
    List<Comment> findByBoardIdAndParentIsNullAndDeletedAtIsNullOrderByIdDesc(Long boardId);

    // 대댓글 (등록순)
    List<Comment> findByBoardIdAndParentIdInAndDeletedAtIsNullOrderByIdAsc(
            Long boardId,
            List<Long> parentIds
    );

    Optional<Comment> findByIdAndDeletedAtIsNull(Long commentId);

}
