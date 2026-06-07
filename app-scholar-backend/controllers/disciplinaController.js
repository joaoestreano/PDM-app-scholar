const db = require('../models/db');

exports.create = async (req, res) => {
  const { nome, carga_horaria, professor_id, curso, semestre } = req.body;

  if (!nome || !carga_horaria || !professor_id || !curso || !semestre) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const result = await db.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, carga_horaria, professor_id, curso, semestre]
    );
    return res.status(201).json({
      message: 'Disciplina cadastrada com sucesso!',
      disciplina: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.list = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.*, p.nome as professor_nome 
      FROM disciplinas d 
      LEFT JOIN professores p ON d.professor_id = p.id 
      ORDER BY d.nome
    `);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT d.*, p.nome as professor_nome 
      FROM disciplinas d 
      LEFT JOIN professores p ON d.professor_id = p.id 
      WHERE d.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, carga_horaria, professor_id, curso, semestre } = req.body;

  try {
    const result = await db.query(
      `UPDATE disciplinas SET nome=$1, carga_horaria=$2, professor_id=$3, curso=$4, semestre=$5 
       WHERE id=$6 RETURNING *`,
      [nome, carga_horaria, professor_id, curso, semestre, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }
    return res.json({ message: 'Disciplina atualizada!', disciplina: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM disciplinas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }
    return res.json({ message: 'Disciplina removida com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};