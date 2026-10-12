package com.repairtrack.service;

import com.repairtrack.dto.LoginRequest;
import com.repairtrack.dto.LoginResponse;
import com.repairtrack.dto.UserDTO;
import com.repairtrack.entity.Role;
import com.repairtrack.entity.User;
import com.repairtrack.exception.DuplicateRecordException;
import com.repairtrack.exception.ResourceNotFoundException;
import com.repairtrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDTO(user);
    }

    public LoginResponse authenticate(LoginRequest loginRequest) {
        String username = loginRequest.getUsername().trim();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.getPassword().equals(loginRequest.getPassword().trim())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        if (!user.isActive()) {
            throw new IllegalArgumentException("This user account is currently deactivated. Contact administrator.");
        }

        String mockJwt = "token_" + user.getUsername() + "_" + UUID.randomUUID().toString().substring(0, 8);
        return new LoginResponse(mockJwt, mapToDTO(user));
    }

    public UserDTO createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername().trim())) {
            throw new DuplicateRecordException("Username '" + user.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(user.getEmail().trim())) {
            throw new DuplicateRecordException("Email '" + user.getEmail() + "' is already registered.");
        }
        User saved = userRepository.save(user);
        return mapToDTO(saved);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public UserDTO toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setActive(!user.isActive());
        return mapToDTO(userRepository.save(user));
    }

    public UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
