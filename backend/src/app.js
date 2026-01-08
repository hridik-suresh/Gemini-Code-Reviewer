const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai.routes");

const app = express();

app.use(
  cors({
    origin: "https://gemini-code-reviewer-two.vercel.app",
  })
);

app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/ai", aiRoutes);

module.exports = app;
