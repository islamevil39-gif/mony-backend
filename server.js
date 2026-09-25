const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Mony Backend OK" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/recharge", async (req, res) => {
  try {
    const { phone, operator, amount, offer } = req.body;

    if (!phone || !operator || !amount || !offer) {
      return res.status(400).json({
        status: "error",
        message: "Missing recharge data"
      });
    }

    const secret = process.env.SOFIZPAY_SECRET;

    if (!secret) {
      return res.status(500).json({
        status: "error",
        message: "SofizPay secret is not configured"
      });
    }

    const response = await fetch(
      "https://sofizpay.com/services/operation_post",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          encrypted_sk: secret,
          phone: phone,
          operator: operator,
          amount: amount,
          offer: offer
        })
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Recharge request failed"
    });
  }
});

const port = process.env.PORT || 10000;

app.listen(port, "0.0.0.0", () => {
  console.log("Mony Backend running");
});
