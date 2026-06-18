const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const experimentoController = require("../controllers/experimentoController");

router.post("/", auth, experimentoController.createExperimento);
router.post("/chaves",auth, experimentoController.generateExperimentKey);
router.get("/meus-experimentos", auth, experimentoController.getMyExperimentos);
router.get("/:key/colunas", auth, experimentoController.getExperimentoColunas);
router.get("/:key", auth, experimentoController.getExperimentoByKey);
router.patch("/:key", auth, experimentoController.updateExperimento);
router.delete("/:key", auth, experimentoController.deleteExperimento);

module.exports = router;