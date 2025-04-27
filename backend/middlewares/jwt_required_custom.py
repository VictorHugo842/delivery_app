from functools import wraps
from flask import g, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

def jwt_required_custom(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            # Verifica se existe JWT válido na requisição
            verify_jwt_in_request()
            identidade = get_jwt_identity()
            
            # Garante que o token contém "usuario_id"
            if not identidade or "usuario_id" not in identidade:
                return jsonify({"msg": "Usuário não autenticado"}), 401
            
            # Armazena no contexto global (g)
            g.usuario_id = identidade["usuario_id"]
            g.loja_id = identidade.get("loja_id")  # opcional
            return fn(*args, **kwargs)
        
        except Exception:
            return jsonify({"msg": "Token inválido ou ausente"}), 401
    return wrapper