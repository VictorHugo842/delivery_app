from functools import wraps
from flask import g, jsonify

# Decorador customizado para garantir que o tenant está presente
def tenant_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            # Garante que o tenant_id foi definido pelo middleware anterior
            if not hasattr(g, 'loja_id') or not g.loja_id:
                return jsonify({"msg": "Tenant não encontrado"}), 403
            
            # Se tudo certo, armazena o tenant_id no contexto global
            g.tenant_id = g.loja_id
            return fn(*args, **kwargs)
        
        except Exception:
            return jsonify({"msg": "Erro ao validar o tenant"}), 500
    return wrapper