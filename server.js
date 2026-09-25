const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Mony Backend OK" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/recharge-test", (req, res) => {
  const { phone, operator, amount, offer } = req.body;

  if (!phone || !operator || !amount || !offer) {
    return res.status(400).json({
      status: "error",
      message: "Missing recharge data"
    });
  }

  res.json({
    status: "test_ok",
    message: "Test received successfully",
    phone: phone,
    operator: operator,
    amount: amount,
    offer: offer
  });
});

const port = process.env.PORT || 10000;

app.listen(port, "0.0.0.0", () => {
  console.log("Mony Backend running");
});
