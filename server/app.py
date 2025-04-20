from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os

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

class Store(db.Model):
    __tablename__ = 'stores'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    tenant_id = db.Column(db.Integer, nullable=False)

@app.route('/')
def index():
    return jsonify({
        "message": "API is running!",
        "people": ["joão", "maria", "pedro"],
    })

@app.route('/test_db_connection')
def test_db_connection():
    try:
        with db.engine.connect() as connection:
            connection.execute(text("SELECT 1")) 
        return jsonify({"message": "Conexão com o banco de dados bem-sucedida!"}), 200
    except Exception as e:
        return jsonify({"error": "Falha na conexão com o banco de dados", "details": str(e)}), 500

if __name__ == "__main__":
    # migrate cria tables
    app.run(debug=True, host="0.0.0.0")
