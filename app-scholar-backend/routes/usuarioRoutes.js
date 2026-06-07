const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas específicas (SEM parâmetros) - DEVEM VIR PRIMEIRO
router.post('/alterar-senha', authMiddleware, usuarioController.alterarSenha);
router.post('/resetar-senha', authMiddleware, usuarioController.resetarSenha);

// Rotas com parâmetros - DEVEM VIR DEPOIS
router.get('/', authMiddleware, usuarioController.list);
router.post('/', authMiddleware, usuarioController.create);
router.get('/:id', authMiddleware, usuarioController.getById);
router.put('/:id', authMiddleware, usuarioController.update);
router.delete('/:id', authMiddleware, usuarioController.delete);

module.exports = router;