from extensions import db
from datetime import datetime, timezone

class UsuarioPainel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    documento = db.Column(db.String(14), unique=True, nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telefone = db.Column(db.String(20))
    senha_hash = db.Column(db.Text, nullable=False)
    funcao = db.Column(db.String(20), nullable=False, default='administrador')
    loja_id = db.Column(db.Integer, db.ForeignKey('loja.id'), nullable=False)
    loja = db.relationship('Loja', backref=db.backref('usuarios', lazy=True))
    criado_em = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))