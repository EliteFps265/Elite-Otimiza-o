import express from "express";
import bodyParser from "body-parser";
import fs from "fs-extra";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const usersFile = path.join(process.cwd(), "users.json");

app.use(bodyParser.json());

// Garante que users.json existe
if (!fs.existsSync(usersFile)) {
  fs.writeJsonSync(usersFile, []);
}

// Função para ler usuários
const readUsers = async () => {
  return await fs.readJson(usersFile);
};

// Função para salvar usuários
const saveUsers = async (users) => {
  await fs.writeJson(usersFile, users);
};

// =====================
// ROTA DE REGISTRO
// =====================
app.post("/register", async (req, res) => {
  const { username, password, expireDate } = req.body;

  if (!username || !password || !expireDate) {
    return res.status(400).json({ success: false, message: "Preencha todos os campos!" });
  }

  const users = await readUsers();

  // Verifica se já existe
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: "Usuário já existe!" });
  }

  users.push({
    username,
    password,
    expireDate: new Date(expireDate).toISOString()
  });

  await saveUsers(users);

  res.json({ success: true, message: "Usuário registrado com sucesso!" });
});

// =====================
// ROTA DE LOGIN
// =====================
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const users = await readUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: "Usuário ou senha inválidos!" });
  }

  const now = new Date();
  const expire = new Date(user.expireDate);

  if (now > expire) {
    return res.status(403).json({ success: false, message: "Sua conta expirou!" });
  }

  res.json({
    success: true,
    username: user.username,
    expireDate: user.expireDate,
    message: "Login efetuado com sucesso!"
  });
});

// =====================
// ROTA TESTE
// =====================
app.get("/", (req, res) => {
  res.send("Elite API online ✅");
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});