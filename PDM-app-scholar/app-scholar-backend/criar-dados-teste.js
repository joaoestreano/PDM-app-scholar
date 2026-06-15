const bcrypt = require('bcrypt');
const db = require('./models/db');

async function criarDadosTeste() {
  console.log('\n📦 CRIANDO DADOS DE TESTE COMPLETOS\n');
  console.log('='.repeat(70));

  try {
    // === 1. CRIAR ALUNOS ===
    console.log('\n🎓 CRIANDO ALUNOS:');
    
    const alunosData = [
      { matricula: '2026001', nome: 'João da Silva', email: 'aluno1', curso: 'Desenvolvimento de Software' },
      { matricula: '2026002', nome: 'Maria Santos', email: 'aluno2', curso: 'Desenvolvimento de Software' },
      { matricula: '2026003', nome: 'Pedro Oliveira', email: 'aluno3', curso: 'Desenvolvimento de Software' },
    ];

    for (const aluno of alunosData) {
      // Verifica se já existe
      const existing = await db.query(
        'SELECT id FROM alunos WHERE matricula = $1 OR email = $2',
        [aluno.matricula, aluno.email]
      );

      if (existing.rows.length === 0) {
        await db.query(
          `INSERT INTO alunos (matricula, nome, email, curso, cep, endereco, cidade, estado) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [aluno.matricula, aluno.nome, aluno.email, aluno.curso, '12245000', 'Av. Principal', 'São José dos Campos', 'SP']
        );
        console.log(`✅ Aluno criado: ${aluno.nome} (${aluno.matricula}) - Email: ${aluno.email}`);
      } else {
        console.log(`✓ Aluno já existe: ${aluno.nome}`);
      }
    }

    // === 2. CRIAR PROFESSORES ===
    console.log('\n👨‍🏫 CRIANDO PROFESSORES:');
    
    const professoresData = [
      { nome: 'Prof. André Olímpio', email: 'professor1', titulacao: 'Doutor', area: 'Ciência da Computação' },
      { nome: 'Profa. Maria Silva', email: 'professor2', titulacao: 'Mestre', area: 'Engenharia de Software' },
    ];

    for (const prof of professoresData) {
      const existing = await db.query(
        'SELECT id FROM professores WHERE email = $1',
        [prof.email]
      );

      if (existing.rows.length === 0) {
        await db.query(
          `INSERT INTO professores (nome, email, titulacao, area, tempo_docencia) 
           VALUES ($1, $2, $3, $4, $5)`,
          [prof.nome, prof.email, prof.titulacao, prof.area, 10]
        );
        console.log(`✅ Professor criado: ${prof.nome} - Email: ${prof.email}`);
      } else {
        console.log(`✓ Professor já existe: ${prof.nome}`);
      }
    }

    // === 3. CRIAR DISCIPLINAS ===
    console.log('\n📚 CRIANDO DISCIPLINAS:');
    
    // Busca professores criados
    const professores = await db.query("SELECT id, nome FROM professores WHERE email IN ('professor1', 'professor2')");
    
    if (professores.rows.length > 0) {
      const disciplinasData = [
        { nome: 'Programação Mobile', carga: 80, professor: professores.rows[0].id, curso: 'Desenvolvimento de Software', semestre: '2026.1' },
        { nome: 'Banco de Dados', carga: 60, professor: professores.rows[0].id, curso: 'Desenvolvimento de Software', semestre: '2026.1' },
        { nome: 'Engenharia de Software', carga: 80, professor: professores.rows[1].id, curso: 'Desenvolvimento de Software', semestre: '2026.1' },
        { nome: 'Redes de Computadores', carga: 60, professor: professores.rows[1].id, curso: 'Desenvolvimento de Software', semestre: '2026.2' },
      ];

      for (const disc of disciplinasData) {
        const existing = await db.query(
          'SELECT id FROM disciplinas WHERE nome = $1 AND professor_id = $2',
          [disc.nome, disc.professor]
        );

        if (existing.rows.length === 0) {
          await db.query(
            `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre) 
             VALUES ($1, $2, $3, $4, $5)`,
            [disc.nome, disc.carga, disc.professor, disc.curso, disc.semestre]
          );
          console.log(`✅ Disciplina criada: ${disc.nome} (${professores.rows.find(p => p.id === disc.professor)?.nome})`);
        } else {
          console.log(`✓ Disciplina já existe: ${disc.nome}`);
        }
      }
    }

    // === 4. CRIAR NOTAS DE TESTE ===
    console.log('\n📝 CRIANDO NOTAS DE TESTE:');
    
    const alunos = await db.query("SELECT id, nome, matricula FROM alunos WHERE email IN ('aluno1', 'aluno2', 'aluno3')");
    const disciplinas = await db.query('SELECT id, nome FROM disciplinas');

    if (alunos.rows.length > 0 && disciplinas.rows.length > 0) {
      for (const aluno of alunos.rows) {
        for (const disc of disciplinas.rows) {
          const existing = await db.query(
            'SELECT id FROM notas WHERE aluno_id = $1 AND disciplina_id = $2',
            [aluno.id, disc.id]
          );

          if (existing.rows.length === 0) {
            // Gera notas aleatórias
            const nota1 = (Math.random() * 10).toFixed(1);
            const nota2 = (Math.random() * 10).toFixed(1);
            const media = ((parseFloat(nota1) + parseFloat(nota2)) / 2).toFixed(1);
            
            let situacao = 'Reprovado';
            if (media >= 7) situacao = 'Aprovado';
            else if (media >= 5) situacao = 'Recuperação';

            await db.query(
              `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao) 
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [aluno.id, disc.id, nota1, nota2, media, situacao]
            );
            
            console.log(`✅ Notas: ${aluno.nome} - ${disc.nome} (Média: ${media} - ${situacao})`);
          }
        }
      }
    } else {
      console.log('⚠️  Sem alunos ou disciplinas para criar notas');
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ DADOS DE TESTE CRIADOS COM SUCESSO!\n');
    
    console.log('\n📋 RESUMO DOS USUÁRIOS PARA LOGIN:');
    console.log('┌─────────────────────────────┬──────────┬─────────────┐');
    console.log('│ Login                       │ Senha    │ Perfil      │');
    console.log('├─────────────────────────────┼──────────┼─────────────┤');
    console.log('│ admin                       │ 123456   │ admin       │');
    console.log('│ coordenador                 │ 123456   │ coordenador │');
    console.log('│ professor1                  │ 123456   │ professor   │');
    console.log('│ professor2                  │ 123456   │ professor   │');
    console.log('│ aluno1                      │ 123456   │ aluno       │');
    console.log('│ aluno2                      │ 123456   │ aluno       │');
    console.log('│ aluno3                      │ 123456   │ aluno       │');
    console.log('│ joaovictorestreano@gmail... │ 123456   │ aluno       │');
    console.log('└─────────────────────────────┴──────────┴─────────────┘\n');

  } catch (err) {
    console.error('❌ Erro:', err.message);
    console.error(err.stack);
  }

  process.exit();
}

criarDadosTeste();