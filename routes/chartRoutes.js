const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

const chartController = require("../controllers/chartController");

router.post("/", auth, chartController.createCharts);

router.get("/download/:file", auth, chartController.downloadCsv);

module.exports = router;
