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
import com.tnntruong.quiznote.dto.response.Submission.ResStudentAnalytics;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import com.tnntruong.quiznote.repository.QuestionOptionRepository;
import com.tnntruong.quiznote.repository.SubmissionAnswerRepository;
import com.tnntruong.quiznote.repository.QuestionRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.repository.SubmissionRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.repository.PurchaseRepository;
import com.tnntruong.quiznote.util.constant.SubmissionStatus;
import com.tnntruong.quiznote.util.constant.SubjectStatus;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class SubmissionService {
    private SubmissionRepository submissionRepository;
    private UserRepository userRepository;
    private SubjectRepository subjectRepository;
    private QuestionRepository questionRepository;
    private QuestionOptionRepository optionRepository;
    private SubmissionAnswerRepository submissionAnswerRepository;
    private PurchaseRepository purchaseRepository;

    public SubmissionService(SubmissionRepository submissionRepository, UserRepository userRepository,
            SubjectRepository subjectRepository, QuestionRepository questionRepository,
            QuestionOptionRepository optionRepository, SubmissionAnswerRepository submissionAnswerRepository,
            PurchaseRepository purchaseRepository) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.submissionAnswerRepository = submissionAnswerRepository;
        this.purchaseRepository = purchaseRepository;
    }

    public ResCreateSubmission handleStartSubmission(ReqStartSubmissionDTO dto) throws InvalidException {
        User student = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new InvalidException("user not found"));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new InvalidException("subject not found"));

        // Kiểm tra nếu subject ở trạng thái DELETED - không cho phép làm bài
        if (subject.getStatus() == SubjectStatus.DELETED) {
            throw new InvalidException("subject not found");
        }

        // Kiểm tra nếu subject ở trạng thái INACTIVE
        if (subject.getStatus() == SubjectStatus.INACTIVE) {
            // Kiểm tra nếu user chưa mua subject này thì không cho phép làm bài
            if (subject.getPrice() > 0 &&
                    !purchaseRepository.findByStudentIdAndSubjectId(student.getId(), subject.getId()).isPresent()) {
                throw new InvalidException("This subject is currently inactive and not available for submission");
            }
            // Nếu đã mua hoặc subject miễn phí thì vẫn cho phép làm bài
        }
        Submission submission = new Submission();
        submission.setStudent(student);
        submission.setSubject(subject);
        submission.setDuration(dto.getDuration());
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

        // Check if submission time has expired
        if (submission.getStartedAt() != null && submission.getDuration() != null) {
            Instant endTime = submission.getStartedAt().plusSeconds(submission.getDuration() * 60L);
            Instant now = Instant.now();
            Instant bufferTime = endTime.plusSeconds(5);

            if (now.isAfter(bufferTime)) {
                throw new InvalidException("Submission time has expired. Cannot submit answers after deadline.");
            }
        }

        if (answers == null || answers.isEmpty()) {
            throw new InvalidException("Answers cannot be empty");
        }

        Set<Long> questionIds = answers.stream()
                .map(ReqSubmitAnswerDTO::getQuestionId)
                .collect(Collectors.toSet());

        Set<Long> optionIds = answers.stream()
                .flatMap(a -> {
                    // Hỗ trợ cả selectedOptionIds (mới) và selectedOptionId (cũ)
                    if (a.getSelectedOptionIds() != null && !a.getSelectedOptionIds().isEmpty()) {
                        return a.getSelectedOptionIds().stream();
                    } else if (a.getSelectedOptionId() != null && a.getSelectedOptionId() != -1) {
                        return List.of(a.getSelectedOptionId()).stream();
                    }
                    return List.<Long>of().stream();
                })
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

            // Xử lý câu hỏi nhiều đáp án
            List<Long> selectedIds = dto.getSelectedOptionIds();

            // Tương thích ngược với selectedOptionId
            if ((selectedIds == null || selectedIds.isEmpty()) && dto.getSelectedOptionId() != null) {
                if (dto.getSelectedOptionId() == -1) {
                    selectedIds = new ArrayList<>();
                } else {
                    selectedIds = List.of(dto.getSelectedOptionId());
                }
            }

            // Handle unanswered question
            if (selectedIds == null || selectedIds.isEmpty()) {
                answer.setSelectedOption(null);
                answer.setSelectedOptions(new ArrayList<>());
                answer.setIsCorrect(false);
            } else {
                List<QuestionOption> selectedOptions = new ArrayList<>();

                for (Long optionId : selectedIds) {
                    QuestionOption selected = optionMap.get(optionId);
                    if (selected == null) {
                        throw new InvalidException("Option with id " + optionId + " not found");
                    }

                    if (selected.getQuestion().getId() != (question.getId())) {
                        throw new InvalidException(
                                "Option " + selected.getId() + " does not belong to question " + question.getId());
                    }

                    selectedOptions.add(selected);
                }

                // Lấy tất cả đáp án đúng của câu hỏi
                List<QuestionOption> correctOptions = question.getOptions().stream()
                        .filter(opt -> Boolean.TRUE.equals(opt.getIsCorrect()))
                        .collect(Collectors.toList());

                // Kiểm tra câu trả lời đúng:
                // - Số lượng đáp án chọn phải bằng số đáp án đúng
                // - Tất cả đáp án chọn phải đúng
                boolean isCorrect = selectedOptions.size() == correctOptions.size() &&
                        selectedOptions.stream().allMatch(opt -> Boolean.TRUE.equals(opt.getIsCorrect()));

                if (isCorrect) {
                    correctCount++;
                }

                // Lưu cả 2 để tương thích
                answer.setSelectedOption(selectedOptions.isEmpty() ? null : selectedOptions.get(0));
                answer.setSelectedOptions(selectedOptions);
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

        if (submission.getStartedAt() != null) {
            long timeSpentSeconds = submission.getSubmittedAt().getEpochSecond()
                    - submission.getStartedAt().getEpochSecond();
            submission.setTimeSpent(timeSpentSeconds);
        }

        submission.getAnswers().addAll(submissionAnswers);
        Submission saved = submissionRepository.save(submission);

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

            // Trả về nhiều đáp án nếu có
            if (answer.getSelectedOptions() != null && !answer.getSelectedOptions().isEmpty()) {
                dto.setSelectedOptionIds(answer.getSelectedOptions().stream()
                        .map(QuestionOption::getId)
                        .collect(Collectors.toList()));
            } else if (answer.getSelectedOption() != null) {
                dto.setSelectedOptionIds(List.of(answer.getSelectedOption().getId()));
            }

            // Tương thích ngược
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
                .map((s) -> {
                    if (s.getSubject().getStatus() == SubjectStatus.DELETED) {
                        return null;
                    }
                    return convertToDTO(s);
                }

                )
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    public ResStudentAnalytics getUserAnalytics(Long userId, Integer days) {
        List<Submission> allSubmissions = submissionRepository.findByStudentIdOrderBySubmittedAtDesc(userId);

        // Filter submissions by time range if days is specified
        List<Submission> filteredSubmissions = allSubmissions;
        if (days != null && days > 0) {
            Instant cutoffDate = Instant.now().minus(days, java.time.temporal.ChronoUnit.DAYS);
            filteredSubmissions = allSubmissions.stream()
                    .filter(s -> s.getSubmittedAt() != null && s.getSubmittedAt().isAfter(cutoffDate))
                    .collect(Collectors.toList());
        }

        // Total quizzes completed
        int totalQuizzes = (int) filteredSubmissions.stream()
                .filter(submit -> submit.getStatus() == SubmissionStatus.SUBMITTED)
                .count();

        // Average accuracy
        double avgAccuracy = filteredSubmissions.stream()
                .filter(submit -> submit.getStatus() == SubmissionStatus.SUBMITTED)
                .mapToDouble(submit -> submit.getScore() != null ? submit.getScore() : 0.0)
                .average()
                .orElse(0.0);

        // Active days
        long activeDays = filteredSubmissions.stream()
                .filter(submit -> submit.getSubmittedAt() != null)
                .map(submit -> LocalDate.ofInstant(submit.getSubmittedAt(), ZoneId.systemDefault()))
                .distinct()
                .count();

        // Total time spent (in seconds)
        long totalTimeSpent = filteredSubmissions.stream()
                .filter(s -> s.getTimeSpent() != null)
                .mapToLong(Submission::getTimeSpent)
                .sum();

        // Subject statistics
        Map<String, Long> subjectCounts = filteredSubmissions.stream()
                .filter(s -> s.getStatus() == SubmissionStatus.SUBMITTED)
                .collect(Collectors.groupingBy(
                        s -> s.getSubject().getName(),
                        Collectors.counting()));

        List<ResStudentAnalytics.SubjectStats> subjectStats = subjectCounts.entrySet().stream()
                .map(e -> new ResStudentAnalytics.SubjectStats(e.getKey(), e.getValue().intValue()))
                .collect(Collectors.toList());

        // Accuracy by subject
        Map<String, Double> subjectAccuracy = filteredSubmissions.stream()
                .filter(s -> s.getStatus() == SubmissionStatus.SUBMITTED)
                .collect(Collectors.groupingBy(
                        s -> s.getSubject().getName(),
                        Collectors.averagingDouble(s -> s.getScore() != null ? s.getScore() : 0.0)));

        List<ResStudentAnalytics.AccuracyBySubject> accuracyBySubject = subjectAccuracy.entrySet().stream()
                .map(e -> new ResStudentAnalytics.AccuracyBySubject(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // Recent activity (daily)
        Map<LocalDate, List<Submission>> dailySubmissions = filteredSubmissions.stream()
                .filter(s -> s.getSubmittedAt() != null && s.getStatus() == SubmissionStatus.SUBMITTED)
                .collect(Collectors.groupingBy(
                        s -> LocalDate.ofInstant(s.getSubmittedAt(), ZoneId.systemDefault()),
                        LinkedHashMap::new,
                        Collectors.toList()));

        List<ResStudentAnalytics.DailyActivity> recentActivity = dailySubmissions.entrySet().stream()
                .sorted(Map.Entry.<LocalDate, List<Submission>>comparingByKey().reversed())
                .limit(30)
                .map(e -> {
                    LocalDate date = e.getKey();
                    List<Submission> submissions = e.getValue();
                    int count = submissions.size();
                    double avgScore = submissions.stream()
                            .mapToDouble(s -> s.getScore() != null ? s.getScore() : 0.0)
                            .average()
                            .orElse(0.0);
                    return new ResStudentAnalytics.DailyActivity(date.toString(), count, avgScore);
                })
                .collect(Collectors.toList());

        return new ResStudentAnalytics(
                totalQuizzes,
                avgAccuracy,
                (int) activeDays,
                totalTimeSpent,
                subjectStats,
                accuracyBySubject,
                recentActivity);
    }
}
