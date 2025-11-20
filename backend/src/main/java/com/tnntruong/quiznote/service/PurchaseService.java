package com.tnntruong.quiznote.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Purchase;
import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.dto.request.ReqCreatePurchaseDTO;
import com.tnntruong.quiznote.dto.response.ResPurchaseDTO;
import com.tnntruong.quiznote.repository.PurchaseRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.util.constant.SubjectStatus;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class PurchaseService {

    private PurchaseRepository purchaseRepository;
    private UserRepository userRepository;
    private SubjectRepository subjectRepository;

    public PurchaseService(PurchaseRepository purchaseRepository, UserRepository userRepository,
            SubjectRepository subjectRepository) {
        this.purchaseRepository = purchaseRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }

    public ResPurchaseDTO handleCreatePurchase(ReqCreatePurchaseDTO dto) throws InvalidException {
        System.out.println(
                "📦 Creating purchase - StudentId: " + dto.getStudentId() + ", SubjectId: " + dto.getSubjectId());

        User student = userRepository.findById(dto.getStudentId())
                .orElseThrow(() -> {
                    System.err.println("❌ User not found with id: " + dto.getStudentId());
                    return new InvalidException("User not found");
                });

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> {
                    System.err.println("❌ Subject not found with id: " + dto.getSubjectId());
                    return new InvalidException("Subject not found");
                });

        // Kiểm tra nếu subject ở trạng thái DELETED - không cho phép mua
        if (subject.getStatus() == SubjectStatus.DELETED) {
            System.err.println("Subject is deleted with id: " + dto.getSubjectId());
            throw new InvalidException("Subject not found");
        }

        User seller = userRepository.findById(dto.getSellerId())
                .orElseThrow(() -> {
                    System.err.println("❌ Seller not found with id: " + dto.getSellerId());
                    return new InvalidException("Seller not found");
                });
        if (purchaseRepository.findByStudentIdAndSubjectId(student.getId(), subject.getId()).isPresent()) {
            System.out.println("⚠️ User already purchased this subject");
            throw new InvalidException("User already purchased this subject");
        }

        Purchase purchase = new Purchase();
        purchase.setStudent(student);
        purchase.setSubject(subject);
        purchase.setSeller(seller);

        // Xử lý null cho purchaseCount
        Integer currentCount = subject.getPurchaseCount();
        subject.setPurchaseCount(currentCount != null ? currentCount + 1 : 1);
        subjectRepository.save(subject);

        ResPurchaseDTO result = convertResPurchaseDTO(purchaseRepository.save(purchase));
        System.out.println("✅ Purchase created successfully");
        return result;
    }

    public ResPurchaseDTO convertResPurchaseDTO(Purchase purchase) {
        ResPurchaseDTO res = new ResPurchaseDTO();
        ResPurchaseDTO.CurrentUser student = new ResPurchaseDTO.CurrentUser();
        ResPurchaseDTO.CurrentSubject subject = new ResPurchaseDTO.CurrentSubject();
        res.setId(purchase.getId());
        res.setPurchasedAt(purchase.getPurchasedAt());

        if (purchase.getStudent() != null) {
            Optional<User> studentOptional = this.userRepository.findById(purchase.getStudent().getId());
            student.setId(studentOptional.get().getId());
            student.setUsername(studentOptional.get().getName());
        }

        if (purchase.getSubject() != null) {
            Optional<Subject> subjecOptional = this.subjectRepository.findById(purchase.getSubject().getId());
            subject.setId(subjecOptional.get().getId());
            subject.setName(subjecOptional.get().getName());
            subject.setDescription(subjecOptional.get().getDescription());
            subject.setImageUrl(subjecOptional.get().getImageUrl());
            subject.setPurchasedAt(purchase.getPurchasedAt());
            subject.setAverageRating(subjecOptional.get().getAverageRating());

            subject.setQuestionCount(subjecOptional.get().getQuestions().size());
        }

        res.setStudent(student);
        res.setSubjectList(List.of(subject));
        return res;
    }

    public List<ResPurchaseDTO.CurrentSubject> hanldeGetPurchaseByUserId(String id) throws InvalidException {
        try {
            Long idUser = Long.parseLong(id);
            boolean isExistById = this.userRepository.existsById(idUser);
            if (!isExistById) {
                throw new InvalidException("User with id = " + idUser + " now found");
            }
            List<Purchase> purchasesList = this.purchaseRepository.findByStudentId(idUser);
            List<ResPurchaseDTO.CurrentSubject> res = purchasesList.stream().map((item) -> {
                Long subjectId = item.getSubject().getId();
                Optional<Subject> subjectOptional = this.subjectRepository.findById(subjectId);
                if (subjectOptional.isEmpty() || subjectOptional.get().getStatus() == SubjectStatus.DELETED) {
                    return null;
                }

                ResPurchaseDTO.CurrentSubject subject = new ResPurchaseDTO.CurrentSubject();
                if (item.getSubject() != null) {

                    subjectOptional.ifPresent(s -> {

                        subject.setId(s.getId());
                        subject.setName(s.getName());
                        subject.setDescription(s.getDescription());
                        subject.setImageUrl(s.getImageUrl());
                        subject.setPurchasedAt(item.getPurchasedAt());
                        subject.setAverageRating(s.getAverageRating());
                        subject.setQuestionCount(s.getQuestions().size());

                    });
                }
                return subject;
            }).filter(subject -> subject != null).collect(Collectors.toList());
            return res;
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

    public List<ResPurchaseDTO> hanldeGetPurchaseBySubjectId(String id) throws InvalidException {
        try {
            Long idSubject = Long.parseLong(id);
            boolean isExistById = this.subjectRepository.existsById(idSubject);
            if (!isExistById) {
                throw new InvalidException("Subject with id = " + idSubject + " now found");
            }
            List<Purchase> purchasesList = this.purchaseRepository.findBySubjectId(idSubject);
            List<ResPurchaseDTO> res = purchasesList.stream().map((item) -> this.convertResPurchaseDTO(item))
                    .collect(Collectors.toList());
            return res;
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

    public ResPurchaseDTO handleGetPurchaseById(String id) throws InvalidException {
        try {
            Long idPurchase = Long.parseLong(id);
            Purchase purchase = this.purchaseRepository.findById(idPurchase)
                    .orElseThrow(() -> new InvalidException("Purchase with id = " + idPurchase + " now found"));
            return this.convertResPurchaseDTO(purchase);
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

    public void handleDeletePurchaseById(String id) throws InvalidException {
        try {
            Long idPurchase = Long.parseLong(id);
            boolean isExistById = this.purchaseRepository.existsById(idPurchase);
            if (!isExistById) {
                throw new InvalidException("Purchase with id = " + idPurchase + " now found");
            }
            this.purchaseRepository.deleteById(idPurchase);
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

}
