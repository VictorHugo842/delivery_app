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
import bcrypt

painel_bp = Blueprint('painel', __name__, url_prefix='/painel')

# Registro
@painel_bp.route("/registrar", methods=["POST"])
def registrar_usuario():
    data = request.json

    nome_loja: data.get("nome_loja")
    telefone: data.get("telefone")
    nome_usuario: data.get("nome_usuario")
    email: data.get("email")
    tipo_estabelecimento: data.get("tipo_estabelecimento")
    faturamento_mensal: data.get("faturamento_mensal")
    senha: data.get("email")
    confirmar_senha: data.get("confirmar_senha")

    if not all([nome_loja, documento, nome_usuario, email, senha]):
        return jsonify({"msg": "Preencha todos os campos"}), 400

    if UsuarioPainel.query.filter_by(email=email).first():
        return jsonify({"msg": "Email já cadastrado"}), 409

    slug_loja = slugify(nome_loja)
    if Loja.query.filter_by(slug=slug_loja).first():
        return jsonify({"msg": "Nome da loja já usado"}), 409

    loja = Loja(nome=nome_loja, slug=slug_loja)
    db.session.add(loja)
    db.session.commit()

    senha_hash = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    usuario = UsuarioPainel(
        documento=documento,
        nome=nome_usuario,
        email=email,
        senha_hash=senha_hash,
        loja_id=loja.id
    )
    db.session.add(usuario)
    db.session.commit()

    return jsonify({"msg": "Usuário e loja registrados com sucesso"}), 201


# Login - envia JWT em cookie HttpOnly + Secure + SameSite=strict
@painel_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    senha = data.get("senha")

    user = UsuarioPainel.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(senha.encode("utf-8"), user.senha_hash.encode("utf-8")):
        return jsonify({"msg": "Credenciais inválidas"}), 401

    access_token = create_access_token(identity={
        "id": user.id,
        "email": user.email,
        "loja_id": user.loja_id,
        "funcao": user.funcao
    })

    resp = make_response(jsonify({"msg": "Login realizado com sucesso"}))
    set_access_cookies(resp, access_token, max_age=3600, secure=True, httponly=True, samesite='Strict')

    return resp

# Logout - limpa cookie
@painel_bp.route("/logout", methods=["POST"])
def logout():
    resp = make_response(jsonify({"msg": "Logout realizado com sucesso"}))
    unset_jwt_cookies(resp)
    return resp

# Rota protegida com JWT
@painel_bp.route("/painel/teste", methods=["GET"])
@jwt_required()
def rota_protegida():
    usuario = get_jwt_identity()
    return jsonify({
        "msg": "Acesso autorizado!",
        "usuario": usuario
    })