const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const experimentoController = require("../controllers/experimentoController");

router.post("/chaves",auth, experimentoController.generateExperimentKey);
router.get("/meus-experimentos", auth, experimentoController.getMyExperimentos);
router.get("/meus-experimentos/:id", auth, experimentoController.getExperimentInfo);
router.get("/:id/colunas", auth, experimentoController.getExperimentoColunas);
router.get("/:id", auth, experimentoController.getExperimentoById);
router.patch("/:id", auth, experimentoController.updateExperimento);
router.delete("/:id", auth, experimentoController.deleteExperimento);

module.exports = router;