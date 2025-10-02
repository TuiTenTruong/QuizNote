package com.tnntruong.quiznote.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Role;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.service.response.ResResultPagination;
import com.tnntruong.quiznote.service.response.user.ResCreateUserDTO;
import com.tnntruong.quiznote.service.response.user.ResGetUserDTO;
import com.tnntruong.quiznote.service.response.user.ResUpdateUserDTO;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class UserService {
    private UserRepository userRepository;
    private RoleService roleService;

    public UserService(UserRepository userRepository, RoleService roleService) {
        this.userRepository = userRepository;
        this.roleService = roleService;
    }

    public boolean isEmailExist(String email) {
        return this.userRepository.existsByEmail(email);
    }

    public ResCreateUserDTO handleCreateUser(User user) {
        if (user.getRole() != null) {
            Optional<Role> role = this.roleService.findById(user.getRole().getId());
            user.setRole(role.isPresent() ? role.get() : null);
        }
        User savedUser = this.userRepository.save(user);
        ResCreateUserDTO res = new ResCreateUserDTO();
        res.setId(savedUser.getId());
        res.setName(savedUser.getName());
        res.setEmail(savedUser.getEmail());
        res.setGender(savedUser.getGender());
        res.setAge(savedUser.getAge());
        res.setCreatedAt(savedUser.getCreatedAt());
        res.setCreatedBy(savedUser.getCreatedBy());
        return res;
    }

    public ResUpdateUserDTO handleUpdateUser(User user) throws InvalidException {
        Optional<User> userOptional = this.userRepository.findById(user.getId());
        if (userOptional.isEmpty()) {
            throw new InvalidException("User with id = " + user.getId() + " not found");
        }
        User currentUser = userOptional.get();
        if (currentUser != null) {
            currentUser.setName(user.getName());
            currentUser.setAge(user.getAge());
            currentUser.setAddress(user.getAddress());
            currentUser.setGender(user.getGender());
            if (user.getRole() != null) {
                Optional<Role> role = this.roleService.findById(user.getRole().getId());
                currentUser.setRole(role.isPresent() ? role.get() : null);
            }
            User savedUser = this.userRepository.save(currentUser);
            ResUpdateUserDTO res = new ResUpdateUserDTO();

            res.setId(savedUser.getId());
            res.setName(savedUser.getName());
            res.setEmail(savedUser.getEmail());
            res.setGender(savedUser.getGender());
            res.setAge(savedUser.getAge());

            res.setUpdatedAt(savedUser.getUpdatedAt());
            res.setUpdatedBy(savedUser.getUpdatedBy());
            return res;
        }
        return null;
    }

    public void handleDeleteUser(String id) throws InvalidException {
        try {
            Long idUser = Long.parseLong(id);
            boolean isExistById = this.userRepository.existsById(idUser);
            if (!isExistById) {
                throw new InvalidException("User with id = " + idUser + " now found");
            }
            this.userRepository.deleteById(idUser);
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");

        }
    }

    public ResGetUserDTO convertUsertoDTO(User user) {
        ResGetUserDTO res = new ResGetUserDTO();
        ResGetUserDTO.RoleUser roleUser = new ResGetUserDTO.RoleUser();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setGender(user.getGender());
        res.setAge(user.getAge());
        res.setCreatedAt(user.getCreatedAt());
        res.setCreatedBy(user.getCreatedBy());
        res.setUpdatedAt(user.getUpdatedAt());
        res.setUpdatedBy(user.getUpdatedBy());
        if (user.getRole() != null) {
            roleUser.setId(user.getRole().getId());
            roleUser.setName(user.getRole().getName());
            res.setRole(roleUser);
        }
        return res;
    }

    public ResGetUserDTO handleGetUserById(String id) throws InvalidException {
        try {
            Long idUser = Long.parseLong(id);
            Optional<User> dbUser = this.userRepository.findById(idUser);
            if (dbUser.isEmpty()) {
                throw new InvalidException("User with id = " + idUser + " now found");
            }
            return this.convertUsertoDTO(dbUser.get());

        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");

        }
    }

    public ResResultPagination handleGetAllUser(Specification<User> spec, Pageable page) {
        Page<User> userPage = this.userRepository.findAll(spec, page);
        List<ResGetUserDTO> listUser = userPage.getContent().stream().map(item -> this.convertUsertoDTO(item))
                .collect(Collectors.toList());
        ResResultPagination res = new ResResultPagination();
        ResResultPagination.Meta mt = new ResResultPagination.Meta();
        mt.setPage(userPage.getNumber() + 1);
        mt.setPageSize(userPage.getSize());
        mt.setPages(userPage.getTotalPages());
        mt.setTotal(userPage.getTotalElements());
        res.setMeta(mt);
        res.setResult(listUser);
        return res;
    }

    public User handleGetUserByUsername(String email) {
        return this.userRepository.findByEmail(email);
    }

    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return this.userRepository.findByRefreshTokenAndEmail(token, email);
    }

    public void updateUserToken(String token, String email) {
        User currentUser = this.handleGetUserByUsername(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }
}
