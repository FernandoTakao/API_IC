const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const experimentoController = require("../controllers/experimentoController");

router.post("/", auth, experimentoController.createExperimento);
router.post("/chaves",auth, experimentoController.generateExperimentKey);
router.get("/meus-experimentos", auth, experimentoController.getMyExperimentos);
router.get("/:id/colunas", auth, experimentoController.getExperimentoColunas);
router.get("/:id", auth, experimentoController.getExperimentoByKey);
router.patch("/:id", auth, experimentoController.updateExperimento);
router.delete("/:id", auth, experimentoController.deleteExperimento);

module.exports = router;