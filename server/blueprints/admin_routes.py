from flask import Blueprint, jsonify

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/delivery', methods=['GET'])
def admin_dashboard():
    user = {"id": 1, "name": "Admin", "store": "Doceria GG"}
    return jsonify({
        "message": f"Bem-vindo, {user['name']}!",
        "store": user["store"]
    })

@admin_bp.route('/')
def index():
    return jsonify({
        "message": "API is running!",
        "people": ["FRONT-END ADMIN", "FRONT-END ADMIN"],
    })