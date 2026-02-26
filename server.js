// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Banco simples (JSON) - para testes rápidos
const DB_FILE = "users.json";

// Função para ler banco
function readDB() {
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(DB_FILE));
}

// Função para salvar no banco
function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// =====================
// ROTAS
// =====================

// Rota de registro
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ success: false, message: "Preencha username e password" });

    let users = readDB();
    if (users.find(u => u.username === username))
        return res.status(400).json({ success: false, message: "Usuário já existe" });

    users.push({ username, password, plan: "Bronze" }); // padrão Bronze
    saveDB(users);
    res.json({ success: true, message: "Usuário registrado com sucesso!" });
});

// Rota de login
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ success: false, message: "Preencha username e password" });

    let users = readDB();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user)
        return res.status(401).json({ success: false, message: "Usuário ou senha incorretos" });

    // Resposta pronta para seu painel .exe
    res.json({
        success: true,
        username: user.username,
        plan: user.plan,
        message: "Login efetuado com sucesso!"
    });
});

// Rota de keys (opcional)
app.get("/keys", (req, res) => {
    // Exemplo simples, você pode integrar geração/validação real
    res.json({
        success: true,
        keys: [
            { key: "BRONZE123", plan: "Bronze" },
            { key: "OURO456", plan: "Ouro" }
        ]
    });
});

// =====================
// INICIAR SERVIDOR
// =====================
app.listen(PORT, () => {
    console.log(`API rodando em: https://elite-otimiza-o.onrender.com`);
});