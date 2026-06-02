const express = require('express');
const router = express.Router();
const experimentoController = require('../controllers/experimentoController');

router.post('/', experimentoController.createExperimento);
router.get('/:id/colunas', experimentoController.getExperimentoColunas);
router.get('/:id', experimentoController.getExperimentoById);
router.patch('/:id', experimentoController.updateExperimento);
router.delete('/:id', experimentoController.deleteExperimento);

module.exports = router;