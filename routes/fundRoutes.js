const express = require("express");
const {createFund, getAllFunds, updateNAV,} = require("../controller/fundController.js");
const { verifyInvestor } = require("../utils/authManager.js");

const router = express.Router();

router.post("/createFund",verifyInvestor, createFund);
router.get("/getFunds",verifyInvestor, getAllFunds);
router.put("/:fundId/nav",verifyInvestor, updateNAV);

module.exports = router;