package com.tnntruong.quiznote.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Question;
import com.tnntruong.quiznote.domain.QuestionOption;
import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.domain.Submission;
import com.tnntruong.quiznote.domain.SubmissionAnswer;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.dto.request.ReqStartSubmissionDTO;
import com.tnntruong.quiznote.dto.request.ReqSubmitAnswerDTO;
import com.tnntruong.quiznote.dto.response.Submission.ResCreateSubmission;
import com.tnntruong.quiznote.dto.response.Submission.ResSubmissionDTO;
import com.tnntruong.quiznote.dto.response.Submission.ResSubmissionDTO.ResSubmissionAnswerDTO;
import com.tnntruong.quiznote.repository.QuestionOptionRepository;
import com.tnntruong.quiznote.repository.QuestionRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.repository.SubmissionRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.util.constant.SubmissionStatus;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class SubmissionService {
    private SubmissionRepository submissionRepository;
    private UserRepository userRepository;
    private SubjectRepository subjectRepository;
    private QuestionRepository questionRepository;
    private QuestionOptionRepository optionRepository;

    public SubmissionService(SubmissionRepository submissionRepository, UserRepository userRepository,
            SubjectRepository subjectRepository, QuestionRepository questionRepository,
            QuestionOptionRepository optionRepository) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
    }

    public ResCreateSubmission handleStartSubmission(ReqStartSubmissionDTO dto) throws InvalidException {
        User student = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new InvalidException("user not found"));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new InvalidException("subject not found"));

        Submission submission = new Submission();
        submission.setStudent(student);
        submission.setSubject(subject);
        submission.setIsPractice(dto.getIsPractice());
        submission.setStatus(SubmissionStatus.IN_PROGRESS);
        submission.setStartedAt(Instant.now());

        Submission savedSubmission = this.submissionRepository.save(submission);

        ResCreateSubmission res = new ResCreateSubmission();
        ResCreateSubmission.CurrentUser currStudent = new ResCreateSubmission.CurrentUser(student.getId(),
                student.getName());
        ResCreateSubmission.CurrentSubject currSubject = new ResCreateSubmission.CurrentSubject(subject.getId(),
                subject.getName());
        res.setId(savedSubmission.getId());
        res.setStudent(currStudent);
        res.setSubject(currSubject);
        res.setIsPractice(savedSubmission.getIsPractice());
        res.setStatus(savedSubmission.getStatus());
        res.setStartedAt(savedSubmission.getStartedAt());

        return res;
    }

    public ResSubmissionDTO handleStartSubmission(Long submissionId, List<ReqSubmitAnswerDTO> answers)
            throws InvalidException {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new InvalidException("Submission not found"));

        if (submission.getStatus() == SubmissionStatus.SUBMITTED) {
            throw new InvalidException("Submission already submitted");
        }

        int correctCount = 0;

        for (ReqSubmitAnswerDTO dto : answers) {
            Question question = questionRepository.findById(dto.getQuestionId())
                    .orElseThrow(() -> new InvalidException("Question not found"));
            QuestionOption selected = optionRepository.findById(dto.getSelectedOptionId())
                    .orElseThrow(() -> new InvalidException("Option not found"));

            boolean isCorrect = Boolean.TRUE.equals(selected.getIsCorrect());
            if (isCorrect)
                correctCount++;

            SubmissionAnswer answer = new SubmissionAnswer();
            answer.setSubmission(submission);
            answer.setQuestion(question);
            answer.setSelectedOption(selected);
            answer.setIsCorrect(isCorrect);
            submission.getAnswers().add(answer);
        }

        submission.setCorrectCount(correctCount);
        submission.setTotalQuestions(answers.size());
        submission.setScore((double) correctCount / answers.size() * 10);
        submission.setStatus(SubmissionStatus.SUBMITTED);
        submission.setSubmittedAt(Instant.now());

        Submission saved = submissionRepository.save(submission);

        return convertToDTO(saved);
    }

    private ResSubmissionDTO convertToDTO(Submission submission) {
        List<ResSubmissionAnswerDTO> answers = submission.getAnswers().stream().map(answer -> {
            ResSubmissionAnswerDTO dto = new ResSubmissionAnswerDTO();
            dto.setQuestionId(answer.getQuestion().getId());
            dto.setQuestionContent(answer.getQuestion().getContent());
            dto.setSelectedOptionId(answer.getSelectedOption().getId());
            dto.setIsCorrect(answer.getIsCorrect());
            return dto;
        }).collect(Collectors.toList());

        return new ResSubmissionDTO(
                submission.getId(),
                submission.getSubject().getId(),
                submission.getIsPractice(),
                submission.getScore(),
                submission.getCorrectCount(),
                submission.getTotalQuestions(),
                answers);
    }
}
