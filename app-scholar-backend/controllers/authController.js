const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

exports.login = async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ error: 'Login e senha são obrigatórios' });
  }

  try {
    const result = await db.query('SELECT * FROM usuarios WHERE login = $1', [login]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      usuario: {
        nome: usuario.nome,
        perfil: usuario.perfil,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.registrar = async (req, res) => {
  const { login, senha, nome } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ error: 'Login e senha são obrigatórios' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const result = await db.query(
      'INSERT INTO usuarios (login, senha, nome) VALUES ($1, $2, $3) RETURNING id, nome, perfil',
      [login, senhaHash, nome || login]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Login já existe' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};