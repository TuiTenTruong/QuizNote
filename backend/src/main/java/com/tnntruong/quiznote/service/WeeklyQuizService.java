package com.tnntruong.quiznote.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tnntruong.quiznote.domain.Question;
import com.tnntruong.quiznote.domain.QuestionOption;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.domain.WeeklyQuiz;
import com.tnntruong.quiznote.domain.WeeklyQuizAnswer;
import com.tnntruong.quiznote.domain.WeeklyQuizQuestion;
import com.tnntruong.quiznote.domain.WeeklyQuizSubmission;
import com.tnntruong.quiznote.domain.WeeklyStreak;
import com.tnntruong.quiznote.dto.request.ReqWeeklyQuizDTO;
import com.tnntruong.quiznote.dto.request.ReqWeeklyQuizSubmitDTO;
import com.tnntruong.quiznote.dto.response.ResResultPagination;
import com.tnntruong.quiznote.dto.response.ResWeeklyQuizDTO;
import com.tnntruong.quiznote.dto.response.ResWeeklyQuizStatusDTO;
import com.tnntruong.quiznote.dto.response.ResWeeklyQuizSubmitResultDTO;
import com.tnntruong.quiznote.repository.QuestionOptionRepository;
import com.tnntruong.quiznote.repository.QuestionRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.repository.WeeklyQuizAnswerRepository;
import com.tnntruong.quiznote.repository.WeeklyQuizQuestionRepository;
import com.tnntruong.quiznote.repository.WeeklyQuizRepository;
import com.tnntruong.quiznote.repository.WeeklyQuizSubmissionRepository;
import com.tnntruong.quiznote.repository.WeeklyStreakRepository;
import com.tnntruong.quiznote.util.SecurityUtil;
import com.tnntruong.quiznote.util.constant.QuestionTypeEnum;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class WeeklyQuizService {
    private final WeeklyQuizRepository weeklyQuizRepository;
    private final WeeklyQuizQuestionRepository weeklyQuizQuestionRepository;
    private final WeeklyQuizSubmissionRepository weeklyQuizSubmissionRepository;
    private final WeeklyQuizAnswerRepository weeklyQuizAnswerRepository;
    private final WeeklyStreakRepository weeklyStreakRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;
    private final UserRepository userRepository;

    public WeeklyQuizService(
            WeeklyQuizRepository weeklyQuizRepository,
            WeeklyQuizQuestionRepository weeklyQuizQuestionRepository,
            WeeklyQuizSubmissionRepository weeklyQuizSubmissionRepository,
            WeeklyQuizAnswerRepository weeklyQuizAnswerRepository,
            WeeklyStreakRepository weeklyStreakRepository,
            QuestionRepository questionRepository,
            QuestionOptionRepository questionOptionRepository,
            UserRepository userRepository) {
        this.weeklyQuizRepository = weeklyQuizRepository;
        this.weeklyQuizQuestionRepository = weeklyQuizQuestionRepository;
        this.weeklyQuizSubmissionRepository = weeklyQuizSubmissionRepository;
        this.weeklyQuizAnswerRepository = weeklyQuizAnswerRepository;
        this.weeklyStreakRepository = weeklyStreakRepository;
        this.questionRepository = questionRepository;
        this.questionOptionRepository = questionOptionRepository;
        this.userRepository = userRepository;
    }

    // Admin: Tạo Weekly Quiz mới
    @Transactional
    public ResWeeklyQuizDTO createWeeklyQuiz(ReqWeeklyQuizDTO reqDTO, String[] imageFiles) throws InvalidException {
        // Kiểm tra xem đã tồn tại weekly quiz cho tuần này chưa
        Optional<WeeklyQuiz> existing = weeklyQuizRepository.findByYearAndWeekNumber(
                reqDTO.getYear(), reqDTO.getWeekNumber());
        if (existing.isPresent()) {
            throw new InvalidException("Weekly quiz cho tuần này đã tồn tại");
        }

        WeeklyQuiz weeklyQuiz = new WeeklyQuiz();
        weeklyQuiz.setTitle(reqDTO.getTitle());
        weeklyQuiz.setDescription(reqDTO.getDescription());
        weeklyQuiz.setYear(reqDTO.getYear());
        weeklyQuiz.setWeekNumber(reqDTO.getWeekNumber());
        weeklyQuiz.setDifficulty(reqDTO.getDifficulty());
        weeklyQuiz.setStartDate(reqDTO.getStartDate());
        weeklyQuiz.setEndDate(reqDTO.getEndDate());
        weeklyQuiz.setActive(true);

        weeklyQuiz = weeklyQuizRepository.save(weeklyQuiz);

        // Tạo các câu hỏi mới cho weekly quiz
        for (int i = 0; i < reqDTO.getQuestions().size(); i++) {
            ReqWeeklyQuizDTO.QuestionDTO qDto = reqDTO.getQuestions().get(i);

            // Tạo Question mới
            Question question = new Question();
            question.setContent(qDto.getContent());
            // Set imageUrl from uploaded file
            if (imageFiles != null && i < imageFiles.length && imageFiles[i] != null) {
                question.setImageUrl(imageFiles[i]);
            }
            question.setType(QuestionTypeEnum.ONE_CHOICE);
            // Weekly quiz questions không thuộc subject nào cụ thể, có thể để null hoặc tạo
            // subject đặc biệt
            question = questionRepository.save(question);

            // Tạo các options cho câu hỏi
            for (ReqWeeklyQuizDTO.OptionDTO optDto : qDto.getOptions()) {
                QuestionOption option = new QuestionOption();
                option.setContent(optDto.getContent());
                option.setIsCorrect(optDto.getIsCorrect());
                option.setQuestion(question);
                questionOptionRepository.save(option);
            }

            // Liên kết câu hỏi với weekly quiz
            WeeklyQuizQuestion wqq = new WeeklyQuizQuestion();
            wqq.setWeeklyQuiz(weeklyQuiz);
            wqq.setQuestion(question);
            wqq.setOrderIndex(i + 1);
            weeklyQuizQuestionRepository.save(wqq);
        }

        return convertToDTO(weeklyQuiz, true);
    } // Admin: Cập nhật Weekly Quiz

    @Transactional
    public ResWeeklyQuizDTO updateWeeklyQuiz(long id, ReqWeeklyQuizDTO reqDTO, String[] imageFiles)
            throws InvalidException {
        WeeklyQuiz weeklyQuiz = weeklyQuizRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Không tìm thấy weekly quiz"));

        // Kiểm tra nếu thay đổi year/week thì không được trùng với quiz khác
        if (weeklyQuiz.getYear() != reqDTO.getYear() ||
                weeklyQuiz.getWeekNumber() != reqDTO.getWeekNumber()) {
            Optional<WeeklyQuiz> existing = weeklyQuizRepository.findByYearAndWeekNumber(
                    reqDTO.getYear(), reqDTO.getWeekNumber());
            if (existing.isPresent() && existing.get().getId() != id) {
                throw new InvalidException("Weekly quiz cho tuần này đã tồn tại");
            }
        }

        weeklyQuiz.setTitle(reqDTO.getTitle());
        weeklyQuiz.setDescription(reqDTO.getDescription());
        weeklyQuiz.setYear(reqDTO.getYear());
        weeklyQuiz.setWeekNumber(reqDTO.getWeekNumber());
        weeklyQuiz.setDifficulty(reqDTO.getDifficulty());
        weeklyQuiz.setStartDate(reqDTO.getStartDate());
        weeklyQuiz.setEndDate(reqDTO.getEndDate());

        // Cập nhật danh sách câu hỏi
        if (reqDTO.getQuestions() != null && !reqDTO.getQuestions().isEmpty()) {
            // Xóa tất cả answers của các submissions thuộc weekly quiz này
            weeklyQuizAnswerRepository.deleteByWeeklySubmission_WeeklyQuizId(id);
            // Lấy danh sách câu hỏi cũ trước
            List<WeeklyQuizQuestion> oldQuestions = weeklyQuizQuestionRepository
                    .findByWeeklyQuizIdOrderByOrderIndexAsc(id);

            // Xóa các liên kết WeeklyQuizQuestion trước
            weeklyQuizQuestionRepository.deleteByWeeklyQuizId(id);

            // Sau đó mới xóa các Question cũ (và options sẽ bị xóa theo cascade)
            for (WeeklyQuizQuestion wqq : oldQuestions) {
                questionRepository.delete(wqq.getQuestion());
            }

            // Tạo câu hỏi mới
            for (int i = 0; i < reqDTO.getQuestions().size(); i++) {
                ReqWeeklyQuizDTO.QuestionDTO qDto = reqDTO.getQuestions().get(i);

                // Tạo Question mới
                Question question = new Question();
                question.setContent(qDto.getContent());
                // Set imageUrl from uploaded file or keep existing from DTO
                if (imageFiles != null && i < imageFiles.length && imageFiles[i] != null) {
                    question.setImageUrl(imageFiles[i]);
                } else if (qDto.getImageUrl() != null && !qDto.getImageUrl().isEmpty()) {
                    question.setImageUrl(qDto.getImageUrl());
                }
                question.setType(com.tnntruong.quiznote.util.constant.QuestionTypeEnum.ONE_CHOICE);
                question = questionRepository.save(question);

                // Tạo các options cho câu hỏi
                for (ReqWeeklyQuizDTO.OptionDTO optDto : qDto.getOptions()) {
                    QuestionOption option = new QuestionOption();
                    option.setContent(optDto.getContent());
                    option.setIsCorrect(optDto.getIsCorrect());
                    option.setQuestion(question);
                    questionOptionRepository.save(option);
                }

                // Liên kết câu hỏi với weekly quiz
                WeeklyQuizQuestion wqq = new WeeklyQuizQuestion();
                wqq.setWeeklyQuiz(weeklyQuiz);
                wqq.setQuestion(question);
                wqq.setOrderIndex(i + 1);
                weeklyQuizQuestionRepository.save(wqq);
            }
        }

        weeklyQuiz = weeklyQuizRepository.save(weeklyQuiz);
        return convertToDTO(weeklyQuiz, true);
    }

    // Admin: Xóa Weekly Quiz
    @Transactional
    public void deleteWeeklyQuiz(long id) throws InvalidException {
        WeeklyQuiz weeklyQuiz = weeklyQuizRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Không tìm thấy weekly quiz"));

        weeklyQuizRepository.delete(weeklyQuiz);
    }

    // Admin: Lấy danh sách tất cả Weekly Quiz (có phân trang)
    public ResResultPagination getAllWeeklyQuizzes(Specification<WeeklyQuiz> spec, Pageable pageable) {
        Page<WeeklyQuiz> page = weeklyQuizRepository.findAll(spec, pageable);

        List<ResWeeklyQuizDTO> list = page.getContent().stream()
                .map(wq -> convertToDTO(wq, false))
                .collect(Collectors.toList());

        ResResultPagination result = new ResResultPagination();
        ResResultPagination.Meta meta = new ResResultPagination.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(page.getTotalPages());
        meta.setTotal(page.getTotalElements());

        result.setMeta(meta);
        result.setResult(list);
        return result;
    }

    // Admin: Lấy chi tiết Weekly Quiz
    public ResWeeklyQuizDTO getWeeklyQuizById(long id) throws InvalidException {
        WeeklyQuiz weeklyQuiz = weeklyQuizRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Không tìm thấy weekly quiz"));
        return convertToDTO(weeklyQuiz, true);
    }

    // Student: Lấy Weekly Quiz hiện tại
    public ResWeeklyQuizDTO getCurrentWeeklyQuiz() throws InvalidException {
        WeeklyQuiz weeklyQuiz = weeklyQuizRepository.findTopByIsActiveTrueOrderByYearDescWeekNumberDesc()
                .orElseThrow(() -> new InvalidException("Không tìm thấy weekly quiz hiện tại"));
        return convertToDTO(weeklyQuiz, true);
    }

    // Student: Lấy trạng thái Weekly Quiz của user
    public ResWeeklyQuizStatusDTO getWeeklyQuizStatus(long weeklyQuizId) throws InvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InvalidException("Bạn chưa đăng nhập"));
        User student = userRepository.findByEmail(email);
        if (student == null) {
            throw new InvalidException("Không tìm thấy user");
        }

        WeeklyQuiz weeklyQuiz = weeklyQuizRepository.findById(weeklyQuizId)
                .orElseThrow(() -> new InvalidException("Không tìm thấy weekly quiz"));

        // Kiểm tra xem đã làm chưa
        Optional<WeeklyQuizSubmission> submission = weeklyQuizSubmissionRepository
                .findByWeeklyQuizIdAndStudentId(weeklyQuizId, student.getId());

        ResWeeklyQuizStatusDTO status = new ResWeeklyQuizStatusDTO();

        if (submission.isPresent()) {
            WeeklyQuizSubmission sub = submission.get();
            status.setHasPlayed(true);
            status.setScore(sub.getScore());
            status.setCoinsEarned(sub.getCoinsEarned());
            status.setAccuracyPercent(sub.getAccuracyPercent());
            status.setTimeTaken(sub.getTimeTaken());
            status.setSubmittedAt(sub.getSubmittedAt());
        } else {
            status.setHasPlayed(false);
        }

        // Lấy thông tin streak
        Optional<WeeklyStreak> streak = weeklyStreakRepository.findByStudentId(student.getId());
        if (streak.isPresent()) {
            status.setCurrentStreak(streak.get().getCurrentStreak());
            status.setLongestStreak(streak.get().getLongestStreak());
            status.setTotalStreakBonus(streak.get().getTotalStreakBonus());
        } else {
            status.setCurrentStreak(0);
            status.setLongestStreak(0);
            status.setTotalStreakBonus(0);
        }

        return status;
    }

    // Student: Nộp bài Weekly Quiz
    @Transactional
    public ResWeeklyQuizSubmitResultDTO submitWeeklyQuiz(ReqWeeklyQuizSubmitDTO reqDTO) throws InvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InvalidException("Bạn chưa đăng nhập"));

        User student = userRepository.findByEmail(email);
        if (student == null) {
            throw new InvalidException("Không tìm thấy user");
        }

        WeeklyQuiz weeklyQuiz = weeklyQuizRepository.findById(reqDTO.getWeeklyQuizId())
                .orElseThrow(() -> new InvalidException("Không tìm thấy weekly quiz"));

        // Kiểm tra đã làm chưa
        Optional<WeeklyQuizSubmission> existing = weeklyQuizSubmissionRepository
                .findByWeeklyQuizIdAndStudentId(reqDTO.getWeeklyQuizId(), student.getId());
        if (existing.isPresent()) {
            throw new InvalidException("Bạn đã hoàn thành weekly quiz này rồi");
        }

        // Lấy danh sách câu hỏi
        List<WeeklyQuizQuestion> weeklyQuestions = weeklyQuizQuestionRepository
                .findByWeeklyQuizIdOrderByOrderIndexAsc(reqDTO.getWeeklyQuizId());

        // Chấm điểm
        int correctCount = 0;
        WeeklyQuizSubmission submission = new WeeklyQuizSubmission();
        submission.setWeeklyQuiz(weeklyQuiz);
        submission.setStudent(student);
        submission.setTimeTaken(reqDTO.getTimeTaken());

        submission = weeklyQuizSubmissionRepository.save(submission);

        for (WeeklyQuizQuestion wqq : weeklyQuestions) {
            Question question = wqq.getQuestion();
            Long selectedOptionId = reqDTO.getAnswers().get(question.getId());

            WeeklyQuizAnswer answer = new WeeklyQuizAnswer();
            answer.setWeeklySubmission(submission);
            answer.setQuestion(question);

            if (selectedOptionId != null) {
                QuestionOption selectedOption = questionOptionRepository.findById(selectedOptionId)
                        .orElse(null);
                answer.setSelectedOption(selectedOption);

                if (selectedOption != null && selectedOption.getIsCorrect()) {
                    answer.setCorrect(true);
                    correctCount++;
                } else {
                    answer.setCorrect(false);
                }
            } else {
                answer.setCorrect(false);
            }

            weeklyQuizAnswerRepository.save(answer);
        }

        // Tính điểm và xu
        double accuracyPercent = (correctCount * 100.0) / weeklyQuiz.getQuestionCount();
        int baseCoins = (int) Math
                .round((correctCount * 1.0 / weeklyQuiz.getQuestionCount()) * weeklyQuiz.getMaxRewardCoins());

        submission.setScore(correctCount);
        submission.setAccuracyPercent(accuracyPercent);

        // Cập nhật streak và tính bonus
        String currentWeekKey = weeklyQuiz.getYear() + "-" + weeklyQuiz.getWeekNumber();
        WeeklyStreak streak = weeklyStreakRepository.findByStudentId(student.getId())
                .orElse(new WeeklyStreak());

        if (streak.getId() == 0) {
            streak.setStudent(student);
        }

        int streakBonus = 0;
        String lastWeek = streak.getLastCompletedWeek();

        // Kiểm tra tuần liên tiếp
        boolean isConsecutive = false;
        if (lastWeek != null) {
            String[] parts = lastWeek.split("-");
            int lastYear = Integer.parseInt(parts[0]);
            int lastWeekNum = Integer.parseInt(parts[1]);

            // Kiểm tra xem có phải tuần liền kề không
            if ((weeklyQuiz.getYear() == lastYear && weeklyQuiz.getWeekNumber() == lastWeekNum + 1) ||
                    (weeklyQuiz.getYear() == lastYear + 1 && weeklyQuiz.getWeekNumber() == 1 && lastWeekNum >= 52)) {
                isConsecutive = true;
            }
        }

        if (isConsecutive || lastWeek == null) {
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                streak.setLongestStreak(streak.getCurrentStreak());
            }

            // Tính bonus: mỗi tuần streak +10% coins (tối đa +50%)
            int streakMultiplier = Math.min(streak.getCurrentStreak() - 1, 5);
            streakBonus = (int) Math.round(baseCoins * streakMultiplier * 0.1);
        } else {
            // Reset streak nếu không liên tiếp
            streak.setCurrentStreak(1);
        }

        streak.setLastCompletedWeek(currentWeekKey);
        streak.setTotalStreakBonus(streak.getTotalStreakBonus() + streakBonus);
        weeklyStreakRepository.save(streak);

        int totalCoins = baseCoins + streakBonus;
        submission.setCoinsEarned(totalCoins);
        weeklyQuizSubmissionRepository.save(submission);

        // Cộng xu cho user
        student.setCoins(student.getCoins() + totalCoins);
        userRepository.save(student);

        // Tạo response
        ResWeeklyQuizSubmitResultDTO result = new ResWeeklyQuizSubmitResultDTO();
        result.setScore(correctCount);
        result.setTotalQuestions(weeklyQuiz.getQuestionCount());
        result.setAccuracyPercent(accuracyPercent);
        result.setCoinsEarned(totalCoins);
        result.setStreakBonus(streakBonus);
        result.setCurrentStreak(streak.getCurrentStreak());
        result.setTimeTaken(reqDTO.getTimeTaken());
        result.setMessage(String.format("Bạn đã hoàn thành Weekly Quiz! Nhận được %d xu (Base: %d + Streak bonus: %d)",
                totalCoins, baseCoins, streakBonus));

        return result;
    }

    // Helper: Convert entity to DTO
    private ResWeeklyQuizDTO convertToDTO(WeeklyQuiz weeklyQuiz, boolean includeQuestions) {
        ResWeeklyQuizDTO dto = new ResWeeklyQuizDTO();
        dto.setId(weeklyQuiz.getId());
        dto.setTitle(weeklyQuiz.getTitle());
        dto.setDescription(weeklyQuiz.getDescription());
        dto.setYear(weeklyQuiz.getYear());
        dto.setWeekNumber(weeklyQuiz.getWeekNumber());
        dto.setWeekLabel("Week " + weeklyQuiz.getWeekNumber() + " · " + weeklyQuiz.getYear());
        dto.setQuestionCount(weeklyQuiz.getQuestionCount());
        dto.setDurationMinutes(weeklyQuiz.getDurationMinutes());
        dto.setMaxRewardCoins(weeklyQuiz.getMaxRewardCoins());
        dto.setDifficulty(weeklyQuiz.getDifficulty());
        dto.setStartDate(weeklyQuiz.getStartDate());
        dto.setEndDate(weeklyQuiz.getEndDate());
        dto.setActive(weeklyQuiz.isActive());
        dto.setCreatedAt(weeklyQuiz.getCreatedAt());
        dto.setCreatedBy(weeklyQuiz.getCreatedBy());

        if (includeQuestions) {
            List<WeeklyQuizQuestion> wqQuestions = weeklyQuizQuestionRepository
                    .findByWeeklyQuizIdOrderByOrderIndexAsc(weeklyQuiz.getId());

            List<ResWeeklyQuizDTO.ResQuestionDTO> questions = wqQuestions.stream()
                    .map(wqq -> {
                        Question q = wqq.getQuestion();
                        ResWeeklyQuizDTO.ResQuestionDTO qDto = new ResWeeklyQuizDTO.ResQuestionDTO();
                        qDto.setId(q.getId());
                        qDto.setContent(q.getContent());
                        qDto.setImageUrl(q.getImageUrl());

                        List<ResWeeklyQuizDTO.ResOptionDTO> options = q.getOptions().stream()
                                .map(opt -> new ResWeeklyQuizDTO.ResOptionDTO(opt.getId(), opt.getContent(),
                                        opt.getIsCorrect()))
                                .collect(Collectors.toList());
                        qDto.setOptions(options);

                        return qDto;
                    })
                    .collect(Collectors.toList());

            dto.setQuestions(questions);
        }

        return dto;
    }
}
