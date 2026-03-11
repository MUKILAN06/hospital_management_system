package com.example.demo.controller;

import com.example.demo.dto.AppointmentRequest;
import com.example.demo.model.Appointment;
import com.example.demo.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request) {
        try {
            return ResponseEntity.ok(appointmentService.bookAppointment(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmAppointment(@PathVariable Long id, @RequestParam Long doctorId) {
        try {
            return ResponseEntity.ok(appointmentService.confirmAppointment(id, doctorId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id, @RequestParam Long userId) {
        try {
            return ResponseEntity.ok(appointmentService.cancelAppointment(id, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(appointmentService.completeAppointment(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }
}
