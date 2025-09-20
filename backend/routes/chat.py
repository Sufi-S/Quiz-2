# backend/routes/chat.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db, socketio
from models import Chat, ChatMember, Message, File, User
from werkzeug.utils import secure_filename
import os
from flask_socketio import emit, join_room

chat_bp = Blueprint("chat", __name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -------------------
# REST APIs
# -------------------

@chat_bp.route("/", methods=["GET"])
@jwt_required()
def get_user_chats():
    user_id = get_jwt_identity()
    chats = Chat.query.join(ChatMember).filter(ChatMember.user_id==user_id).all()
    result = []
    for chat in chats:
        result.append({
            "chat_id": chat.chat_id,
            "chat_name": chat.chat_name,
        })
    return jsonify(result)

@chat_bp.route("/messages/<int:chat_id>", methods=["GET"])
@jwt_required()
def get_messages(chat_id):
    messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.sent_at).all()
    result = []
    for m in messages:
        sender = User.query.get(m.sender_id)
        result.append({
            "message_id": m.message_id,
            "chat_id": m.chat_id,
            "sender_id": m.sender_id,
            "sender_name": sender.name,
            "message_text": m.message_text,
            "sent_at": m.sent_at.isoformat()
        })
    return jsonify(result)

@chat_bp.route("/files", methods=["POST"])
@jwt_required()
def upload_file():
    user_id = get_jwt_identity()
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    new_file = File(
        filename=filename,
        filetype=file.content_type,
        filepath=filepath,
        uploaded_by=user_id
    )
    db.session.add(new_file)
    db.session.commit()
    return jsonify({"msg": "File uploaded", "file_id": new_file.file_id})

# -------------------
# WebSocket Events
# -------------------

@socketio.on("join_chat")
def handle_join_chat(data):
    chat_id = data['chat_id']
    join_room(str(chat_id))
    emit("status", {"msg": f"User joined chat {chat_id}"}, room=str(chat_id))

@socketio.on("send_message")
def handle_send_message(data):
    chat_id = data['chat_id']
    sender_id = data['sender_id']
    message_text = data.get('message_text', '')

    # Save to DB
    new_msg = Message(chat_id=chat_id, sender_id=sender_id, message_text=message_text)
    db.session.add(new_msg)
    db.session.commit()

    emit("receive_message", {
        "message_id": new_msg.message_id,
        "chat_id": chat_id,
        "sender_id": sender_id,
        "message_text": message_text,
        "sent_at": new_msg.sent_at.isoformat()
    }, room=str(chat_id))
