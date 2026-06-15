const bcrypt = require("bcrypt");
const db = require("./models/db");

const usuarios = [
  {
    login: "admin",
    senha: "123456",
    nome: "Administrador do Sistema",
    perfil: "admin",
  },
  {
    login: "coordenador",
    senha: "123456",
    nome: "Carlos Coordenador",
    perfil: "coordenador",
  },
  {
    login: "professor1",
    senha: "123456",
    nome: "Prof. André Olímpio",
    perfil: "professor",
  },
  {
    login: "professor2",
    senha: "123456",
    nome: "Profa. Maria Silva",
    perfil: "professor",
  },
  { login: "aluno1", senha: "123456", nome: "João da Silva", perfil: "aluno" },
  { login: "aluno2", senha: "123456", nome: "Maria Santos", perfil: "aluno" },
  { login: "aluno3", senha: "123456", nome: "Pedro Oliveira", perfil: "aluno" },
];

async function criarUsuarios() {
  console.log("\n🚀 Criando usuários de teste...\n");

  let criados = 0;
  let existentes = 0;

  for (const usuario of usuarios) {
    try {
      const check = await db.query("SELECT id FROM usuarios WHERE login = $1", [
        usuario.login,
      ]);

      if (check.rows.length > 0) {
        console.log(`⚠️  Já existe: ${usuario.login}`);
        existentes++;
        continue;
      }

      const senhaHash = await bcrypt.hash(usuario.senha, 10);
      await db.query(
        "INSERT INTO usuarios (login, senha, nome, perfil) VALUES ($1, $2, $3, $4)",
        [usuario.login, senhaHash, usuario.nome, usuario.perfil],
      );

      console.log(`✅ Criado: ${usuario.login} (${usuario.perfil})`);
      criados++;
    } catch (err) {
      console.error(`❌ Erro em ${usuario.login}:`, err.message);
    }
  }

  console.log(`\n📊 Resumo: ${criados} criados, ${existentes} já existiam\n`);
  process.exit();
}

criarUsuarios();
