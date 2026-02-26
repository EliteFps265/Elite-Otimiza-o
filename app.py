from flask import Flask, request, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)
users_db = {}

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API Elite Otimizações Online!"})

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    plan = data.get("plan")
    expire_days = data.get("expireDays", 30)

    if username in users_db:
        return jsonify({"success": False, "message": "Usuário já existe!"}), 400

    expire_date = (datetime.now() + timedelta(days=expire_days)).strftime("%Y-%m-%d")
    license_key = f"{username.upper()}-{datetime.now().timestamp():.0f}"

    users_db[username] = {
        "password": password,
        "plan": plan,
        "expireDate": expire_date,
        "licenseKey": license_key
    }

    return jsonify({
        "success": True,
        "username": username,
        "plan": plan,
        "expireDate": expire_date,
        "licenseKey": license_key,
        "message": "Usuário registrado com sucesso!"
    })

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = users_db.get(username)
    if not user or user["password"] != password:
        return jsonify({"success": False, "message": "Usuário ou senha inválidos!"}), 401

    return jsonify({
        "success": True,
        "username": username,
        "plan": user["plan"],
        "expireDate": user["expireDate"],
        "licenseKey": user["licenseKey"],
        "message": "Login efetuado com sucesso!"
    })
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # usa a porta do Render se existir
    app.run(host="0.0.0.0", port=port, debug=True)