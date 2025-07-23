const express = require("express");
const router = express.Router();
const {
  handleEsewaSuccess,
  handleEsewaFailure,
  createOrder,
} = require("../controller/esewaController");

router.get("/success", handleEsewaSuccess);
router.post("/create", createOrder);
router.get("/failure", handleEsewaFailure);

module.exports = router;
