package com.example.demo.repository;

import com.example.demo.model.Appointment;
import com.example.demo.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT count(a) FROM Appointment a WHERE a.doctor.id = :doctorId " +
            "AND a.appointmentDate = :date AND a.status <> 'CANCELLED' " +
            "AND a.startTime < :endTime AND a.endTime > :startTime")
    long countOverlappingForDoctor(@Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    @Query("SELECT count(a) FROM Appointment a WHERE a.patient.id = :patientId " +
            "AND a.appointmentDate = :date AND a.status <> 'CANCELLED' " +
            "AND a.startTime < :endTime AND a.endTime > :startTime")
    long countOverlappingForPatient(@Param("patientId") Long patientId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByPatientId(Long patientId);

    @Query("SELECT a.doctor.name as doctorName, COUNT(a) as totalAppointments FROM Appointment a GROUP BY a.doctor.id")
    List<Object[]> countAppointmentsPerDoctor();

    @Query("SELECT a.doctor.specialization as department, COUNT(a) * 500 as revenue FROM Appointment a WHERE a.status = 'COMPLETED' GROUP BY a.doctor.specialization")
    List<Object[]> calculateRevenuePerDepartment();
}
