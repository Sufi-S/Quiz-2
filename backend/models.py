from extensions import db
from datetime import datetime
from sqlalchemy import Enum, UniqueConstraint
import enum

class RoleEnum(enum.Enum):
    student = "student"
    teacher = "teacher"
    moderator = "moderator"
    admin = "admin"

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    subjects = db.relationship('Subject', back_populates='teacher', lazy='select')
    # other relationships will be added as needed

class Class(db.Model):
    __tablename__ = 'classes'
    class_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_name = db.Column(db.String(100), nullable=False)
    section = db.Column(db.String(50))

class Subject(db.Model):
    __tablename__ = 'subjects'
    subject_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    subject_name = db.Column(db.String(100), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'))
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    class_rel = db.relationship('Class', backref='subjects')
    teacher = db.relationship('User', back_populates='subjects')

class ClassTimetable(db.Model):
    __tablename__ = 'class_timetable'
    timetable_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'))
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.subject_id'))
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    day_of_week = db.Column(db.Enum('Mon','Tue','Wed','Thu','Fri','Sat', name='days'))
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)
    classroom = db.Column(db.String(50))

class Attendance(db.Model):
    __tablename__ = 'attendance'
    attendance_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'))
    date = db.Column(db.Date)
    status = db.Column(db.Enum('present','absent','late', name='status_types'))

class Exam(db.Model):
    __tablename__ = 'exams'
    exam_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.subject_id'))
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'))
    exam_date = db.Column(db.Date)
    exam_time = db.Column(db.Time)
    location = db.Column(db.String(100))

class ExamSeatAllotment(db.Model):
    __tablename__ = 'exam_seat_allotment'
    allotment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    exam_id = db.Column(db.Integer, db.ForeignKey('exams.exam_id'))
    student_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    seat_number = db.Column(db.String(20))

class Quiz(db.Model):
    __tablename__ = 'quizzes'
    quiz_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    creator = db.relationship('User', backref='quizzes')

class Question(db.Model):
    __tablename__ = 'questions'
    question_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.quiz_id'))
    question_text = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.String(255))
    option_b = db.Column(db.String(255))
    option_c = db.Column(db.String(255))
    option_d = db.Column(db.String(255))
    correct_option = db.Column(db.String(1))
    quiz = db.relationship('Quiz', backref='questions')

class Submission(db.Model):
    __tablename__ = 'submissions'
    submission_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.quiz_id'))
    student_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    score = db.Column(db.Integer)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

class Assignment(db.Model):
    __tablename__ = 'assignments'
    assignment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.subject_id'))
    due_date = db.Column(db.Date)
    created_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))

class AssignmentSubmission(db.Model):
    __tablename__ = 'assignment_submissions'
    submission_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.assignment_id'))
    student_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    file_path = db.Column(db.String(500))
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    plagiarism_score = db.Column(db.Numeric(5,2))

class Chat(db.Model):
    __tablename__ = 'chats'
    chat_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    chat_name = db.Column(db.String(100))
    created_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ChatMember(db.Model):
    __tablename__ = 'chat_members'
    chat_id = db.Column(db.Integer, db.ForeignKey('chats.chat_id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

class Message(db.Model):
    __tablename__ = 'messages'
    message_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chats.chat_id'))
    sender_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    message_text = db.Column(db.Text)
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)

class File(db.Model):
    __tablename__ = 'files'
    file_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    filename = db.Column(db.String(255))
    filetype = db.Column(db.String(50))
    filepath = db.Column(db.String(500))
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

# Minimal analytics tables and logs
class WeakStudentsLog(db.Model):
    __tablename__ = 'weak_students_log'
    log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.Integer)
    quiz_id = db.Column(db.Integer)
    score = db.Column(db.Integer)
    logged_at = db.Column(db.DateTime, default=datetime.utcnow)

class PlagiarismLog(db.Model):
    __tablename__ = 'plagiarism_logs'
    log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    submission_id = db.Column(db.Integer)
    similarity_score = db.Column(db.Numeric(5,2))
    detected_at = db.Column(db.DateTime, default=datetime.utcnow)

class SystemActivityLog(db.Model):
    __tablename__ = 'system_activity_log'
    log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer)
    activity = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
