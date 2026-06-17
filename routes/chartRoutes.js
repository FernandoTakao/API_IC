const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

const { createCharts, downloadCsv } = require("../controllers/chartController");

router.post("/", createCharts);

router.get("/download/:file", auth, downloadCsv);

module.exports = router;
