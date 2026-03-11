package com.example.demo.config;

import com.example.demo.model.AvailableSlot;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) {
        return args -> {
            if (!userRepository.existsByEmail("admin@hospital.com")) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@hospital.com");
                admin.setPassword("admin123");
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Default admin created: admin@hospital.com / admin123");
            }

            // Seed default slots for all doctors if they have no slots
            List<User> doctors = userRepository.findByRole(Role.DOCTOR);
            for (User doctor : doctors) {
                if (doctor.getAvailableSlots() == null || doctor.getAvailableSlots().isEmpty()) {
                    System.out.println("Adding default slots for doctor: " + doctor.getName());
                    for (int i = 1; i <= 3; i++) {
                        LocalDate date = LocalDate.now().plusDays(i);
                        // Add some default slots (e.g. 10:00 to 12:00, 14:00 to 16:00)
                        doctor.getAvailableSlots().add(new AvailableSlot(date, LocalTime.of(10, 0), LocalTime.of(12, 0)));
                        doctor.getAvailableSlots().add(new AvailableSlot(date, LocalTime.of(14, 0), LocalTime.of(16, 0)));
                    }
                    userRepository.save(doctor);
                }
            }
        };
    }
}
