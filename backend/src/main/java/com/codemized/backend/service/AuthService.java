package com.codemized.backend.service;

import com.codemized.backend.dto.LoginRequest;
import com.codemized.backend.dto.LoginResponse;
import com.codemized.backend.dto.RegisterRequest;
import com.codemized.backend.dto.RegisterResponse;

import com.codemized.backend.exception.BadRequestException;
import com.codemized.backend.exception.UnauthorizedException;

import com.codemized.backend.model.User;
import com.codemized.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public RegisterResponse register(
            RegisterRequest request) {

        if (request.getName() == null
                || request.getName().isBlank()) {

            throw new BadRequestException(
                    "El nombre es obligatorio"
            );
        }

        if (request.getEmail() == null
                || request.getEmail().isBlank()) {

            throw new BadRequestException(
                    "El correo electrónico es obligatorio"
            );
        }

        if (request.getPassword() == null
                || request.getPassword().isBlank()) {

            throw new BadRequestException(
                    "La contraseña es obligatoria"
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException(
                    "El correo ya está registrado"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        String passwordHash =
                passwordEncoder.encode(
                        request.getPassword()
                );

        user.setPasswordHash(passwordHash);

        User savedUser =
                userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    public LoginResponse login(LoginRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("El correo electrónico es obligatorio");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("La contraseña es obligatoria");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UnauthorizedException("Credenciales incorrectas")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {

            throw new UnauthorizedException("Credenciales incorrectas");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}