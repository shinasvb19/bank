const express = require("express");
const {
  createAccount,
  updateAccount,
  depositeMoney,
  withdrawMoney,
  transferMoney,
  printStatement,
} = require("../controllers/bankController");
const router = express.Router();
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.patch("/:id", depositeMoney);
router.get("/statement/:id", printStatement);
router.patch("/withdraw/:id", withdrawMoney);
router.patch("/:senderId/:recieverId", transferMoney);

module.exports = router;
