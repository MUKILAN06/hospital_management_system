INSERT INTO users (name, role, specialization) VALUES ('Admin User', 'ADMIN', NULL);
INSERT INTO users (name, role, specialization) VALUES ('Dr Ravi', 'DOCTOR', 'Cardiologist');
INSERT INTO users (name, role, specialization) VALUES ('Dr Meena', 'DOCTOR', 'Dermatologist');
INSERT INTO users (name, role, specialization) VALUES ('Dr John', 'DOCTOR', 'Neurologist');
INSERT INTO users (name, role, specialization) VALUES ('Patient A', 'PATIENT', NULL);
INSERT INTO users (name, role, specialization) VALUES ('Patient B', 'PATIENT', NULL);

-- Slots for Dr Ravi (Assume ID=2)
INSERT INTO user_available_slots (user_id, date, start_time, end_time) VALUES (2, CURDATE() + INTERVAL 1 DAY, '10:00:00', '12:00:00');
INSERT INTO user_available_slots (user_id, date, start_time, end_time) VALUES (2, CURDATE() + INTERVAL 2 DAY, '14:00:00', '17:00:00');

-- Slots for Dr Meena (Assume ID=3)
INSERT INTO user_available_slots (user_id, date, start_time, end_time) VALUES (3, CURDATE() + INTERVAL 1 DAY, '11:00:00', '13:00:00');
