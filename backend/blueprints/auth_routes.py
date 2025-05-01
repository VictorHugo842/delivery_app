from flask import Blueprint, jsonify, g
from decorators.jwt_required_custom import jwt_required_custom
from decorators.tenant_required import tenant_required

auth_api = Blueprint('auth', __name__, url_prefix='/auth')

@auth_api.route("/check_auth_tenant", methods=["GET", "POST"])
@jwt_required_custom
@tenant_required
def check_auth_tenant():
    return jsonify({"message": "Acesso permitido!"}), 200
