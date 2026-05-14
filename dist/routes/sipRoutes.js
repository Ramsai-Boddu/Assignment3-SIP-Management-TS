"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sipController_1 = require("../controller/sipController");
const authManager_1 = require("../utils/authManager");
const router = express_1.default.Router();
router.post("/new/createSip", authManager_1.verifyInvestor, sipController_1.createSip);
router.get("/trans/:investorId/transactions", authManager_1.verifyInvestor, sipController_1.getTransactions);
router.get("/:sipId/transactions", authManager_1.verifyInvestor, sipController_1.getSipTransactions);
router.post("/:sipId/process", authManager_1.verifyInvestor, sipController_1.processSip);
router.get("/:sipId", authManager_1.verifyInvestor, sipController_1.getSipById);
exports.default = router;
