const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const experimentoController = require("../controllers/experimentoController");

router.post("/", auth, experimentoController.createExperimento);
router.get("/meus-experimentos", auth, experimentoController.getMyExperimentos);
router.get("/:id/colunas", experimentoController.getExperimentoColunas);
router.get("/:id", experimentoController.getExperimentoById);
router.patch("/:id", experimentoController.updateExperimento);
router.delete("/:id", experimentoController.deleteExperimento);

module.exports = router;