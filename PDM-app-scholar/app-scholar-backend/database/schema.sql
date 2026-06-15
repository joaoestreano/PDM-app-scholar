-- Criar banco de dados
CREATE DATABASE app_scholar;

-- Conectar ao banco
\c app_scholar;

-- Tabela de usuários (para login)
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  login VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  nome VARCHAR(150),
  perfil VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de alunos
CREATE TABLE alunos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  matricula VARCHAR(50) UNIQUE NOT NULL,
  curso VARCHAR(100),
  email VARCHAR(100),
  telefone VARCHAR(20),
  cep VARCHAR(10),
  endereco VARCHAR(200),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de professores
CREATE TABLE professores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  titulacao VARCHAR(50),
  area VARCHAR(100),
  tempo_docencia INTEGER,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de disciplinas
CREATE TABLE disciplinas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  carga_horaria INTEGER,
  professor_id INTEGER REFERENCES professores(id) ON DELETE SET NULL,
  curso VARCHAR(100),
  semestre VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notas
CREATE TABLE notas (
  id SERIAL PRIMARY KEY,
  aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
  disciplina_id INTEGER REFERENCES disciplinas(id) ON DELETE CASCADE,
  nota1 DECIMAL(4,2),
  nota2 DECIMAL(4,2),
  media DECIMAL(4,2),
  situacao VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);