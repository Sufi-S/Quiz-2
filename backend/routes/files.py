from flask import Blueprint, jsonify

files_bp = Blueprint("files", __name__)

@files_bp.route("/", methods=["GET"])
def list_files():
    return jsonify({"msg": "List of files (stub)"})
