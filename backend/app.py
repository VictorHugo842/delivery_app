from flask import Flask, jsonify, Response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy import text
from dotenv import load_dotenv
import json
import os

# Importar os Blueprints
from blueprints.cardapio_routes import cardapio_bp
from blueprints.painel_routes import painel_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load environment variables
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Database config
app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Registrar os Blueprints
app.register_blueprint(cardapio_bp)
app.register_blueprint(painel_bp)

@app.route('/test_db_connection')
def test_db_connection():
    try:
        with db.engine.connect() as connection:
            connection.execute(text("SELECT 1")) 
        response = {"message": "Conexão com o banco de dados bem-sucedida!"}
        return Response(json.dumps(response, ensure_ascii=False), content_type="application/json; charset=utf-8"), 200
    except Exception as e:
        response = {"error": "Falha na conexão com o banco de dados", "details": str(e)}
        return Response(json.dumps(response, ensure_ascii=False), content_type="application/json; charset=utf-8"), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")