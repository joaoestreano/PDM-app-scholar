const db = require('../models/db');

// Buscar boletim por matrícula (admin/coordenador)
exports.getBoletim = async (req, res) => {
  const { matricula } = req.params;

  try {
    const alunoResult = await db.query('SELECT * FROM alunos WHERE matricula = $1', [matricula]);
    
    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const aluno = alunoResult.rows[0];

    const notasResult = await db.query(`
      SELECT 
        d.nome as disciplina,
        n.nota1,
        n.nota2,
        n.media,
        n.situacao
      FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id
      WHERE n.aluno_id = $1
      ORDER BY d.nome
    `, [aluno.id]);

    return res.json({
      aluno: aluno.nome,
      matricula: aluno.matricula,
      curso: aluno.curso,
      disciplinas: notasResult.rows
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Criar nota (admin)
exports.createNota = async (req, res) => {
  const { aluno_id, disciplina_id, nota1, nota2 } = req.body;

  if (!aluno_id || !disciplina_id || nota1 === undefined || nota2 === undefined) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const media = (parseFloat(nota1) + parseFloat(nota2)) / 2;
  let situacao = 'Reprovado';
  if (media >= 7) situacao = 'Aprovado';
  else if (media >= 5) situacao = 'Recuperação';

  try {
    const result = await db.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [aluno_id, disciplina_id, nota1, nota2, media, situacao]
    );
    return res.status(201).json({
      message: 'Nota cadastrada com sucesso!',
      nota: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Buscar boletim do próprio aluno logado
exports.getMeuBoletim = async (req, res) => {
  const userId = req.user.id;

  try {
    const alunoResult = await db.query(
      'SELECT * FROM alunos WHERE email = (SELECT login FROM usuarios WHERE id = $1)',
      [userId]
    );

    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado para este usuário' });
    }

    const aluno = alunoResult.rows[0];

    const disciplinasResult = await db.query(`
      SELECT 
        d.id as disciplina_id,
        d.nome as disciplina,
        d.semestre,
        n.nota1,
        n.nota2,
        n.media,
        n.situacao
      FROM disciplinas d
      LEFT JOIN notas n ON d.id = n.disciplina_id AND n.aluno_id = $1
      WHERE d.curso = $2
      ORDER BY d.semestre DESC, d.nome
    `, [aluno.id, aluno.curso]);

    return res.json({
      aluno: aluno.nome,
      matricula: aluno.matricula,
      curso: aluno.curso,
      disciplinas: disciplinasResult.rows
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Buscar disciplinas do professor logado
exports.getMinhasDisciplinas = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(`
      SELECT d.*, p.nome as professor_nome 
      FROM disciplinas d 
      JOIN professores p ON d.professor_id = p.id 
      WHERE p.email = (SELECT login FROM usuarios WHERE id = $1)
      ORDER BY d.nome
    `, [userId]);

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Buscar alunos de uma disciplina específica (professor)
exports.getAlunosDaDisciplina = async (req, res) => {
  const { disciplinaId } = req.params;
  const userId = req.user.id;

  try {
    const checkProf = await db.query(`
      SELECT d.id FROM disciplinas d 
      JOIN professores p ON d.professor_id = p.id 
      WHERE d.id = $1 AND p.email = (SELECT login FROM usuarios WHERE id = $2)
    `, [disciplinaId, userId]);

    if (checkProf.rows.length === 0) {
      return res.status(403).json({ error: 'Você não tem acesso a esta disciplina' });
    }

    const result = await db.query(`
      SELECT 
        a.id as aluno_id,
        a.nome,
        a.matricula,
        n.nota1,
        n.nota2,
        n.media,
        n.situacao,
        n.id as nota_id
      FROM alunos a
      LEFT JOIN notas n ON a.id = n.aluno_id AND n.disciplina_id = $1
      ORDER BY a.nome
    `, [disciplinaId]);

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Lançar/atualizar nota do aluno (professor)
exports.lancarNota = async (req, res) => {
  const { aluno_id, disciplina_id, nota1, nota2 } = req.body;
  const userId = req.user.id;

  if (!aluno_id || !disciplina_id || nota1 === undefined || nota2 === undefined) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const checkProf = await db.query(`
      SELECT d.id FROM disciplinas d 
      JOIN professores p ON d.professor_id = p.id 
      WHERE d.id = $1 AND p.email = (SELECT login FROM usuarios WHERE id = $2)
    `, [disciplina_id, userId]);

    if (checkProf.rows.length === 0) {
      return res.status(403).json({ error: 'Você não tem acesso a esta disciplina' });
    }

    const media = (parseFloat(nota1) + parseFloat(nota2)) / 2;
    let situacao = 'Reprovado';
    if (media >= 7) situacao = 'Aprovado';
    else if (media >= 5) situacao = 'Recuperação';

    const existingNota = await db.query(
      'SELECT id FROM notas WHERE aluno_id = $1 AND disciplina_id = $2',
      [aluno_id, disciplina_id]
    );

    let result;
    if (existingNota.rows.length > 0) {
      result = await db.query(`
        UPDATE notas SET nota1=$1, nota2=$2, media=$3, situacao=$4 
        WHERE aluno_id=$5 AND disciplina_id=$6 RETURNING *
      `, [nota1, nota2, media, situacao, aluno_id, disciplina_id]);
    } else {
      result = await db.query(`
        INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `, [aluno_id, disciplina_id, nota1, nota2, media, situacao]);
    }

    return res.json({
      message: 'Nota lançada com sucesso!',
      nota: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};