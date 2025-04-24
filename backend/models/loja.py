from extensions import db
from datetime import datetime

class Loja(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    telefone_whatsapp_business = db.Column(db.String(20))
    tipo_estabelecimento = db.Column(db.String(50))
    faturamento_mensal = db.Column(db.String(50))
    integrar_whatsapp = db.Column(db.Boolean, default=False)
    modo_operacao = db.Column(db.JSON) 
    slug = db.Column(db.String(100), unique=True, nullable=False)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
