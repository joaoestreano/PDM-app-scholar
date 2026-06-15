const db = require("./models/db");

async function debug() {
  try {
    const result = await db.query("SELECT current_database()");
    console.log("📊 Banco conectado:", result.rows[0].current_database);

    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log("📋 Tabelas existentes:");
    tables.rows.forEach((t) => console.log("  -", t.table_name));
  } catch (err) {
    console.error("❌ Erro:", err.message);
  }

  process.exit();
}

debug();
