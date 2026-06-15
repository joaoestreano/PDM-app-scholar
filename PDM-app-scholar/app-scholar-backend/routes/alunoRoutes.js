const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, alunoController.create);
router.get('/', authMiddleware, alunoController.list);
router.get('/:id', authMiddleware, alunoController.getById);
router.put('/:id', authMiddleware, alunoController.update);
router.delete('/:id', authMiddleware, alunoController.delete);

module.exports = router;