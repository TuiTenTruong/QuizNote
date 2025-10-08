package com.tnntruong.quiznote.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Chapter;
import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.repository.ChapterRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.service.request.ReqCreateChapterDTO;
import com.tnntruong.quiznote.service.request.ReqUpdateChapterDTO;
import com.tnntruong.quiznote.service.response.ResChapterDTO;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class ChapterService {

    private ChapterRepository chapterRepository;
    private SubjectRepository subjectRepository;

    public ChapterService(ChapterRepository chapterRepository, SubjectRepository subjectRepository) {
        this.chapterRepository = chapterRepository;
        this.subjectRepository = subjectRepository;
    }

    public ResChapterDTO handleCreateChapter(ReqCreateChapterDTO chapterDTO) throws InvalidException {
        Subject subject = this.subjectRepository.findById(chapterDTO.getSubjectId())
                .orElseThrow(
                        () -> new InvalidException("subject with id = " + chapterDTO.getSubjectId() + " not found"));

        Chapter chapter = new Chapter();
        chapter.setSubject(subject);
        chapter.setName(chapterDTO.getName());
        return this.convertChapterDTO(this.chapterRepository.save(chapter));
    }

    public ResChapterDTO handleUpdateChapter(ReqUpdateChapterDTO chapterDTO) throws InvalidException {
        Chapter currentChapter = this.chapterRepository.findById(chapterDTO.getId())
                .orElseThrow(() -> new InvalidException("chapter with id = " + chapterDTO.getId() + " not found"));
        currentChapter.setName(chapterDTO.getName());
        return this.convertChapterDTO(this.chapterRepository.save(currentChapter));
    }

    public ResChapterDTO convertChapterDTO(Chapter chapter) {
        ResChapterDTO res = new ResChapterDTO();
        res.setId(chapter.getId());
        res.setName(chapter.getName());
        res.setSubjectId(chapter.getSubject().getId());
        res.setCreatedBy(chapter.getCreatedBy());
        res.setCreatedAt(chapter.getCreatedAt());
        res.setUpdatedBy(chapter.getUpdatedBy());
        res.setUpdatedAt(chapter.getUpdatedAt());
        return res;
    }

    public List<ResChapterDTO> hanldeGetChapterBySubjectId(String subjectId) throws InvalidException {
        try {
            Long id = Long.parseLong(subjectId);
            boolean isExistById = this.subjectRepository.existsById(id);
            if (!isExistById) {
                throw new InvalidException("Subject with id = " + id + " now found");
            }
            return this.chapterRepository.findBySubjectId(id).stream().map((item) -> convertChapterDTO(item))
                    .collect(Collectors.toList());
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

    public void handleDeleteChapter(String id) throws InvalidException {
        try {
            Long idChapter = Long.parseLong(id);
            Chapter chapter = chapterRepository.findById(idChapter)
                    .orElseThrow(() -> new InvalidException("Chapter not found"));
            chapterRepository.delete(chapter);
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }
}
