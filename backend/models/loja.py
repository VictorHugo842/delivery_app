from extensions import db
from datetime import datetime

class Loja(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)