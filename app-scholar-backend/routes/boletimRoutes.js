const express = require('express');
const router = express.Router();
const boletimController = require('../controllers/boletimController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas específicas por perfil (devem vir ANTES das rotas com parâmetros)
router.get('/meu-boletim', authMiddleware, boletimController.getMeuBoletim);
router.get('/professor/disciplinas', authMiddleware, boletimController.getMinhasDisciplinas);
router.get('/professor/disciplina/:disciplinaId/alunos', authMiddleware, boletimController.getAlunosDaDisciplina);
router.post('/professor/lancar-nota', authMiddleware, boletimController.lancarNota);

// Rotas com parâmetros (devem vir POR ÚLTIMO)
router.get('/:matricula', authMiddleware, boletimController.getBoletim);
router.post('/', authMiddleware, boletimController.createNota);

module.exports = router;