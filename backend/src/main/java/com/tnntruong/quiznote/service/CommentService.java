package com.tnntruong.quiznote.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Comment;
import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.dto.request.ReqCreateCommentDTO;
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

        return newComment;
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
        replyComment.setRating(0);
        replyComment.setSubject(parentComment.getSubject());
        replyComment.setParentComment(parentComment);

        return commentRepository.save(replyComment);
    }

    public List<Comment> getCommentsBySubject(Long subjectId) {
        return commentRepository.findBySubjectIdAndParentCommentIsNull(subjectId);
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
