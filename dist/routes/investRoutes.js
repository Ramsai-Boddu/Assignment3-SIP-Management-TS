"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const investController_1 = require("../controller/investController");
const authManager_1 = require("../utils/authManager");
const router = express_1.default.Router();
router.post("/login", investController_1.login);
router.post("/logout", investController_1.logout);
router.post("/addInvestor", authManager_1.verifyInvestor, investController_1.createInvestor);
router.get("/:id", authManager_1.verifyInvestor, investController_1.getInvestorDetails);
router.get("/:id/holdings", authManager_1.verifyInvestor, investController_1.getInvestorHoldings);
router.get("/:id/networth", authManager_1.verifyInvestor, investController_1.getInvestorNetWorth);
router.get("/:id/bankdetails", authManager_1.verifyInvestor, investController_1.getBankDetails);
router.get("/:id/nominee", authManager_1.verifyInvestor, investController_1.getNomineeDetails);
exports.default = router;
