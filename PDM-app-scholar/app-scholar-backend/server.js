const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: '🚀 API App Scholar funcionando!' });
});

app.use('/api', require('./routes/authRoutes'));
app.use('/api/alunos', require('./routes/alunoRoutes'));
app.use('/api/professores', require('./routes/professorRoutes'));
app.use('/api/disciplinas', require('./routes/disciplinaRoutes'));
app.use('/api/boletim', require('./routes/boletimRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));  // ← NOVA LINHA

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});