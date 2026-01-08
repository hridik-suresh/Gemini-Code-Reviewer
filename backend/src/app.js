const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai.routes");

const app = express();

app.use(cors());

app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/ai", aiRoutes);

module.exports = app;
