from functools import wraps
from flask import g, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

import json
from functools import wraps
from flask import g, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

# Decorador customizado para verificar o JWT
def jwt_required_custom(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            # Verifica se existe JWT válido na requisição
            verify_jwt_in_request()
            identidade = get_jwt_identity()
            print(identidade)  # Para depuração, remova em produção

            # Verifica se a identidade é uma string e tenta convertê-la para dicionário
            if isinstance(identidade, str):
                try:
                    # Tenta converter a string JSON para um dicionário
                    identidade = json.loads(identidade)
                except json.JSONDecodeError:
                    return jsonify({"msg": "Erro: Não foi possível decodificar a identidade. Formato inválido."}), 401

            # Verifica se agora a identidade é um dicionário
            if not isinstance(identidade, dict):
                return jsonify({"msg": "Erro: Identidade não é um dicionário válido"}), 401
            
            # Garante que o token contém "usuario_id" e "loja_id"
            if "usuario_id" not in identidade or "loja_id" not in identidade:
                return jsonify({"msg": "Usuário ou loja não autenticados"}), 401

            # Armazenando as informações do usuário e loja no contexto da requisição
            g.usuario_id = identidade["usuario_id"]
            g.loja_id = identidade["loja_id"]
            
            # Chama a função da rota original
            return fn(*args, **kwargs)

        except Exception as e:
            # Se houver erro, retornamos uma mensagem de erro
            return jsonify({"msg": f"Erro ao verificar o token: {str(e)}"}), 401
    return wrapper


# .ENV PARA secure=False , FALSE É DEV E TRUE É PROD
# FAZER TESSTE COM O secure=True E secure=False
# fazer teste pra verse os cookies não são salvos no navegador
# fazer teste pra ver se o cookie é salvo no navegador
# COMPREENDER MELHOR o sistema de cookies do flask_jwt_extended