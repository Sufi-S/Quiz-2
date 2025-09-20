from flask import Blueprint, request, jsonify
from extensions import db, bcrypt, jwt
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import datetime

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"msg": "No data provided"}), 400
            
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"msg": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        
        if user and bcrypt.check_password_hash(user.password, password):
            # Create access token
            access_token = create_access_token(
                identity=user.user_id,
                expires_delta=datetime.timedelta(days=1)
            )
            
            return jsonify({
                "msg": "Login successful",
                "access_token": access_token,
                "user": {
                    "id": user.user_id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role.value
                }
            }), 200
        else:
            return jsonify({"msg": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"msg": f"Login error: {str(e)}"}), 500

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"msg": "No data provided"}), 400
            
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "student")
        
        if not all([name, email, password]):
            return jsonify({"msg": "Name, email and password are required"}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "User already exists"}), 409
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Create new user
        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            role=role
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({"msg": "User created successfully"}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Registration error: {str(e)}"}), 500

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
            
        return jsonify({
            "user": {
                "id": user.user_id,
                "name": user.name,
                "email": user.email,
                "role": user.role.value
            }
        }), 200
        
    except Exception as e:
        return jsonify({"msg": f"Profile error: {str(e)}"}), 500

@auth_bp.route("/verify-token", methods=["POST"])
@jwt_required()
def verify_token():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({"msg": "Invalid token"}), 401
            
        return jsonify({
            "msg": "Token valid",
            "user": {
                "id": user.user_id,
                "name": user.name,
                "email": user.email,
                "role": user.role.value
            }
        }), 200
        
    except Exception as e:
        return jsonify({"msg": "Token verification failed"}), 401