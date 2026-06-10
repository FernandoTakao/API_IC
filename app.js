const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const experimentosRoutes = require("./routes/experimentosRoutes");
const chartRoutes = require("./routes/chartRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.use("/api/users", userRoutes);
app.use("/api/charts", chartRoutes);
app.use("/api/experimentos", experimentosRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;