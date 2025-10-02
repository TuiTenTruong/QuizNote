package com.tnntruong.quiznote.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Purchase;
import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.repository.PurchaseRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.service.response.ResPurchaseDTO;
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

    public ResPurchaseDTO handleCreatePurchase(Purchase purchase) throws InvalidException {

        if (purchase.getStudent() != null) {
            this.userRepository.findById(purchase.getStudent().getId())
                    .orElseThrow(() -> new InvalidException("User not found"));
        } else {
            throw new InvalidException("student invalid");
        }

        if (purchase.getSubject() != null) {
            this.subjectRepository.findById(purchase.getSubject().getId())
                    .orElseThrow(() -> new InvalidException("Subject not found"));
        } else {
            throw new InvalidException("suject invalid");
        }

        this.purchaseRepository
                .findByStudentIdAndSubjectId(purchase.getStudent().getId(), purchase.getSubject().getId())
                .ifPresent(p -> {
                    throw new RuntimeException("User already purchased this subject");
                });
        return this.convertResPurchaseDTO(purchaseRepository.save(purchase));
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
            subject.setSubjectname(subjecOptional.get().getName());
        }

        res.setStudent(student);
        res.setSubject(subject);
        return res;
    }

    public List<ResPurchaseDTO> hanldeGetPurchaseByUserId(String id) throws InvalidException {
        try {
            Long idUser = Long.parseLong(id);
            boolean isExistById = this.userRepository.existsById(idUser);
            if (!isExistById) {
                throw new InvalidException("User with id = " + idUser + " now found");
            }
            List<Purchase> purchasesList = this.purchaseRepository.findByStudentId(idUser);
            List<ResPurchaseDTO> res = purchasesList.stream().map((item) -> this.convertResPurchaseDTO(item))
                    .collect(Collectors.toList());
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
            Optional<Purchase> purchaseOptional = this.purchaseRepository.findById(idPurchase);
            if (purchaseOptional.isEmpty()) {
                throw new InvalidException("Subject with id = " + idPurchase + " now found");
            }
            return this.convertResPurchaseDTO(purchaseOptional.get());
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

    public void handleDeletePurchaseById(String id) throws InvalidException {
        try {
            Long idPurchase = Long.parseLong(id);
            boolean isExistById = this.subjectRepository.existsById(idPurchase);
            if (!isExistById) {
                throw new InvalidException("Subject with id = " + idPurchase + " now found");
            }
            this.purchaseRepository.deleteById(idPurchase);
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

}
