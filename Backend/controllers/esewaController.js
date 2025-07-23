const crypto = require("crypto");
const CartModel = require("../models/cartModel");

exports.handleEsewaSuccess = async (req, res) => {
  try {
    const { data } = req.query;
    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );

    if (decodedData.status !== "COMPLETE") {
      return res.status(400).json({ message: "Payment failed" });
    }

    const message = decodedData.signed_field_names
      .split(",")
      .map((field) => `${field}=${decodedData[field] || ""}`)
      .join(",");

    const signature = this.createSignature(message);

    if (signature !== decodedData.signature) {
      return res.status(400).json({ message: "Data integrity issue" });
    }

    const cart = await CartModel.findById(decodedData.transaction_uuid);
    cart.status = "inactive";
    await cart.save();

    res.redirect("http://localhost:3001/success");
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err?.message || "Error occurred" });
  }
};

exports.handleEsewaFailure = (req, res) => {
  res.redirect("http://localhost:3001/failure");
};

exports.createOrder = async (req, res) => {
  try {
    const { amount, cart_id } = req.body;

    if (!amount || !cart_id) {
      return res.status(400).json({ error: "Amount or cart ID missing" });
    }

    const signature = this.createSignature(
      `total_amount=${amount},transaction_uuid=${cart_id},product_code=EPAYTEST`
    );

    const formData = {
      txAmt: amount,
      amt: amount,
      pid: cart_id,
      scd: "EPAYTEST",
      success_url: "http://localhost:3000/api/esewa/success",
      failure_url: "http://localhost:3000/api/esewa/failure",
    };

    res.json({ formData, message: "Order created successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message || "Order creation error" });
  }
};

exports.createSignature = (message) => {
  const secret = "8gBm/:&EnhH.1/q";
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  return hmac.digest("base64");
};
