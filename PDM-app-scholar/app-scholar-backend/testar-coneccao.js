const db = require("./models/db");

async function testar() {
  console.log("🧪 Testando conexão com o banco...\n");

  try {
    const result = await db.query("SELECT NOW()");
    console.log("✅ Conexão OK!");
    console.log("Data/hora do banco:", result.rows[0].now);

    // Verifica se a tabela usuarios existe
    const usuarios = await db.query("SELECT COUNT(*) FROM usuarios");
    console.log("👥 Total de usuários:", usuarios.rows[0].count);
  } catch (err) {
    console.error("❌ Erro:", err.message);
    console.error("Detalhes:", err);
  }

  process.exit();
}

testar();
