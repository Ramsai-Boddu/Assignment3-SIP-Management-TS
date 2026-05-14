"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fundController_1 = require("../controller/fundController");
const authManager_1 = require("../utils/authManager");
const fundModel_1 = require("../models/fundModel");
const router = express_1.default.Router();
router.post("/createFund", authManager_1.verifyInvestor, fundController_1.createFund);
router.get("/getFunds", authManager_1.verifyInvestor, fundController_1.getAllFunds);
router.put("/:fundId/nav", authManager_1.verifyInvestor, fundController_1.updateNAV);
router.get("/getFundsForInvestor", authManager_1.verifyInvestor, fundModel_1.getFundsForInvestor);
exports.default = router;
