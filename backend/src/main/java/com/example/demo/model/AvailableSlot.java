package com.example.demo.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableSlot {
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
}
