from flask import Blueprint, request, jsonify, make_response
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

painel_bp = Blueprint('painel', __name__, url_prefix='/painel')


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

    print(data)
    print("olá")

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
    loja = Loja(
        nome=nome_loja,
        telefone_whatsapp_business=telefone_whatsapp_business,
        tipo_estabelecimento=tipo_estabelecimento,
        faturamento_mensal=faturamento_mensal,
        integrar_whatsapp=integrar_whatsapp,
        modo_operacao=modo_operacao,
        slug=slug_loja
    )
    db.session.add(loja)
    db.session.commit()

    # Hash da senha
    senha_hash = generate_password_hash(senha)

    # Criar o usuário
    usuario = UsuarioPainel(
        documento=documento,
        nome=nome_usuario,
        email=email,
        senha_hash=senha_hash,
        loja_id=loja.id  # Relacionando o usuário à loja
    )
    db.session.add(usuario)
    db.session.commit()

    print("PASSO DBS CRIADO")
    # Gerar o JWT Token
    access_token = create_access_token(identity=usuario.id, fresh=True)
    print("Access Token:", access_token)
    
    # Responder com o token
    response = jsonify({"msg": "Usuário e loja registrados com sucesso"})

    # Setar o JWT Token no cookie
    set_access_cookies(response, access_token)

   
    print("Loja ID:", loja.id)
    print("Usuario ID:", usuario.id)
    print("Senha Hash:", senha_hash)

    csrf_token = get_csrf_token()  # Obter CSRF Token
    response.set_cookie('csrf_access_token', csrf_token, httponly=True, secure=True, samesite='Strict')

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