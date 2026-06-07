const db = require('../models/db');

exports.create = async (req, res) => {
  const { nome, titulacao, area, tempo_docencia, email } = req.body;

  if (!nome || !titulacao || !area || !email) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, titulação, área e email' });
  }

  try {
    const result = await db.query(
      `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, titulacao, area, tempo_docencia, email]
    );
    return res.status(201).json({
      message: 'Professor cadastrado com sucesso!',
      professor: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.list = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM professores ORDER BY nome');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM professores WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, titulacao, area, tempo_docencia, email } = req.body;

  try {
    const result = await db.query(
      `UPDATE professores SET nome=$1, titulacao=$2, area=$3, tempo_docencia=$4, email=$5 
       WHERE id=$6 RETURNING *`,
      [nome, titulacao, area, tempo_docencia, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    return res.json({ message: 'Professor atualizado!', professor: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM professores WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    return res.json({ message: 'Professor removido com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};