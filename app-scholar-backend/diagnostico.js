const db = require('./models/db');

async function diagnostico() {
  console.log('\n DIAGNÓSTICO DO BANCO\n');
  console.log('='.repeat(70));

  try {
    // 1. Usuários alunos
    const usuarios = await db.query(
      "SELECT id, login, nome, perfil, matricula FROM usuarios WHERE perfil = 'aluno'"
    );
    console.log('\n👥 USUÁRIOS ALUNOS:');
    console.log('ID | Login | Nome | Matrícula');
    console.log('-'.repeat(70));
    usuarios.rows.forEach(u => {
      console.log(`${u.id} | ${u.login} | ${u.nome} | ${u.matricula || 'NULL'}`);
    });

    // 2. Alunos cadastrados
    const alunos = await db.query('SELECT id, matricula, nome, email, curso FROM alunos');
    console.log('\n🎓 ALUNOS CADASTRADOS:');
    console.log('ID | Matrícula | Nome | Email | Curso');
    console.log('-'.repeat(70));
    alunos.rows.forEach(a => {
      console.log(`${a.id} | ${a.matricula} | ${a.nome} | ${a.email || 'NULL'} | ${a.curso || 'NULL'}`);
    });

    // 3. Professores
    const professores = await db.query('SELECT id, nome, email FROM professores');
    console.log('\n‍🏫 PROFESSORES:');
    console.log('ID | Nome | Email');
    console.log('-'.repeat(70));
    professores.rows.forEach(p => {
      console.log(`${p.id} | ${p.nome} | ${p.email || 'NULL'}`);
    });

    // 4. Disciplinas
    const disciplinas = await db.query(`
      SELECT d.id, d.nome, d.professor_id, p.nome as professor_nome 
      FROM disciplinas d 
      LEFT JOIN professores p ON d.professor_id = p.id
    `);
    console.log('\n📚 DISCIPLINAS:');
    console.log('ID | Nome | Professor ID | Professor');
    console.log('-'.repeat(70));
    disciplinas.rows.forEach(d => {
      console.log(`${d.id} | ${d.nome} | ${d.professor_id || 'NULL'} | ${d.professor_nome || 'Sem professor'}`);
    });

    // 5. Notas
    const notas = await db.query(`
      SELECT n.id, a.nome as aluno, d.nome as disciplina, n.nota1, n.nota2, n.media, n.situacao
      FROM notas n
      JOIN alunos a ON n.aluno_id = a.id
      JOIN disciplinas d ON n.disciplina_id = d.id
    `);
    console.log('\n📝 NOTAS:');
    console.log('Aluno | Disciplina | N1 | N2 | Média | Situação');
    console.log('-'.repeat(70));
    if (notas.rows.length === 0) {
      console.log('Nenhuma nota cadastrada');
    } else {
      notas.rows.forEach(n => {
        console.log(`${n.aluno} | ${n.disciplina} | ${n.nota1} | ${n.nota2} | ${n.media} | ${n.situacao}`);
      });
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n💡 ANÁLISE:');
    
    // Verifica vínculo
    for (const user of usuarios.rows) {
      const alunoMatch = alunos.rows.find(a => a.email === user.login);
      const matriculaMatch = alunos.rows.find(a => a.matricula === user.matricula);
      
      if (alunoMatch) {
        console.log(`✅ ${user.login} → vinculado por EMAIL ao aluno: ${alunoMatch.nome}`);
      } else if (matriculaMatch) {
        console.log(`️ ${user.login} → NÃO vinculado por email, mas matrícula bate com: ${matriculaMatch.nome}`);
      } else {
        console.log(`❌ ${user.login} → SEM VÍNCULO com nenhum aluno!`);
      }
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }

  process.exit();
}

diagnostico();