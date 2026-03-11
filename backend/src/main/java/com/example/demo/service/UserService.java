package com.example.demo.service;

import com.example.demo.model.AvailableSlot;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getDoctors() {
        return userRepository.findByRole(Role.DOCTOR);
    }

    public List<User> getPatients() {
        return userRepository.findByRole(Role.PATIENT);
    }

    public User addAvailableSlot(Long doctorId, AvailableSlot slot) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("Only doctors can add available slots");
        }

        doctor.getAvailableSlots().add(slot);
        return userRepository.save(doctor);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
