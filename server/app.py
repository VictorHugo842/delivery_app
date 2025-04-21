from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Importar os Blueprints
from blueprints.client_routes import client_bp
from blueprints.admin_routes import admin_bp

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
app.register_blueprint(client_bp)
app.register_blueprint(admin_bp)

@app.route('/test_db_connection')
def test_db_connection():
    try:
        with db.engine.connect() as connection:
            connection.execute("SELECT 1")
        return jsonify({"message": "Conexão com o banco de dados bem-sucedida!"}), 200
    except Exception as e:
        return jsonify({"error": "Falha na conexão com o banco de dados", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")