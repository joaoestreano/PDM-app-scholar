const bcrypt = require('bcrypt');
const db = require('../models/db');

// Criar usuário (admin)
exports.create = async (req, res) => {
    const { login, senha, nome, perfil } = req.body;

    if (!login || !senha || !nome) {
        return res.status(400).json({ error: 'Login, senha e nome são obrigatórios' });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const result = await db.query(
            'INSERT INTO usuarios (login, senha, nome, perfil) VALUES ($1, $2, $3, $4) RETURNING id, login, nome, perfil',
            [login, senhaHash, nome, perfil || 'aluno']
        );
        return res.status(201).json({
            message: 'Usuário criado com sucesso!',
            usuario: result.rows[0]
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Login já existe' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
};

// Listar usuários (admin)
exports.list = async (req, res) => {
    try {
        const result = await db.query('SELECT id, login, nome, perfil, created_at FROM usuarios ORDER BY nome');
        return res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
};

// Alterar própria senha
exports.alterarSenha = async (req, res) => {
    const { senhaAtual, novaSenha } = req.body;
    const userId = req.user.id;

    if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    if (novaSenha.length < 6) {
        return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });
    }

    try {
        const userResult = await db.query('SELECT * FROM usuarios WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const usuario = userResult.rows[0];
        const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha atual incorreta' });
        }

        const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
        await db.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [novaSenhaHash, userId]);

        return res.json({ message: 'Senha alterada com sucesso!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
};

// Admin resetar senha de usuário
exports.resetarSenha = async (req, res) => {
    const { userId, novaSenha } = req.body;

    if (!userId || !novaSenha) {
        return res.status(400).json({ error: 'userId e novaSenha são obrigatórios' });
    }

    if (novaSenha.length < 6) {
        return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });
    }

    try {
        const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
        const result = await db.query(
            'UPDATE usuarios SET senha = $1 WHERE id = $2 RETURNING id, login, nome',
            [novaSenhaHash, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json({ message: 'Senha resetada com sucesso!', usuario: result.rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
};

// Deletar usuário (admin)
exports.delete = async (req, res) => {
    const { id } = req.params;
    const userIdLogado = req.user.id;

    console.log('🗑️ Tentando excluir usuário ID:', id);
    console.log('👤 Usuário logado ID:', userIdLogado);

    // Impede que o admin exclua a si mesmo
    if (parseInt(id) === userIdLogado) {
        return res.status(400).json({ error: 'Você não pode excluir sua própria conta!' });
    }

    try {
        // Verifica se o usuário existe
        const check = await db.query('SELECT id, login, nome, perfil FROM usuarios WHERE id = $1', [id]);

        if (check.rows.length === 0) {
            console.log('❌ Usuário não encontrado');
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const usuario = check.rows[0];
        console.log('📋 Usuário a ser excluído:', usuario);

        // Impede excluir o último admin
        if (usuario.perfil === 'admin') {
            const totalAdmins = await db.query("SELECT COUNT(*) FROM usuarios WHERE perfil = 'admin'");
            if (parseInt(totalAdmins.rows[0].count) <= 1) {
                return res.status(400).json({ error: 'Não é possível excluir o último administrador do sistema!' });
            }
        }

        // Executa o delete
        const result = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING id, login, nome', [id]);

        console.log('✅ Usuário excluído:', result.rows[0]);

        return res.json({
            message: 'Usuário excluído com sucesso!',
            usuario: result.rows[0]
        });
    } catch (err) {
        console.error('❌ Erro ao excluir:', err.message);
        console.error('Detalhes:', err);

        // Se for erro de chave estrangeira
        if (err.code === '23503') {
            return res.status(400).json({
                error: 'Não é possível excluir este usuário pois ele possui registros vinculados (alunos, notas, etc).'
            });
        }

        return res.status(500).json({ error: 'Erro no servidor: ' + err.message });
    }
};

// Admin: atualizar usuário
exports.update = async (req, res) => {
    const { id } = req.params;
    const { login, nome, perfil, senha } = req.body;

    if (!login || !nome || !perfil) {
        return res.status(400).json({ error: 'Login, nome e perfil são obrigatórios' });
    }

    try {
        let query, params;

        if (senha && senha.trim() !== '') {
            // Atualiza com nova senha
            const bcrypt = require('bcrypt');
            const senhaHash = await bcrypt.hash(senha, 10);
            query = 'UPDATE usuarios SET login=$1, nome=$2, perfil=$3, senha=$4 WHERE id=$5 RETURNING id, login, nome, perfil';
            params = [login, nome, perfil, senhaHash, id];
        } else {
            // Atualiza sem mudar senha
            query = 'UPDATE usuarios SET login=$1, nome=$2, perfil=$3 WHERE id=$4 RETURNING id, login, nome, perfil';
            params = [login, nome, perfil, id];
        }

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json({
            message: 'Usuário atualizado com sucesso!',
            usuario: result.rows[0]
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Login já existe' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT id, login, nome, perfil, created_at FROM usuarios WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};