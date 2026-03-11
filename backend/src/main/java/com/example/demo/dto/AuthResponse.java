package com.example.demo.dto;

import com.example.demo.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String name;
    private Role role;
    private String token;
}
