-- Create DB
CREATE DATABASE quizhive_db;
USE quizhive_db;

-- =========================
-- USERS & ROLES
-- =========================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student','teacher','moderator','admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CLASSES & SUBJECTS
-- =========================
CREATE TABLE classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    section VARCHAR(50)
);

CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    class_id INT,
    teacher_id INT,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (teacher_id) REFERENCES users(user_id)
);

-- Weekly class timetable
CREATE TABLE class_timetable (
    timetable_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    subject_id INT,
    teacher_id INT,
    day_of_week ENUM('Mon','Tue','Wed','Thu','Fri','Sat'),
    start_time TIME,
    end_time TIME,
    classroom VARCHAR(50),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (teacher_id) REFERENCES users(user_id)
);

-- =========================
-- ATTENDANCE
-- =========================
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    class_id INT,
    date DATE,
    status ENUM('present','absent','late'),
    FOREIGN KEY (student_id) REFERENCES users(user_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

-- =========================
-- EXAMS
-- =========================
CREATE TABLE exams (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT,
    class_id INT,
    exam_date DATE,
    exam_time TIME,
    location VARCHAR(100),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

CREATE TABLE exam_seat_allotment (
    allotment_id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT,
    student_id INT,
    seat_number VARCHAR(20),
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id)
);

-- =========================
-- QUIZZES & QUESTIONS
-- =========================
CREATE TABLE quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255),
    option_b VARCHAR(255),
    option_c VARCHAR(255),
    option_d VARCHAR(255),
    correct_option CHAR(1),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id)
);

CREATE TABLE submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    student_id INT,
    score INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id)
);

-- =========================
-- ASSIGNMENTS
-- =========================
CREATE TABLE assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    subject_id INT,
    due_date DATE,
    created_by INT,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE assignment_submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT,
    student_id INT,
    file_path VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    plagiarism_score DECIMAL(5,2),
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id)
);

-- =========================
-- CHAT & EVENTS
-- =========================
CREATE TABLE chats (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_name VARCHAR(100),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE chat_members (
    chat_id INT,
    user_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT,
    sender_id INT,
    message_text TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id),
    FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    event_date DATE,
    event_time TIME,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- =========================
-- FILES (Notes, Code, PPT, Video)
-- =========================
CREATE TABLE files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255),
    filetype VARCHAR(50),
    filepath VARCHAR(500),
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

-- =========================
-- VERSION TRACKING & AI LOGS
-- =========================
CREATE TABLE code_submissions (
    code_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    language VARCHAR(50),
    code_text TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id)
);

CREATE TABLE ai_suggestions_log (
    suggestion_id INT AUTO_INCREMENT PRIMARY KEY,
    code_id INT,
    suggestion_text TEXT,
    applied BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (code_id) REFERENCES code_submissions(code_id)
);

-- =========================
-- ANALYTICS & SYSTEM LOGS
-- =========================
CREATE TABLE weak_students_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    quiz_id INT,
    score INT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plagiarism_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT,
    similarity_score DECIMAL(5,2),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES assignment_submissions(submission_id)
);

CREATE TABLE system_activity_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    activity TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Trigger: Detect weak students on quiz submission
DELIMITER //
CREATE TRIGGER check_weak_student
AFTER INSERT ON submissions
FOR EACH ROW
BEGIN
   IF NEW.score < 40 THEN
      INSERT INTO weak_students_log(student_id, quiz_id, score)
      VALUES(NEW.student_id, NEW.quiz_id, NEW.score);
   END IF;
END;
//
DELIMITER ;
