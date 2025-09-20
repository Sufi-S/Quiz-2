from flask import Blueprint, jsonify

assignments_bp = Blueprint("assignments", __name__)

@assignments_bp.route("/", methods=["GET"])
def list_assignments():
    return jsonify({"msg": "List of assignments (stub)"})
