package com.tnntruong.quiznote.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class UserService {
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isEmailExist(String email) {
        return this.userRepository.existsByEmail(email);
    }

    public User handleCreateUser(User user) {
        return this.userRepository.save(user);
    }

    public User handleUpdateUser(User user) throws InvalidException {
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
            return this.userRepository.save(currentUser);
        }
        return null;
    }
}
