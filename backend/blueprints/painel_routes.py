from flask import Blueprint, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from extensions import db, redis
from models.usuario_painel import UsuarioPainel
from models.loja import Loja
from slugify import slugify
from werkzeug.security import generate_password_hash, check_password_hash  # para segurança de senha
from middlewares.jwt_required_custom import jwt_required_custom
from middlewares.tenant_required import tenant_required
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required,
    get_jwt_identity, set_access_cookies, unset_jwt_cookies,
    get_csrf_token
)
import json

painel_api = Blueprint('painel', __name__, url_prefix='/painel')

# @painel_api.route('/test_redis2', methods=['GET'])
# @jwt_required_custom
# @tenant_required
# def painel_test_redis():
#     redis.incr('painel_hits')  # incrementa contador no Redis
#     hits = redis.get('painel_hits')  # pega o contador atualizado
#     return jsonify({
#         'message': f'This painel page has been visited {hits.decode()} times.'
#     })

@painel_api.route("/check_login", methods=["GET"])
@jwt_required_custom
@tenant_required
def check_login():
    return jsonify({"msg": "Usuário autenticado", "logged_in": True}), 200

@painel_api.route("/protect_route", methods=["GET","POST"])
@jwt_required_custom
@tenant_required
def protect_route():
    return jsonify({"message": "Acesso permitido!"}), 200

@painel_api.route("/delivery", methods=["GET"])
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
@painel_api.route("/registrar", methods=["POST"])
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
    set_access_cookies(response, access_token)

    return response, 201

######################################################################
# USAR LIMITER PRA LIMITAR O NÚMERO DE TENTATIVAS DE LOGIN E REGISTRO
######################################################################

@painel_api.route("/login", methods=["POST"])
def login_usuario():
    data = request.json

    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"msg": "Preencha email e senha"}), 400

    # Buscar o usuário pelo email
    usuario = UsuarioPainel.query.filter_by(email=email).first()

    if not usuario or not check_password_hash(usuario.senha_hash, senha):
        return jsonify({"msg": "Email ou senha inválidos"}), 401

    # Criar o dicionário de identidade
    identity = {
        "usuario_id": usuario.id,
        "loja_id": usuario.loja_id
    }

    # Serializar o dicionário para uma string
    identity_string = json.dumps(identity)

    # Gerar o token
    try:
        access_token = create_access_token(identity=identity_string, fresh=True)

    except Exception as e:
        return jsonify({"msg": "Erro ao gerar o access token", "error": str(e)}), 500

    response = jsonify({"msg": "Login realizado com sucesso"})
    set_access_cookies(response, access_token)
   
    return response, 200


@painel_api.route("/logout", methods=["POST"])
@jwt_required_custom
@tenant_required
def logout_usuario():
    response = jsonify({"msg": "Logout realizado com sucesso"})

    # Limpar cookies de autenticação
    try:
        unset_jwt_cookies(response)
    except Exception as e:
        return jsonify({"msg": "Erro ao limpar cookies", "error": str(e)}), 500

    return response, 200

