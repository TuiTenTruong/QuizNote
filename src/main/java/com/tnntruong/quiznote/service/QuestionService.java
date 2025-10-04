package com.tnntruong.quiznote.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Chapter;
import com.tnntruong.quiznote.domain.Question;
import com.tnntruong.quiznote.domain.QuestionOption;
import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.repository.ChapterRepository;
import com.tnntruong.quiznote.repository.QuestionRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.service.request.ReqCreateQuestionDTO;
import com.tnntruong.quiznote.service.request.ReqUpdateQuestionDTO;
import com.tnntruong.quiznote.service.response.ResQuestionDTO;
import com.tnntruong.quiznote.service.response.ResQuestionDTO.ResOptionDTO;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class QuestionService {
    private QuestionRepository questionRepository;
    private SubjectRepository subjectRepository;
    private ChapterRepository chapterRepository;

    public QuestionService(QuestionRepository questionRepository, SubjectRepository subjectRepository,
            ChapterRepository chapterRepository) {
        this.questionRepository = questionRepository;
        this.subjectRepository = subjectRepository;
        this.chapterRepository = chapterRepository;
    }

    public ResQuestionDTO hanleCreateQuestion(ReqCreateQuestionDTO dto) throws InvalidException {
        Question question = new Question();
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new InvalidException("Subject not found"));
        if (dto.getChapterId() != null) {
            Chapter chapter = chapterRepository.findById(dto.getChapterId())
                    .orElseThrow(() -> new InvalidException("Chapter not found"));
            question.setChapter(chapter);
        }
        question.setSubject(subject);
        question.setContent(dto.getContent());
        question.setExplanation(dto.getExplanation());

        List<QuestionOption> options = dto.getOptions().stream().map(opt -> {
            QuestionOption option = new QuestionOption();
            option.setContent(opt.getContent());
            option.setIsCorrect(opt.getIsCorrect());
            option.setOptionOrder(opt.getOptionOrder());

            option.setQuestion(question);

            return option;
        }).collect(Collectors.toList());

        question.setOptions(options);
        Question saved = questionRepository.save(question);

        return convertToDTO(saved);
    }

    public ResQuestionDTO handleGetQuestionById(String id) throws InvalidException {
        try {
            Long idQuestion = Long.parseLong(id);
            Question question = this.questionRepository.findById(idQuestion)
                    .orElseThrow(() -> new InvalidException("question with id = " + idQuestion + " not found"));
            return convertToDTO(question);
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

    public ResQuestionDTO handleUpdateQuestion(ReqUpdateQuestionDTO questionDTO) throws InvalidException {
        Question question = questionRepository.findById(questionDTO.getId())
                .orElseThrow(() -> new InvalidException("Question not found"));

        Chapter chapter = null;
        if (questionDTO.getChapterId() != null) {
            chapter = chapterRepository.findById(questionDTO.getChapterId())
                    .orElseThrow(() -> new InvalidException("Chapter not found"));
        }

        question.setContent(questionDTO.getContent());
        question.setExplanation(questionDTO.getExplanation());
        question.setChapter(chapter);

        question.getOptions().clear();
        List<QuestionOption> options = questionDTO.getOptions().stream().map(opt -> {
            QuestionOption o = new QuestionOption();
            o.setContent(opt.getContent());
            o.setIsCorrect(opt.getIsCorrect());
            o.setOptionOrder(opt.getOptionOrder());
            o.setQuestion(question);
            return o;
        }).collect(Collectors.toList());

        question.getOptions().addAll(options);
        return convertToDTO(questionRepository.save(question));
    }

    public void handleDeleteQuestionById(String id) throws InvalidException {
        try {
            Long questionId = Long.parseLong(id);
            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new InvalidException("Question not found"));
            questionRepository.delete(question);
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

    public List<ResQuestionDTO> handleGetQuestionBySubjectId(String id) throws InvalidException {
        try {
            Long idSubject = Long.parseLong(id);
            boolean isExistById = this.subjectRepository.existsById(idSubject);
            if (!isExistById) {
                throw new InvalidException("subject with id = " + idSubject + " not found");
            }
            List<Question> questions = this.questionRepository.findAllBySubjectId(idSubject)
                    .orElseThrow(() -> new InvalidException("fail to load questions"));
            List<ResQuestionDTO> res = questions.stream().map((ques) -> convertToDTO(ques))
                    .collect(Collectors.toList());
            return res;
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

    public List<ResQuestionDTO> handleGetQuestionByChapterId(String id) throws InvalidException {
        try {
            Long idChapter = Long.parseLong(id);
            boolean isExistById = this.chapterRepository.existsById(idChapter);
            if (!isExistById) {
                throw new InvalidException("chapter with id = " + idChapter + " not found");
            }
            List<Question> questions = this.questionRepository.findAllByChapterId(idChapter)
                    .orElseThrow(() -> new InvalidException("fail to load questions"));
            List<ResQuestionDTO> res = questions.stream().map((ques) -> convertToDTO(ques))
                    .collect(Collectors.toList());
            return res;
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

    private ResQuestionDTO convertToDTO(Question q) {
        List<ResOptionDTO> optionDTOs = q.getOptions().stream()
                .map(o -> new ResOptionDTO(o.getId(), o.getContent(), o.getIsCorrect(), o.getOptionOrder()))
                .collect(Collectors.toList());

        return new ResQuestionDTO(
                q.getId(),
                q.getContent(),
                q.getExplanation(),
                q.getSubject().getId(),
                q.getChapter() != null ? q.getChapter().getId() : null,
                optionDTOs);
    }
}
