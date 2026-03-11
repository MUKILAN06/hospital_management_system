package com.example.demo.service;

import com.example.demo.dto.AppointmentRequest;
import com.example.demo.model.*;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    public Appointment bookAppointment(AppointmentRequest request) {
        User patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (patient.getRole() != Role.PATIENT) {
            throw new RuntimeException("Only patients can book appointments");
        }

        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("Invalid doctor ID");
        }

        // Rule 2: Doctor must be available
        boolean doctorAvailable = doctor.getAvailableSlots().stream()
                .anyMatch(slot -> slot.getDate().equals(request.getAppointmentDate()) &&
                        !request.getStartTime().isBefore(slot.getStartTime()) &&
                        !request.getEndTime().isAfter(slot.getEndTime()));

        if (!doctorAvailable) {
            throw new RuntimeException("Doctor is not available at the requested time");
        }

        // Rule 1: Cannot book overlapping time slots (Doctor)
        long doctorOverlaps = appointmentRepository.countOverlappingForDoctor(
                doctor.getId(), request.getAppointmentDate(), request.getStartTime(), request.getEndTime());
        if (doctorOverlaps > 0) {
            throw new RuntimeException("Doctor already has an appointment at this time");
        }

        // Rule 3: Patient cannot book multiple appointments at same time
        long patientOverlaps = appointmentRepository.countOverlappingForPatient(
                patient.getId(), request.getAppointmentDate(), request.getStartTime(), request.getEndTime());
        if (patientOverlaps > 0) {
            throw new RuntimeException("Patient already has an appointment at this time");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(request.getEndTime());
        appointment.setStatus(AppointmentStatus.BOOKED);

        return appointmentRepository.save(appointment);
    }

    public Appointment confirmAppointment(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("Only the assigned doctor can confirm the appointment");
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        return appointmentRepository.save(appointment);
    }

    public Appointment cancelAppointment(Long appointmentId, Long userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (appointment.getStatus() == AppointmentStatus.CONFIRMED && user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only ADMIN can cancel after confirmation");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        return appointmentRepository.save(appointment);
    }

    public Appointment completeAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(AppointmentStatus.COMPLETED);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByDoctor(Long id) {
        return appointmentRepository.findByDoctorId(id);
    }

    public List<Appointment> getAppointmentsByPatient(Long id) {
        return appointmentRepository.findByPatientId(id);
    }
}
