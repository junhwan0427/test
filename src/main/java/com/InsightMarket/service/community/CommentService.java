package com.InsightMarket.service.community;


import com.InsightMarket.domain.community.Board;
import com.InsightMarket.domain.community.Comment;
import com.InsightMarket.domain.files.FileTargetType;
import com.InsightMarket.domain.member.Member;
import com.InsightMarket.dto.community.CommentResponseDTO;
import com.InsightMarket.dto.community.CommentModifyDTO;
import com.InsightMarket.dto.community.FileResponseDTO;
import com.InsightMarket.repository.FileRepository;
import com.InsightMarket.repository.community.BoardRepository;
import com.InsightMarket.repository.community.CommentRepository;
import com.InsightMarket.service.FileService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

// [댓글 서비스] 댓글/대댓글 + 트리 조회 + 파일 한번에 업로드/교체 + 로그
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final FileRepository fileRepository;
    private final FileService fileService;

    @PersistenceContext
    private EntityManager entityManager; //JPA 표준 방식

    // TODO: UserContext, FileStorageClient

    @Transactional
    public CommentResponseDTO create(
            Long brandId,
            Long boardId,
            CommentModifyDTO data,
            List<MultipartFile> files
    ) {
        log.info("[COMMENT][SVC][CREATE] brandId={}, boardId={}, parentId={}, files={}",
                brandId, boardId, data.getParentCommentId(), files == null ? 0 : files.size());

        Long writerId = 1L; // 테스트용

        // 1) board 조회(brand 스코프)
        Board board = boardRepository.findByIdAndBrandIdAndDeletedAtIsNull(boardId, brandId)
                .orElseThrow();

        // 2) writer 프록시
        Member writerRef = entityManager.getReference(Member.class, writerId);

        // 3) parentId 있으면 parent 조회 + 2단 제한 검사
        Comment parent = null;
        if (data.getParentCommentId() != null) {
            parent = commentRepository.findByIdAndDeletedAtIsNull(data.getParentCommentId())
                    .orElseThrow();

            // ✅ 대댓글의 대댓글 금지
            if (parent.getParent() != null) {
                throw new IllegalStateException("대댓글의 대댓글은 허용되지 않습니다.");
            }

            // ✅ 다른 게시글의 댓글을 parent로 쓰는 것 방지
            if (!parent.getBoard().getId().equals(boardId)) {
                throw new IllegalStateException("부모 댓글이 해당 게시글에 속하지 않습니다.");
            }
        }

        // 4) comment 저장
        Comment saved = commentRepository.save(
                Comment.builder()
                        .board(board)
                        .writer(writerRef)
                        .parent(parent)
                        .content(data.getContent())
                        .build()
        );

        log.info("[COMMENT][SVC][CREATE] savedCommentId={}", saved.getId());

        // 5) files 업로드 + 첨부 엔티티 저장(targetType=COMMENT, targetId=commentId)
        List<FileResponseDTO> savedFiles = fileService.saveFiles(
                FileTargetType.COMMENT,
                saved.getId(),
                writerId,
                files
        );

        log.info("[COMMENT][SVC][CREATE] savedFiles={}", savedFiles.size());

        // 6) 단건 응답 DTO (트리 아님)
        return CommentResponseDTO.builder()
                .commentId(saved.getId())
                .parentCommentId(parent != null ? parent.getId() : null)
                .boardId(boardId)
                .content(saved.getContent())
                .writerId(writerRef.getId())
                // writerName이 필요하면 여기서 member를 조회해야 하는데, 지금은 테스트 단계라 생략 가능
                .files(savedFiles)
                .createdAt(saved.getCreatedAt())
                .replies(List.of())
                .build();
    }

    public void update(Long brandId, Long boardId, Long commentId, CommentModifyDTO data, List<MultipartFile> files) {
        log.info("[COMMENT][SVC][UPDATE] brandId={}, boardId={}, commentId={}, keepFileIds={}, newFiles={}",
                brandId, boardId, commentId,
                data.getKeepFileIds() == null ? 0 : data.getKeepFileIds().size(),
                files == null ? 0 : files.size());

        // TODO 1) comment 조회(board 스코프)
        // TODO 2) 권한 체크(작성자 본인)
        // TODO 3) content 수정
        // TODO 4) 기존 Attachment 조회(targetType=COMMENT, targetId=commentId)
        // TODO 5) keepFileIds 기준 유지/삭제(soft delete)
        // TODO 6) 새 files 업로드 + Attachment 추가

        throw new UnsupportedOperationException("TODO");
    }

    @Transactional(readOnly = true)
    public List<CommentResponseDTO> getCommentTree(Long boardId) {

        // 1️⃣ 부모 댓글
        List<Comment> parents =
                commentRepository.findByBoardIdAndParentIsNullAndDeletedAtIsNullOrderByIdDesc(boardId);

        if (parents.isEmpty()) return List.of();

        List<Long> parentIds = parents.stream().map(Comment::getId).toList();

        // 2️⃣ 대댓글
        List<Comment> replies =
                commentRepository.findByBoardIdAndParentIdInAndDeletedAtIsNullOrderByIdAsc(boardId, parentIds);

        // 3️⃣ 파일 조회 (한 방)
        List<Long> allCommentIds = Stream.concat(
                parents.stream(),
                replies.stream()
        ).map(Comment::getId).toList();

        Map<Long, List<FileResponseDTO>> fileMap =
                fileService.getFilesGrouped(FileTargetType.COMMENT, allCommentIds);

        // 4️⃣ 대댓글 그룹핑
        Map<Long, List<CommentResponseDTO>> replyMap = new HashMap<>();
        for (Comment reply : replies) {
            replyMap.computeIfAbsent(reply.getParent().getId(), k -> new ArrayList<>())
                    .add(toDTO(reply, fileMap));
        }

        // 5️⃣ 부모에 replies 붙이기
        List<CommentResponseDTO> result = new ArrayList<>();
        for (Comment parent : parents) {
            CommentResponseDTO dto = toDTO(parent, fileMap);
            dto.getReplies().addAll(replyMap.getOrDefault(parent.getId(), List.of()));
            result.add(dto);
        }

        return result;
    }

    public void delete(Long brandId, Long boardId, Long commentId) {
        log.info("[COMMENT][SVC][DELETE] brandId={}, boardId={}, commentId={}", brandId, boardId, commentId);

        // TODO 1) comment 조회 + 권한 체크
        // TODO 2) comment.softDelete()
        // TODO 3) (옵션) attachments soft delete 정책

        throw new UnsupportedOperationException("TODO");
    }

    private CommentResponseDTO toDTO(Comment c, Map<Long, List<FileResponseDTO>> fileMap) {
        return CommentResponseDTO.builder()
                .commentId(c.getId())
                .parentCommentId(c.getParent() != null ? c.getParent().getId() : null)
                .boardId(c.getBoard().getId())
                .content(c.getContent())
                .writerId(c.getWriter().getId())
                .writerName(c.getWriter().getName())
                .files(fileMap.getOrDefault(c.getId(), List.of()))
                .createdAt(c.getCreatedAt())
                .build();
    }
}
