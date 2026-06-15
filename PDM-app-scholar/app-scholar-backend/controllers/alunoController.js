const db = require('../models/db');

exports.create = async (req, res) => {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;

  if (!nome || !matricula || !curso || !email) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, matrícula, curso e email' });
  }

  try {
    const result = await db.query(
      `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado]
    );
    return res.status(201).json({
      message: 'Aluno cadastrado com sucesso!',
      aluno: result.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Matrícula já existe' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.list = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alunos ORDER BY nome');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM alunos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;

  try {
    const result = await db.query(
      `UPDATE alunos SET nome=$1, matricula=$2, curso=$3, email=$4, telefone=$5, 
       cep=$6, endereco=$7, cidade=$8, estado=$9 WHERE id=$10 RETURNING *`,
      [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    return res.json({ message: 'Aluno atualizado!', aluno: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM alunos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    return res.json({ message: 'Aluno removido com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};