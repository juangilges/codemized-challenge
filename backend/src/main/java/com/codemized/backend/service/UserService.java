package com.codemized.backend.service;

import com.codemized.backend.dto.UserSummaryResponse;
import com.codemized.backend.exception.BadRequestException;
import com.codemized.backend.exception.ResourceNotFoundException;
import com.codemized.backend.model.User;
import com.codemized.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado")
                );
    }

    public User editUser(UUID id, String name, String email) {

        User user = getUserById(id);

        if (name == null || name.isBlank()) {
            throw new BadRequestException("El nombre es obligatorio");
        }

        if (email == null || email.isBlank()) {
            throw new BadRequestException("El correo electrónico es obligatorio");
        }

        if (!user.getEmail().equalsIgnoreCase(email)
                && userRepository.existsByEmail(email)) {

            throw new BadRequestException(
                    "El correo ya está registrado"
            );
        }

        user.setName(name);
        user.setEmail(email);

        return userRepository.save(user);
    }

    public List<UserSummaryResponse> listUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserSummaryResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                ))
                .toList();
    }
}