const db = require('./models/db');

async function diagnosticarExclusao() {
  console.log('\n🔍 DIAGNÓSTICO DE EXCLUSÃO DE USUÁRIOS\n');
  
  try {
    // Lista todos os usuários
    const usuarios = await db.query(`
      SELECT u.id, u.login, u.nome, u.perfil,
        (SELECT COUNT(*) FROM alunos a WHERE a.email = u.login) as alunos_vinculados,
        (SELECT COUNT(*) FROM professores p WHERE p.email = u.login) as profs_vinculados
      FROM usuarios u
      ORDER BY u.id
    `);
    
    console.log('\n📋 USUÁRIOS NO BANCO:');
    console.log('ID | Login | Nome | Perfil | Alunos Vinc. | Profs Vinc.');
    console.log('-'.repeat(80));
    usuarios.rows.forEach(u => {
      console.log(`${u.id} | ${u.login} | ${u.nome} | ${u.perfil} | ${u.alunos_vinculados} | ${u.profs_vinculados}`);
    });

    // Testa exclusão de um usuário de teste
    console.log('\n🧪 TESTE: Tentando excluir usuário ID 999 (inexistente)');
    const result = await db.query('DELETE FROM usuarios WHERE id = 999 RETURNING *');
    console.log('Resultado:', result.rows.length === 0 ? 'Nenhum usuário excluído (esperado)' : result.rows);

    console.log('\n✅ Diagnóstico concluído!\n');
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }

  process.exit();
}

diagnosticarExclusao();