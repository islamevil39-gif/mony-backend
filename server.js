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

  const { phone, operator, offer } = req.body;

  if (!phone || !operator || !offer) {
    return res.status(400).json({
      status: "error",
      message: "Missing recharge data"
    });
  }

  const secret = process.env.SOFIZPAY_SECRET;

  if (!secret) {
    return res.status(500).json({
      status: "error",
      message: "SOFIZPAY_SECRET is not configured"
    });
  }

  try {
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
          operator: operator.toLowerCase(),
          amount: 50,
          offer: offer
        })
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        status: "error",
        message: text
      };
    }

    console.log("SOFIZPAY RESPONSE:", data);

    return res.status(response.status).json(data);

  } catch (error) {
    console.log("SOFIZPAY ERROR:", error);

    return res.status(500).json({
      status: "error",
      message: "SofizPay connection failed",
      detail: error.message
    });
  }
});

const port = process.env.PORT || 10000;

app.listen(port, "0.0.0.0", () => {
  console.log("Mony Backend running");
});
