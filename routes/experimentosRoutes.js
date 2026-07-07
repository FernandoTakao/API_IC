const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const experimentController = require("../controllers/experimentoController");

// Experimentos do usuário
router.get("/", auth, experimentController.getMyExperimentos);
router.get("/info", auth, experimentController.getExperimentoInfo);

// Criação
router.post("/chaves", auth, experimentController.generateExperimentKey);

// Operações sobre um experimento
router.get("/:id", auth, experimentController.getExperimentoById);
router.delete("/:id", auth, experimentController.deleteExperimento);

// Execuções
router.patch("/:id/aiMetrics", auth, experimentController.addExecucoesScript);
router.patch("/:id/performance", auth, experimentController.addExecucoesMobile);


module.exports = router;
