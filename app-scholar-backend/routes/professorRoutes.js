const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, professorController.create);
router.get('/', authMiddleware, professorController.list);
router.get('/:id', authMiddleware, professorController.getById);
router.put('/:id', authMiddleware, professorController.update);
router.delete('/:id', authMiddleware, professorController.delete);

module.exports = router;