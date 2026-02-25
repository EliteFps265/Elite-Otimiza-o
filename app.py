from flask import Flask, request

app = Flask(__name__)

# LICENÇAS VÁLIDAS (depois você pode colocar banco)
LICENCAS_VALIDAS = [
    "ELITE-123-456",
    "ELITE-789-000",
    "VIP-ULTRA-999"
]

@app.route("/")
def home():
    return "Elite API Online 🚀"

@app.route("/validar")
def validar():
    key = request.args.get("key")

    if key in LICENCAS_VALIDAS:
        return "OK"
    else:
        return "INVALID"

# Render usa essa porta automaticamente
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)