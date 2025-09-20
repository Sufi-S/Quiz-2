# backend/app.py
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_socketio import SocketIO
from dotenv import load_dotenv

# Import extensions
from extensions import db, bcrypt, jwt

# Import routes after initializing extensions
from routes import auth_bp, users_bp, quizzes_bp, assignments_bp, chat_bp, files_bp
from models import User  # for creating test users

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Configs
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL',
    'mysql+pymysql://root:1234@localhost/quizhive_db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', '0e18f9739b8f6a3b30a0c48126e8cb6cde5334e5fcbdb765f66444b777455c0a')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', '0e18f9739b8f6a3b30a0c48126e8cb6cde5334e5fcbdb765f66444b777455c0a')

app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', './uploads')

# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
migrate = Migrate(app, db)
socketio = SocketIO(app, cors_allowed_origins="*")  # SocketIO for real-time chat

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(users_bp, url_prefix="/api/users")
app.register_blueprint(quizzes_bp, url_prefix="/api/quizzes")
app.register_blueprint(assignments_bp, url_prefix="/api/assignments")
app.register_blueprint(chat_bp, url_prefix="/api/chat")
app.register_blueprint(files_bp, url_prefix="/api/files")

# Create tables and test users
with app.app_context():
    db.create_all()
    
    if not User.query.first():
        test_student = User(
            name="Alex Johnson",
            email="student@test.com",
            password=bcrypt.generate_password_hash("password123").decode('utf-8'),
            role="student"
        )
        test_teacher = User(
            name="Dr. Emily Watson",
            email="teacher@test.com",
            password=bcrypt.generate_password_hash("password123").decode('utf-8'),
            role="teacher"
        )
        db.session.add_all([test_student, test_teacher])
        db.session.commit()
        print("✅ Test users created:")
        print("Student: student@test.com / password123")
        print("Teacher: teacher@test.com / password123")

# Simple test route
@app.route('/api/ping')
def ping():
    return jsonify({"msg": "pong"})

# Run the app
if __name__ == "__main__":
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
