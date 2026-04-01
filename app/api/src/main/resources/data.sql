-- 1. BANKS
INSERT INTO banks (id, code, name) 
VALUES 
(1, 'ZANACO', 'Zanaco Bank'),
(2, 'FNB', 'First National Bank')
ON CONFLICT (id) DO NOTHING;

-- 2. APP USERS (Admin and Bank Staff)
INSERT INTO app_users (id, username, password, role, bank_id, student_id, enabled)
VALUES 
(1, 'admin', '{noop}admin123', 'UNIVERSITY_ADMIN', NULL, NULL, TRUE),
(2, 'bank_zanaco', '{noop}bank123', 'BANK', 1, NULL, TRUE),
(3, 'bank_fnb', '{noop}bank123', 'BANK', 2, NULL, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. STUDENTS
-- Mapping: (id, name, student_number, bank_id, allowance_amount, loan_limit, bank_account)
INSERT INTO students (id, name, student_number, bank_id, allowance_amount, loan_limit, bank_account)
VALUES 
(1, 'Alice John', '22177001', 1, 1000.00, 15000.00, '0000000000000001'),
(2, 'Silas Chalwe', '22177002', 2, 1000.00, 15000.00, '0000000000000002'),
(3, 'Eric Sakala', '22177003', 1, 1000.00, 15000.00, '0000000000000003'),
(4, 'Gift Phiri', '22177004', 2, 1000.00, 15000.00, '0000000000000004'),
(5, 'Mary Zulu', '22177005', 1, 1000.00, 15000.00, '0000000000000005'),
(6, 'Peter Mwansa', '22177006', 2, 1000.00, 15000.00, '0000000000000006'),
(7, 'Grace Tembo', '22177007', 1, 1000.00, 15000.00, '0000000000000007'),
(8, 'Joseph Banda', '22177008', 2, 1000.00, 15000.00, '0000000000000008'),
(9, 'Ruth Chileshe', '22177009', 1, 1000.00, 15000.00, '0000000000000009'),
(10, 'David Mumba', '22177010', 2, 1000.00, 15000.00, '0000000000000010')
ON CONFLICT (id) DO NOTHING;

-- 4. STUDENT USERS
-- Mapping: (id, username, password, role, bank_id, student_id, enabled)
INSERT INTO app_users (id, username, password, role, bank_id, student_id, enabled)
VALUES 
(101, '22177001', '{noop}test1234', 'STUDENT', NULL, 1, TRUE),
(102, '22177002', '{noop}test1234', 'STUDENT', NULL, 2, TRUE),
(103, '22177003', '{noop}test1234', 'STUDENT', NULL, 3, TRUE),
(104, '22177004', '{noop}test1234', 'STUDENT', NULL, 4, TRUE),
(105, '22177005', '{noop}test1234', 'STUDENT', NULL, 5, TRUE),
(106, '22177006', '{noop}test1234', 'STUDENT', NULL, 6, TRUE),
(107, '22177007', '{noop}test1234', 'STUDENT', NULL, 7, TRUE),
(108, '22177008', '{noop}test1234', 'STUDENT', NULL, 8, TRUE),
(109, '22177009', '{noop}test1234', 'STUDENT', NULL, 9, TRUE),
(110, '22177010', '{noop}test1234', 'STUDENT', NULL, 10, TRUE)
ON CONFLICT (id) DO NOTHING;
