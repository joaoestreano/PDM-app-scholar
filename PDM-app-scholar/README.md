# 🎓 App Scholar - Sistema de Gerenciamento Acadêmico

Sistema completo para gerenciamento acadêmico desenvolvido com React Native (Expo) no frontend e Node.js (Express) no backend, com banco de dados PostgreSQL.

![Status](https://img.shields.io/badge/status-concluído-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Executando o Projeto](#-executando-o-projeto)
- [Credenciais de Teste](#-credenciais-de-teste)
- [API Endpoints](#-api-endpoints)
- [Controle de Acesso por Perfil](#-controle-de-acesso-por-perfil)
- [Autor](#-autor)

---

## 📖 Sobre o Projeto

O **App Scholar** é um sistema de gerenciamento acadêmico desenvolvido como atividade avaliativa. O sistema permite o gerenciamento completo de alunos, professores, disciplinas e notas, com controle de acesso baseado em perfis de usuário.

O projeto foi desenvolvido com arquitetura **cliente-servidor**, separando o frontend (React Native/Expo) do backend (Node.js/Express), comunicando-se via API REST com autenticação JWT.

---

## ✨ Funcionalidades

### 🔐 Autenticação e Usuários
- Login com JWT (JSON Web Token)
- Alteração de senha
- Gerenciamento de usuários (Admin)
- Controle de acesso por perfil (Aluno, Professor, Coordenador, Admin)

### 👨‍🎓 Alunos
- Cadastro completo de alunos
- Preenchimento automático de endereço via CEP (ViaCEP)
- Seleção de estado e cidade (IBGE)
- Consulta de boletim pessoal
- Busca por matrícula

### 👨‍🏫 Professores
- Cadastro de professores
- Visualização de disciplinas lecionadas
- Lançamento de notas dos alunos
- Consulta de boletim de qualquer aluno

###  Disciplinas
- Cadastro de disciplinas
- Vinculação com professores
- Controle por semestre e curso

### 📊 Boletim
- Visualização de notas e médias
- Situação automática (Aprovado/Recuperação/Reprovado)
- Histórico completo por disciplina

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- [React Native](https://reactnative.dev/) - Framework mobile
- [Expo SDK 56](https://expo.dev/) - Plataforma de desenvolvimento
- [React Navigation](https://reactnavigation.org/) - Navegação entre telas
- [Axios](https://axios-http.com/) - Cliente HTTP
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) - Armazenamento local
- [React Native Picker](https://github.com/react-native-picker/picker) - Seleção de opções

### Backend
- [Node.js](https://nodejs.org/) - Runtime JavaScript
- [Express](https://expressjs.com/) - Framework web
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- [JWT](https://jwt.io/) - Autenticação por tokens
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Criptografia de senhas
- [CORS](https://www.npmjs.com/package/cors) - Cross-Origin Resource Sharing
- [dotenv](https://www.npmjs.com/package/dotenv) - Variáveis de ambiente
- [Nodemon](https://nodemon.io/) - Hot reload em desenvolvimento

### APIs Externas
- [ViaCEP](https://viacep.com.br/) - Consulta de endereços por CEP
- [IBGE](https://servicodados.ibge.gov.br/) - Estados e cidades do Brasil

---

## 📁 Estrutura do Projeto

```text
app-scholar-project/
├── app-scholar/                    # Frontend (React Native)
│   ├── src/
│   │   ├── components/            # Componentes reutilizáveis
│   │   ├── contexts/              # Context API (Auth)
│   │   ├── hooks/                 # Custom hooks
│   │   ├── navigation/            # Configuração de rotas
│   │   ├── screens/               # Telas do aplicativo
│   │   ├── services/              # Serviços (API)
│   │   └── styles/                # Estilos e temas
│   ├── App.js
│   └── package.json
│
── app-scholar-backend/           # Backend (Node.js)
│   ├── controllers/               # Controladores da API
│   ├── routes/                    # Rotas da API
│   ├── models/                    # Modelos de dados
│   ├── middleware/                 # Middlewares (auth)
│   ├── database/                  # Scripts SQL
│   ├── server.js
│   └── package.json
│
└── README.md                      # Documentação principal
```

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (versão 12 ou superior)
- [Git](https://git-scm.com/)

---

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/SEU_USUARIO/app-scholar.git
cd app-scholar
```

### 2. Instale o Frontend

```bash
cd app-scholar
npm install
```

### 3. Instale o Backend

```bash
cd ../app-scholar-backend
npm install
```

---

## 🗄️ Configuração do Banco de Dados

### 1. Crie o Banco de Dados

Abra o pgAdmin ou use o terminal PostgreSQL:

```sql
CREATE DATABASE app_scholar;
```

### 2. Execute o Script de Criação das Tabelas

```bash
cd app-scholar-backend
psql -U postgres -d app_scholar -f database/schema.sql
```

### 3. Configure as Variáveis de Ambiente

Crie o arquivo `.env` na pasta `app-scholar-backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha_do_postgresql
DB_NAME=app_scholar
JWT_SECRET=segredo_super_secreto_app_scholar_2026
```

⚠️ **Importante:** Substitua `sua_senha_do_postgresql` pela senha real do seu PostgreSQL.

### 4. Crie Usuários de Teste

```bash
node criar-usuarios-banco.js
```

---

## ▶️ Executando o Projeto

### Iniciar o Backend

```bash
cd app-scholar-backend
npm run dev
```
O servidor estará rodando em: `http://localhost:3000`

### Iniciar o Frontend

Em outro terminal:

```bash
cd app-scholar
npx expo start
```

Opções de execução:
- Pressione **`w`** para abrir no navegador (Web)
- Pressione **`a`** para abrir no emulador Android
- Pressione **`i`** para abrir no simulador iOS

---

## 🔑 Credenciais de Teste

| Login | Senha | Perfil | Descrição |
|-------|-------|--------|-----------|
| `admin` | `123456` | Administrador | Acesso total ao sistema |
| `coordenador` | `123456` | Coordenador | Gerencia alunos e professores |
| `professor1` | `123456` | Professor | Lança notas das suas disciplinas |
| `aluno1` | `123456` | Aluno | Visualiza seu boletim |

---

## 🌐 API Endpoints

### Autenticação
- `POST /api/login` - Realizar login
- `POST /api/registrar` - Registrar novo usuário

### Alunos
- `GET /api/alunos` - Listar todos os alunos
- `POST /api/alunos` - Cadastrar aluno
- `PUT /api/alunos/:id` - Atualizar aluno
- `DELETE /api/alunos/:id` - Excluir aluno

### Professores
- `GET /api/professores` - Listar professores
- `POST /api/professores` - Cadastrar professor

### Disciplinas
- `GET /api/disciplinas` - Listar disciplinas
- `POST /api/disciplinas` - Cadastrar disciplina

### Boletim e Notas
- `GET /api/boletim/:matricula` - Consultar boletim por matrícula
- `GET /api/boletim/meu-boletim` - Boletim do aluno logado
- `GET /api/boletim/professor/disciplinas` - Disciplinas do professor
- `POST /api/boletim/professor/lancar-nota` - Lançar nota do aluno

### Usuários
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Excluir usuário
- `POST /api/usuarios/alterar-senha` - Alterar própria senha

---

## 🎭 Controle de Acesso por Perfil

### 👨‍🎓 Aluno
- ✅ Visualizar próprio boletim
- ✅ Alterar senha

### 👨‍🏫 Professor
- ✅ Visualizar disciplinas lecionadas
- ✅ Lançar notas dos alunos
- ✅ Consultar boletim de qualquer aluno
- ✅ Alterar senha

### 🧑‍💼 Coordenador
- ✅ Cadastrar alunos
- ✅ Cadastrar professores
- ✅ Consultar boletins
- ✅ Alterar senha

### 👑 Administrador
- ✅ Acesso total ao sistema
- ✅ Gerenciar usuários
- ✅ Todas as funcionalidades dos outros perfis

---

##  Contribuição

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um Fork do projeto
2. Crie uma Branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 👨‍ Autor

**João Victor Estreano**

- GitHub: [@joaoestreano](https://github.com/joaoestreano)
- Email: joaovictorestreano@gmail.com

---

<div align="center">

**Feito por João Victor Estreano**

</div>