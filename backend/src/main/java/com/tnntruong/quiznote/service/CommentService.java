package com.tnntruong.quiznote.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Comment;
import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.dto.request.ReqCreateCommentDTO;
import com.tnntruong.quiznote.dto.response.ResCommentDTO;
import com.tnntruong.quiznote.dto.response.ResResultPagination;
import com.tnntruong.quiznote.repository.CommentRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final SubjectRepository subjectRepository;
    private final UserService userService;

    public CommentService(CommentRepository commentRepository, SubjectRepository subjectRepository,
            UserService userService) {
        this.commentRepository = commentRepository;
        this.subjectRepository = subjectRepository;
        this.userService = userService;
    }

    public Comment addComment(Long subjectId, ReqCreateCommentDTO req) throws InvalidException {
        User user = userService.handleGetCurrentUser();
        if (user == null) {
            throw new InvalidException("User not found");
        }
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new InvalidException("Subject not found"));

        Comment newComment = new Comment();
        newComment.setContent(req.getContent());
        newComment.setRating(req.getRating());
        newComment.setUser(user);
        newComment.setSubject(subject);

        Double avg = commentRepository.findAverageRatingBySubjectId(subjectId);
        subject.setAverageRating(avg != null ? avg : 0.0);
        subjectRepository.save(subject);

        return commentRepository.save(newComment);
    }

    public Comment replyToComment(Long parentId, ReqCreateCommentDTO request) throws InvalidException {
        Comment parentComment = commentRepository.findById(parentId)
                .orElseThrow(() -> new InvalidException("Parent comment not found"));

        User user = userService.handleGetCurrentUser();
        if (user == null) {
            throw new InvalidException("User not found");
        }
        if (parentComment.getUser().getRole().equals("Sellers") && user.getRole().equals("Sellers")) {
            throw new InvalidException("Shop cannot reply to shop comments");
        }
        Comment replyComment = new Comment();
        replyComment.setContent(request.getContent());
        replyComment.setUser(user);
        replyComment.setRating(null);
        replyComment.setSubject(parentComment.getSubject());
        replyComment.setParentComment(parentComment);

        return commentRepository.save(replyComment);
    }

    public ResResultPagination getCommentsBySubject(Long subjectId, Specification<Comment> spec, Pageable page)
            throws InvalidException {

        // findBySubjectIdAndParentCommentIsNull
        Specification<Comment> finalSpec = (root, query, cb) -> cb.equal(root.get("subject").get("id"), subjectId);
        finalSpec = finalSpec.and((root, query, cb) -> cb.isNull(root.get("parentComment")));
        if (spec != null) {
            finalSpec = finalSpec.and(spec);
        }

        Page<Comment> comments = commentRepository.findAll(finalSpec, page);
        ResResultPagination res = new ResResultPagination();
        ResResultPagination.Meta meta = new ResResultPagination.Meta();
        meta.setPage(comments.getNumber() + 1);
        meta.setPageSize(comments.getSize());
        meta.setPages(comments.getTotalPages());
        meta.setTotal(comments.getTotalElements());

        res.setMeta(meta);
        res.setResult(comments.getContent().stream().map(ResCommentDTO::new).toList());
        return res;
    }

    public void deleteComment(Long commentId) throws InvalidException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new InvalidException("Comment not found"));

        User currentUser = userService.handleGetCurrentUser();
        if (currentUser == null) {
            throw new InvalidException("User not found");
        }
        if (!comment.getUser().getEmail().equals(currentUser.getEmail())
                && !comment.getUser().getRole().equals("ADMIN")) {
            throw new InvalidException("You do not have permission to delete this comment");
        }

        commentRepository.delete(comment);
        Double avg = commentRepository.findAverageRatingBySubjectId(comment.getSubject().getId());
        comment.getSubject().setAverageRating(avg != null ? avg : 0.0);
        subjectRepository.save(comment.getSubject());
    }
}
