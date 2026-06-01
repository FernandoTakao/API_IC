const express = require("express");

const router = express.Router();

const { createCharts } = require("../controllers/chartController");

router.post("/", createCharts);

module.exports = router;
