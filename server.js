const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Mony Backend OK" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const port = process.env.PORT || 10000;

app.listen(port, "0.0.0.0", () => {
  console.log("Mony Backend running");
});
