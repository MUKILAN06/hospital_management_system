package com.example.demo.controller;

import com.example.demo.model.AvailableSlot;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getDoctors() {
        return ResponseEntity.ok(userService.getDoctors());
    }

    @GetMapping("/patients")
    public ResponseEntity<List<User>> getPatients() {
        return ResponseEntity.ok(userService.getPatients());
    }

    @PostMapping("/{doctorId}/slots")
    public ResponseEntity<User> addAvailableSlot(@PathVariable Long doctorId, @RequestBody AvailableSlot slot) {
        try {
            return ResponseEntity.ok(userService.addAvailableSlot(doctorId, slot));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
