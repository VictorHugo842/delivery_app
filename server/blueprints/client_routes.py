from flask import Blueprint, jsonify

client_bp = Blueprint('client', __name__, url_prefix='/client')

# Simulação de "banco de dados"
lojas = {
    "loja_teste": {
        "name": "Doceria GG",
        "menu": ["Bolo de cenoura", "Torta de limão", "Brigadeiro"]
    },
    "pizzaria_top": {
        "name": "Pizzaria Top",
        "menu": ["Pizza Margherita", "Pizza Calabresa", "Pizza Quatro Queijos"]
    }
}

@client_bp.route('/<slug>', methods=['GET'])
def get_loja_by_slug(slug):
    loja = lojas.get(slug)
    if not loja:
        return jsonify({"error": "Loja não encontrada"}), 404

    return jsonify({
        "loja": loja["name"],
        "menu": loja["menu"]
    })

@client_bp.route('/')
def index():
    return jsonify({
        "message": "API is running!",
        "people": ["FRONT-END CLIENT", "FRONT-END CLIENT"],
    })
