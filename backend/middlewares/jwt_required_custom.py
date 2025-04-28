from functools import wraps
from flask import g, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request, get_csrf_token
import json

# Decorador customizado para verificar o JWT
def jwt_required_custom(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            # Verifica se existe JWT válido na requisição
            try:
                verify_jwt_in_request()
            except Exception as e:
                return jsonify({"msg": f"Erro na verificação do JWT: {str(e)}"}), 401

            # Obtém a identidade do token
            try:
                identidade = get_jwt_identity()
                print(f"Identidade JWT: {identidade}")  # Para depuração
            except Exception as e:
                return jsonify({"msg": f"Erro ao obter a identidade do JWT: {str(e)}"}), 401

            # Se a identidade for string, tenta carregar como JSON
            if isinstance(identidade, str):
                try:
                    identidade = json.loads(identidade)
                except json.JSONDecodeError as e:
                    return jsonify({"msg": f"Erro ao decodificar identidade JSON: {str(e)}"}), 401

            if not isinstance(identidade, dict):
                return jsonify({"msg": "Erro: Identidade não é um dicionário válido."}), 401

            if "usuario_id" not in identidade or "loja_id" not in identidade:
                return jsonify({"msg": "Erro: Usuário ou loja não autenticados."}), 401

            # Guarda usuário e loja no contexto da requisição
            g.usuario_id = identidade["usuario_id"]
            g.loja_id = identidade["loja_id"]

            return fn(*args, **kwargs)

        except Exception as e:
            return jsonify({"msg": f"Erro inesperado no wrapper: {str(e)}"}), 500
    return wrapper

# .ENV PARA secure=False , FALSE É DEV E TRUE É PROD
# FAZER TESSTE COM O secure=True E secure=False
# fazer teste pra verse os cookies não são salvos no navegador
# fazer teste pra ver se o cookie é salvo no navegador
# COMPREENDER MELHOR o sistema de cookies do flask_jwt_extended