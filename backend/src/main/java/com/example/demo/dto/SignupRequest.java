package com.example.demo.dto;

import com.example.demo.model.Role;
import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String specialization;
}
