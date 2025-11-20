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
import com.tnntruong.quiznote.repository.PurchaseRepository;
import com.tnntruong.quiznote.util.constant.SubjectStatus;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class SubjectService {

    private final UserService userService;

    private SubjectRepository subjectRepository;
    private PurchaseRepository purchaseRepository;

    public SubjectService(SubjectRepository subjectRepository, UserService userService,
            PurchaseRepository purchaseRepository) {
        this.subjectRepository = subjectRepository;
        this.userService = userService;
        this.purchaseRepository = purchaseRepository;
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

    public ResSubjectDTO handleCreateDraftSubject(Subject subject) throws InvalidException {
        User currentUser = this.userService.handleGetCurrentUser();
        if (currentUser == null) {
            throw new InvalidException("user create subject invalid");
        }
        subject.setSeller(currentUser);
        subject.setStatus(SubjectStatus.DRAFT);
        Subject savedSubject = this.subjectRepository.save(subject);
        return this.convertSubjectToDTO(savedSubject);
    }

    public ResSubjectDTO handleUpdateSubject(Subject subject, String fileUrl) throws InvalidException {
        if (subject.getId() == null) {
            throw new InvalidException("must have subject id");
        }
        Optional<Subject> subjectOptional = this.subjectRepository.findById(subject.getId());
        if (subjectOptional.isEmpty()) {
            throw new InvalidException("subject with id = " + subject.getId() + " not found");
        }
        if (fileUrl != null) {
            subject.setImageUrl(fileUrl);
        }
        Subject currentSubject = subjectOptional.get();
        currentSubject.setName(subject.getName() != null ? subject.getName() : currentSubject.getName());
        currentSubject.setPrice(subject.getPrice() >= 0 ? subject.getPrice() : currentSubject.getPrice());
        currentSubject.setStatus(subject.getStatus() != null ? subject.getStatus() : currentSubject.getStatus());
        currentSubject.setDescription(
                subject.getDescription() != null ? subject.getDescription() : currentSubject.getDescription());
        currentSubject.setImageUrl(
                subject.getImageUrl() != null ? subject.getImageUrl() : currentSubject.getImageUrl());
        Subject savedSubject = this.subjectRepository.save(currentSubject);
        return this.convertSubjectToDTO(savedSubject);
    }

    public ResSubjectDTO convertSubjectToDTO(Subject subject) {
        ResSubjectDTO res = new ResSubjectDTO();

        ResSubjectDTO.CreateUser user = new ResSubjectDTO.CreateUser();
        user.setId(subject.getSeller().getId());
        user.setUsername(subject.getSeller().getEmail());
        user.setAvatarUrl(subject.getSeller().getAvatarUrl());
        res.setId(subject.getId());
        res.setName(subject.getName());
        res.setDescription(subject.getDescription());
        res.setPrice(subject.getPrice());
        res.setStatus(subject.getStatus());
        res.setAverageRating(subject.getAverageRating());
        res.setRatingCount(subject.getRatingCount());
        res.setPurchaseCount(subject.getPurchaseCount());
        res.setQuestionCount(subject.getQuestions().size());
        res.setImageUrl(subject.getImageUrl());
        res.setHighestScore(subject.getHighestScore());
        res.setCreatedAt(subject.getCreatedAt());
        res.setUpdatedAt(subject.getUpdatedAt());
        res.setCreateUser(user);

        return res;
    }

    public void handleDeleteSubject(long id) throws InvalidException {
        Subject subject = this.subjectRepository.findById(id)
                .orElseThrow(() -> new InvalidException("subject with id = " + id + " not found"));
        if (subject.getStatus() == SubjectStatus.DRAFT) {
            this.subjectRepository.delete(subject);
            return;
        }
        subject.setStatus(SubjectStatus.DELETED);
        this.subjectRepository.save(subject);
    }

    public ResSubjectDTO handleGetSubjectById(long id) throws InvalidException {
        Optional<Subject> subjectOptional = this.subjectRepository.findById(id);
        if (subjectOptional.isEmpty()) {
            throw new InvalidException("subject with id = " + id + " not found");
        }

        Subject subject = subjectOptional.get();

        // Kiểm tra nếu subject có status DELETED - không cho phép truy cập
        if (subject.getStatus() == SubjectStatus.DELETED) {
            throw new InvalidException("subject with id = " + id + " not found");
        }

        // Kiểm tra nếu subject có status INACTIVE
        if (subject.getStatus() == SubjectStatus.INACTIVE) {
            // Lấy user hiện tại
            User currentUser = this.userService.handleGetCurrentUser();

            // Nếu không có user hoặc user chưa mua subject này thì không cho phép truy cập
            if (currentUser == null ||
                    !this.purchaseRepository.findByStudentIdAndSubjectId(currentUser.getId(), id).isPresent()) {
                throw new InvalidException("This subject is currently inactive and not available for access");
            }
            // Nếu đã mua thì vẫn cho phép truy cập
        }

        return this.convertSubjectToDTO(subject);
    }

    public ResResultPagination handleGetAllSubject(Specification<Subject> spec, Pageable page) {
        // Thêm filter để loại bỏ các subject có status DELETED
        Specification<Subject> notDeletedSpec = (root, query, criteriaBuilder) -> 
            criteriaBuilder.notEqual(root.get("status"), SubjectStatus.DELETED);
        
        Specification<Subject> combinedSpec = spec == null ? notDeletedSpec : spec.and(notDeletedSpec);
        
        Page<Subject> subjectPage = this.subjectRepository.findAll(combinedSpec, page);
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

    public ResResultPagination handleGetSubjectBySellerId(long sellerId, Specification<Subject> spec, Pageable page) {
        Specification<Subject> sellerSpec = (root, query, criteriaBuilder) -> criteriaBuilder
                .equal(root.get("seller").get("id"), sellerId);
        
        // Thêm filter để loại bỏ các subject có status DELETED
        Specification<Subject> notDeletedSpec = (root, query, criteriaBuilder) -> 
            criteriaBuilder.notEqual(root.get("status"), SubjectStatus.DELETED);
        
        Specification<Subject> combinedSpec = spec == null ? sellerSpec.and(notDeletedSpec) : spec.and(sellerSpec).and(notDeletedSpec);

        Page<Subject> subjectPage = this.subjectRepository.findAll(combinedSpec, page);
        List<ResSubjectDTO> subjectList = subjectPage.stream()
                .map(this::convertSubjectToDTO)
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

    public ResSubjectDTO handleApproveSubject(long subjectId) throws InvalidException {
        Subject subject = this.subjectRepository.findById(subjectId)
                .orElseThrow(() -> new InvalidException("Subject with id = " + subjectId + " not found"));
        subject.setStatus(SubjectStatus.ACTIVE);
        Subject savedSubject = this.subjectRepository.save(subject);
        return this.convertSubjectToDTO(savedSubject);
    }

    public ResSubjectDTO handleRejectSubject(long subjectId) throws InvalidException {
        Subject subject = this.subjectRepository.findById(subjectId)
                .orElseThrow(() -> new InvalidException("Subject with id = " + subjectId + " not found"));
        subject.setStatus(SubjectStatus.REJECTED);
        Subject savedSubject = this.subjectRepository.save(subject);
        return this.convertSubjectToDTO(savedSubject);
    }

    public ResResultPagination getDemoSubject() {
        // get 6 highest purchaseCount subjects and status ACTIVE
        List<Subject> topSubjects = this.subjectRepository.findTop6ByStatusOrderByPurchaseCountDesc();
        ResResultPagination res = new ResResultPagination();
        if (!topSubjects.isEmpty()) {
            res.setResult(topSubjects.stream()
                    .map(this::convertSubjectToDTO)
                    .collect(Collectors.toList()));
        }
        ResResultPagination.Meta mt = new ResResultPagination.Meta();
        mt.setPage(1);
        mt.setPageSize(topSubjects.size());
        mt.setPages(1);
        mt.setTotal(topSubjects.size());
        res.setMeta(mt);
        return res;
    }
}
