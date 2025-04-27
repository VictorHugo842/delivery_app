from flask import Blueprint, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required,
    get_jwt_identity, set_access_cookies, unset_jwt_cookies,
    get_csrf_token
)
from extensions import db
from models.usuario_painel import UsuarioPainel
from models.loja import Loja
from slugify import slugify
from werkzeug.security import generate_password_hash  # para segurança de senha
from middlewares.jwt_required_custom import jwt_required_custom
from middlewares.tenant_required import tenant_required
import json

painel_bp = Blueprint('painel', __name__, url_prefix='/painel')


@painel_bp.route("/delivery", methods=["GET"])
@jwt_required_custom
@tenant_required
def delivery():
    # Obter o ID do usuário autenticado a partir do token
    user_id = g.usuario_id 

    # Buscar o usuário e sua loja correspondente
    usuario = UsuarioPainel.query.get(user_id)
    if not usuario:
        return jsonify({"msg": "Usuário não encontrado"}), 404

    loja = Loja.query.get(usuario.loja_id)
    if not loja:
        return jsonify({"msg": "Loja não encontrada"}), 404

    # Retornar os dados da loja e do cliente
    return jsonify({
        "message": "Dados da loja e cliente",
        "store": loja.nome,
        "store_type": loja.tipo_estabelecimento,
        "client_name": usuario.nome,
        "client_email": usuario.email
    })

# Registro
@painel_bp.route("/registrar", methods=["POST"])
def registrar_usuario():
    data = request.json

    # Extraindo os dados do payload
    nome_loja = data.get("nome_loja")
    telefone = data.get("telefone")
    telefone_whatsapp_business = data.get("telefoneWhatsappBusiness")
    nome_usuario = data.get("nome_usuario")
    documento = data.get("documento")
    email = data.get("email")
    integrar_whatsapp = data.get("integrarWhatsapp", False)
    tipo_estabelecimento = data.get("tipo_estabelecimento")
    faturamento_mensal = data.get("faturamento_mensal")
    senha = data.get("senha")
    confirmar_senha = data.get("confirmar_senha")
    modo_operacao = data.get("modo_operacao")

    # Validação de campos obrigatórios
    if not all([nome_loja, telefone, nome_usuario, documento, email, senha, tipo_estabelecimento, confirmar_senha, modo_operacao, faturamento_mensal]):
        return jsonify({"msg": "Preencha todos os campos obrigatórios"}), 400

    if senha != confirmar_senha:
        return jsonify({"msg": "As senhas não coincidem"}), 400

    # Verificar se o email já está cadastrado
    if UsuarioPainel.query.filter_by(email=email).first():
        return jsonify({"msg": "Email já cadastrado"}), 409
    
    # Verificar se o documento já está cadastrado
    if UsuarioPainel.query.filter_by(documento=documento).first():
        return jsonify({"msg": "Documento já cadastrado"}), 409
    
    # Verificar se o nome da loja já está cadastrado
    if Loja.query.filter_by(nome=nome_loja).first():
        return jsonify({"msg": "Nome da loja já cadastrado"}), 409

    # Verificar se o slug da loja já existe
    slug_loja = slugify(nome_loja)
    if Loja.query.filter_by(slug=slug_loja).first():
        return jsonify({"msg": "Slug já usado"}), 409

      # Criar a loja
    try:
        loja = Loja(
            nome=data.get("nome_loja"),
            telefone_whatsapp_business=data.get("telefoneWhatsappBusiness"),
            tipo_estabelecimento=data.get("tipo_estabelecimento"),
            faturamento_mensal=data.get("faturamento_mensal"),
            integrar_whatsapp=data.get("integrarWhatsapp", False),
            modo_operacao=data.get("modo_operacao"),
            slug=slug_loja
        )
        db.session.add(loja)
        db.session.commit()
    except Exception as e:
        return jsonify({"msg": "Erro ao criar a loja", "error": str(e)}), 500

    # Hash da senha
    senha_hash = generate_password_hash(data.get("senha"))

    # Criar o usuário
    try:
        usuario = UsuarioPainel(
            documento=data.get("documento"),
            nome=data.get("nome_usuario"),
            telefone=data.get("telefone"),  
            funcao="administrador",  # Definindo a função como administrador
            email=data.get("email"),
            senha_hash=senha_hash,
            loja_id=loja.id  # Relacionando o usuário à loja
        )
        db.session.add(usuario)
        db.session.commit()
    except Exception as e:
        return jsonify({"msg": "Erro ao criar o usuário", "error": str(e)}), 500

    # Gerar o access_token
    try:
        
        # Criar um dicionário com as informações
        identity = {
            "usuario_id": usuario.id,
            "loja_id": usuario.loja_id
        }
        
        # Serializar o dicionário para uma string
        identity_string = json.dumps(identity)
        
        # Gerar o token
        access_token = create_access_token(identity=identity_string, fresh=True)
        print("Access Token:", access_token)
    except Exception as e:
        return jsonify({"msg": "Erro ao gerar o access token", "error": str(e)}), 500

    # Responder com o token
    response = jsonify({"msg": "Usuário e loja registrados com sucesso"})

    # Tentar obter o CSRF Token e configurá-lo no cookie
    try:
        csrf_token = get_csrf_token(encoded_token=access_token)  # Obter CSRF Token com o token codificado
        response.set_cookie('csrf_access_token', csrf_token, httponly=True, secure=False, samesite='Strict')
    except Exception as e:
        return jsonify({"msg": "Erro ao configurar o cookie CSRF", "error": str(e)}), 500

    # Tentar configurar o JWT Token no cookie
    try:
        set_access_cookies(response, access_token)
    except Exception as e:
        return jsonify({"msg": "Erro ao configurar o cookie de acesso", "error": str(e)}), 500

    # Caso não ocorra erro, retornar resposta com sucesso
    return response, 201




# # Login - envia JWT em cookie HttpOnly + Secure + SameSite=strict
# @painel_bp.route("/login", methods=["POST"])
# @limiter.limit("5 per minute")  # Limita a 5 tentativas por minuto
# def login():
#     data = request.json
#     email = data.get("email")
#     senha = data.get("senha")

#     user = UsuarioPainel.query.filter_by(email=email).first()
#     if not user or not bcrypt.checkpw(senha.encode("utf-8"), user.senha_hash.encode("utf-8")):
#         return jsonify({"msg": "Credenciais inválidas"}), 401

#     access_token = create_access_token(identity={
#         "id": user.id,
#         "email": user.email,
#         "loja_id": user.loja_id,
#         "funcao": user.funcao
#     })

#     resp = make_response(jsonify({"msg": "Login realizado com sucesso"}))
#     set_access_cookies(resp, access_token, max_age=3600, secure=True, httponly=True, samesite='Strict')

#     return resp


# # Logout - limpa cookie
# @painel_bp.route("/logout", methods=["POST"])
# def logout():
#     resp = make_response(jsonify({"msg": "Logout realizado com sucesso"}))
#     unset_jwt_cookies(resp)
#     return resp


# # Rota protegida com JWT
# @painel_bp.route("/painel/teste", methods=["GET"])
# @jwt_required()
# def rota_protegida():
#     usuario = get_jwt_identity()
#     return jsonify({
#         "msg": "Acesso autorizado!",
#         "usuario": usuario
#     })