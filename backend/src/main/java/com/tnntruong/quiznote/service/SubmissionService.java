package com.tnntruong.quiznote.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.tnntruong.quiznote.repository.SubmissionAnswerRepository;
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
    private SubmissionAnswerRepository submissionAnswerRepository;

    public SubmissionService(SubmissionRepository submissionRepository, UserRepository userRepository,
            SubjectRepository subjectRepository, QuestionRepository questionRepository,
            QuestionOptionRepository optionRepository, SubmissionAnswerRepository submissionAnswerRepository) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.submissionAnswerRepository = submissionAnswerRepository;
    }

    public ResCreateSubmission handleStartSubmission(ReqStartSubmissionDTO dto) throws InvalidException {
        User student = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new InvalidException("user not found"));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new InvalidException("subject not found"));

        Submission submission = new Submission();
        submission.setStudent(student);
        submission.setSubject(subject);
        submission.setDuration(dto.getDuration()); // lưu thời gian cho phép
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
        res.setDuration(savedSubmission.getDuration());
        res.setStatus(savedSubmission.getStatus());
        res.setStartedAt(savedSubmission.getStartedAt());

        return res;
    }

    @Transactional
    public ResSubmissionDTO handleSubmission(Long submissionId, List<ReqSubmitAnswerDTO> answers)
            throws InvalidException {
        // Validate submission exists and not already submitted
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new InvalidException("Submission not found"));

        if (submission.getStatus() == SubmissionStatus.SUBMITTED) {
            throw new InvalidException("Submission already submitted");
        }

        // Validate empty answers
        if (answers == null || answers.isEmpty()) {
            throw new InvalidException("Answers cannot be empty");
        }

        Set<Long> questionIds = answers.stream()
                .map(ReqSubmitAnswerDTO::getQuestionId)
                .collect(Collectors.toSet());
        Set<Long> optionIds = answers.stream()
                .map(ReqSubmitAnswerDTO::getSelectedOptionId)
                .filter(id -> id != -1) // exclude unanswered questions
                .collect(Collectors.toSet());

        // Batch load questions and options
        List<Question> questions = questionRepository.findAllById(questionIds);
        List<QuestionOption> options = optionIds.isEmpty() ? new ArrayList<>()
                : optionRepository.findAllById(optionIds);

        if (questions.size() != questionIds.size()) {
            throw new InvalidException("Some questions not found");
        }
        if (!optionIds.isEmpty() && options.size() != optionIds.size()) {
            throw new InvalidException("Some options not found");
        }

        // Create maps for quick lookup
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));
        Map<Long, QuestionOption> optionMap = options.stream()
                .collect(Collectors.toMap(QuestionOption::getId, o -> o));

        // Validate all questions belong to the subject
        Long subjectId = submission.getSubject().getId();
        for (Question q : questions) {
            if (!q.getSubject().getId().equals(subjectId)) {
                throw new InvalidException("Question " + q.getId() + " does not belong to subject " + subjectId);
            }
        }

        // Process answers
        int correctCount = 0;
        List<SubmissionAnswer> submissionAnswers = new ArrayList<>();

        for (ReqSubmitAnswerDTO dto : answers) {
            Question question = questionMap.get(dto.getQuestionId());

            if (question == null) {
                throw new InvalidException("Question with id " + dto.getQuestionId() + " not found");
            }

            SubmissionAnswer answer = new SubmissionAnswer();
            answer.setSubmission(submission);
            answer.setQuestion(question);

            // Handle unanswered question (selectedOptionId = -1)
            if (dto.getSelectedOptionId() == -1) {
                answer.setSelectedOption(null);
                answer.setIsCorrect(false);
            } else {
                QuestionOption selected = optionMap.get(dto.getSelectedOptionId());

                if (selected == null) {
                    throw new InvalidException("Option with id " + dto.getSelectedOptionId() + " not found");
                }

                // Validate option belongs to question
                if (selected.getQuestion().getId() != question.getId()) {
                    throw new InvalidException(
                            "Option " + selected.getId() + " does not belong to question " + question.getId());
                }

                boolean isCorrect = Boolean.TRUE.equals(selected.getIsCorrect());
                if (isCorrect) {
                    correctCount++;
                }

                answer.setSelectedOption(selected);
                answer.setIsCorrect(isCorrect);
            }

            submissionAnswers.add(answer);
        }

        // Update submission
        submission.setCorrectCount(correctCount);
        submission.setTotalQuestions(answers.size());
        double score = answers.size() > 0 ? ((double) correctCount / answers.size() * 10) : 0.0;
        submission.setScore(Math.round(score * 100.0) / 100.0);
        submission.setStatus(SubmissionStatus.SUBMITTED);
        submission.setSubmittedAt(Instant.now());

        // Tính thời gian đã dùng (giây)
        if (submission.getStartedAt() != null) {
            long timeSpentSeconds = submission.getSubmittedAt().getEpochSecond()
                    - submission.getStartedAt().getEpochSecond();
            submission.setTimeSpent(timeSpentSeconds);
        }

        // Save all at once
        submission.getAnswers().addAll(submissionAnswers);
        Submission saved = submissionRepository.save(submission);

        // Update statistics asynchronously or in batch
        for (Long qId : questionIds) {
            updateQuestionCorrectnessPercentage(qId);
        }
        updateSubjectHighestScore(subjectId);

        return convertToDTO(saved);
    }

    private ResSubmissionDTO convertToDTO(Submission submission) {
        List<ResSubmissionAnswerDTO> answers = submission.getAnswers().stream().map(answer -> {
            ResSubmissionAnswerDTO dto = new ResSubmissionAnswerDTO();
            dto.setQuestionId(answer.getQuestion().getId());
            dto.setQuestionContent(answer.getQuestion().getContent());
            dto.setSelectedOptionId(answer.getSelectedOption() != null
                    ? answer.getSelectedOption().getId()
                    : -1);
            dto.setIsCorrect(answer.getIsCorrect());
            return dto;
        }).collect(Collectors.toList());

        return new ResSubmissionDTO(
                submission.getId(),
                new ResSubmissionDTO.CurrentSubject(
                        submission.getSubject().getId(),
                        submission.getSubject().getName()),
                submission.getScore(),
                submission.getCorrectCount(),
                submission.getTotalQuestions(),

                submission.getDuration(),
                submission.getStatus().name(),
                submission.getTimeSpent(),
                submission.getStartedAt(),
                submission.getSubmittedAt(),
                answers);
    }

    private void updateQuestionCorrectnessPercentage(Long questionId) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null) {
            return;
        }

        long correctCount = submissionAnswerRepository.countByQuestionIdAndIsCorrect(questionId, true);
        long totalCount = submissionAnswerRepository.countByQuestionId(questionId);

        double percentage = (totalCount == 0) ? 0.0 : ((double) correctCount / totalCount) * 100.0;

        question.setCorrectnessPercentage(percentage);
        questionRepository.save(question);
    }

    private void updateSubjectHighestScore(Long subjectId) {
        Double highestScore = submissionRepository.findHighestScoreBySubjectId(subjectId);
        Subject subject = subjectRepository.findById(subjectId).orElse(null);
        if (subject != null) {
            subject.setHighestScore(highestScore);
            subjectRepository.save(subject);
        }
    }

    public Double getHighestScoreForSubject(Long subjectId) throws InvalidException {
        if (!subjectRepository.existsById(subjectId)) {
            throw new InvalidException("Subject with id = " + subjectId + " not found");
        }
        return submissionRepository.findHighestScoreBySubjectId(subjectId);
    }

    public List<ResSubmissionDTO> getUserSubmissionHistory(Long userId) {
        List<Submission> submissions = submissionRepository.findByStudentIdOrderBySubmittedAtDesc(userId);
        return submissions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
