package com.tnntruong.quiznote.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.dto.response.ResResultPagination;
import com.tnntruong.quiznote.dto.response.subject.ResSubjectDTO;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.util.SecurityUtil;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class SubjectService {

    private final FileService fileService;

    private final UserService userService;

    private SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository, UserService userService, FileService fileService) {
        this.subjectRepository = subjectRepository;
        this.userService = userService;
        this.fileService = fileService;
    }

    public ResSubjectDTO handleCreateSubject(Subject subject, String fileUrl) throws InvalidException {
        User currentUser = this.userService.handleGetCurrentUser();
        if (currentUser == null) {
            throw new InvalidException("user create subject invalid");
        }
        subject.setSeller(currentUser);
        Subject savedSubject = this.subjectRepository.save(subject);
        if (fileUrl != null) {
            savedSubject.setImageUrl(fileUrl);

        }
        savedSubject = this.subjectRepository.save(savedSubject);
        return this.convertSubjectToDTO(savedSubject);
    }

    public ResSubjectDTO handleUpdateSubject(Subject subject) throws InvalidException {
        if (subject.getId() == null) {
            throw new InvalidException("must have subject id");
        }
        Optional<Subject> subjectOptional = this.subjectRepository.findById(subject.getId());
        if (subjectOptional.isEmpty()) {
            throw new InvalidException("subject with id = " + subject.getId() + " not found");
        }
        Subject currentSubject = subjectOptional.get();
        currentSubject.setName(subject.getName());
        currentSubject.setPrice(subject.getPrice());
        currentSubject.setStatus(subject.getStatus());
        currentSubject.setDescription(subject.getDescription());
        currentSubject.setImageUrl(subject.getImageUrl());
        currentSubject.setAverageRating(subject.getAverageRating());
        currentSubject.setRatingCount(subject.getRatingCount());
        Subject savedSubject = this.subjectRepository.save(currentSubject);
        return this.convertSubjectToDTO(savedSubject);
    }

    public ResSubjectDTO convertSubjectToDTO(Subject subject) {
        ResSubjectDTO res = new ResSubjectDTO();

        ResSubjectDTO.CreateUser user = new ResSubjectDTO.CreateUser();
        user.setId(subject.getSeller().getId());
        user.setUsername(subject.getSeller().getEmail());

        res.setId(subject.getId());
        res.setName(subject.getName());
        res.setDescription(subject.getDescription());
        res.setPrice(subject.getPrice());
        res.setStatus(subject.getStatus());
        res.setAverageRating(subject.getAverageRating());
        res.setRatingCount(subject.getRatingCount());
        res.setImageUrl(subject.getImageUrl());
        res.setCreatedAt(subject.getCreatedAt());
        res.setUpdatedAt(subject.getUpdatedAt());
        res.setCreateUser(user);

        return res;
    }

    public void handleDeleteSubject(long id) throws InvalidException {
        boolean isExist = this.subjectRepository.existsById(id);
        if (!isExist) {
            throw new InvalidException("subject with id = " + id + " not found");
        }
        this.subjectRepository.deleteById(id);
    }

    public ResSubjectDTO handleGetSubjectById(long id) throws InvalidException {
        Optional<Subject> subjectOptional = this.subjectRepository.findById(id);
        if (subjectOptional.isEmpty()) {
            throw new InvalidException("subject with id = " + id + " not found");
        }
        return this.convertSubjectToDTO(subjectOptional.get());
    }

    public ResResultPagination handleGetAllSubject(Specification<Subject> spec, Pageable page) {
        Page<Subject> subjectPage = this.subjectRepository.findAll(spec, page);
        List<ResSubjectDTO> subjectList = subjectPage.stream().map((item) -> this.convertSubjectToDTO(item))
                .collect(Collectors.toList());

        ResResultPagination res = new ResResultPagination();
        ResResultPagination.Meta mt = new ResResultPagination.Meta();
        mt.setPage(subjectPage.getNumber() + 1);
        mt.setPageSize(subjectPage.getSize());
        mt.setPages(subjectPage.getTotalPages());
        mt.setTotal(subjectPage.getTotalElements());

        res.setMeta(mt);
        res.setResult(subjectList);

        return res;
    }
}
