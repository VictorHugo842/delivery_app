from flask import Blueprint, jsonify

painel_bp = Blueprint('painel', __name__, url_prefix='/painel')

@painel_bp.route('/delivery', methods=['GET'])
def painel():
    user = {"id": 1, "name": "painel", "store": "Doceria GG"}
    return jsonify({
        "message": f"Bem-vindo, {user['name']}!",
        "store": user["store"]
    })

@painel_bp.route('/')
def index():
    return jsonify({
        "message": "API is running!",
        "people": ["FRONT-END painel", "FRONT-END painel"],
    })