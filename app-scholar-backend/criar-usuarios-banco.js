const bcrypt = require('bcrypt');
const db = require('./models/db');

// Lista de usuários para criar
const usuarios = [
  {
    login: 'admin',
    senha: '123456',
    nome: 'Administrador do Sistema',
    perfil: 'admin'
  },
  {
    login: 'coordenador',
    senha: '123456',
    nome: 'Carlos Coordenador',
    perfil: 'coordenador'
  },
  {
    login: 'professor1',
    senha: '123456',
    nome: 'Prof. André Olímpio',
    perfil: 'professor'
  },
  {
    login: 'professor2',
    senha: '123456',
    nome: 'Profa. Maria Silva',
    perfil: 'professor'
  },
  {
    login: 'aluno1',
    senha: '123456',
    nome: 'João da Silva',
    perfil: 'aluno'
  },
  {
    login: 'aluno2',
    senha: '123456',
    nome: 'Maria Santos',
    perfil: 'aluno'
  },
  {
    login: 'aluno3',
    senha: '123456',
    nome: 'Pedro Oliveira',
    perfil: 'aluno'
  }
];

async function criarUsuarios() {
  console.log('\n🚀 Iniciando criação de usuários...\n');
  console.log('='.repeat(50));

  let criados = 0;
  let existentes = 0;
  let erros = 0;

  for (const usuario of usuarios) {
    try {
      // Verifica se o usuário já existe
      const check = await db.query(
        'SELECT id FROM usuarios WHERE login = $1',
        [usuario.login]
      );

      if (check.rows.length > 0) {
        console.log(`⚠️  Usuário já existe: ${usuario.login}`);
        existentes++;
        continue;
      }

      // Gera o hash da senha
      const senhaHash = await bcrypt.hash(usuario.senha, 10);

      // Insere o usuário
      const result = await db.query(
        `INSERT INTO usuarios (login, senha, nome, perfil) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, login, nome, perfil`,
        [usuario.login, senhaHash, usuario.nome, usuario.perfil]
      );

      console.log(`✅ Usuário criado: ${result.rows[0].login} (${result.rows[0].perfil})`);
      criados++;
    } catch (err) {
      console.error(`❌ Erro ao criar ${usuario.login}:`, err.message);
      erros++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 RESUMO:');
  console.log(`   ✅ Criados: ${criados}`);
  console.log(`   ️  Já existiam: ${existentes}`);
  console.log(`   ❌ Erros: ${erros}`);

  console.log('\n USUÁRIOS DISPONÍVEIS PARA LOGIN:');
  console.log('┌─────────────────┬──────────┬─────────────┐');
  console.log('│ Login           │ Senha    │ Perfil      │');
  console.log('─────────────────┼──────────┼─────────────┤');
  console.log('│ admin           │ 123456   │ admin       │');
  console.log('│ coordenador     │ 123456   │ coordenador │');
  console.log('│ professor1      │ 123456   │ professor   │');
  console.log('│ professor2      │ 123456   │ professor   │');
  console.log('│ aluno1          │ 123456   │ aluno       │');
  console.log('│ aluno2          │ 123456   │ aluno       │');
  console.log('│ aluno3          │ 123456   │ aluno       │');
  console.log('└─────────────────┴──────────┴─────────────┘\n');

  process.exit();
}

criarUsuarios();