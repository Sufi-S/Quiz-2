from flask import Blueprint, jsonify

quizzes_bp = Blueprint("quizzes", __name__)

@quizzes_bp.route("/", methods=["GET"])
def list_quizzes():
    return jsonify({"msg": "List of quizzes (stub)"})
