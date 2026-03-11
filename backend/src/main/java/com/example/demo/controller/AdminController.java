package com.example.demo.controller;

import com.example.demo.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping("/reports/appointments-per-doctor")
    public ResponseEntity<List<Map<String, Object>>> getAppointmentsPerDoctor() {
        List<Object[]> results = appointmentRepository.countAppointmentsPerDoctor();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("doctorName", row[0]);
            map.put("totalAppointments", row[1]);
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reports/revenue-per-department")
    public ResponseEntity<List<Map<String, Object>>> getRevenuePerDepartment() {
        List<Object[]> results = appointmentRepository.calculateRevenuePerDepartment();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("department", row[0]);
            map.put("revenue", row[1]);
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }
}
