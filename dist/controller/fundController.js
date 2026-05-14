"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFundsForInvestor = exports.updateNAV = exports.getAllFunds = exports.createFund = exports.createSip = void 0;
const fundModel = __importStar(require("../models/fundModel"));
const pgManager_1 = __importDefault(require("../utils/pgManager"));
const sipModel_1 = require("../models/sipModel");
const createSip = async (req, res) => {
    try {
        const investorId = req.user?.investor_id;
        const { mutual_id, amount } = req.body;
        const portfolioQuery = `
            SELECT portfolio_id
            FROM portfolio
            WHERE investor_id = $1
        `;
        const portfolioResult = await pgManager_1.default.query(portfolioQuery, [investorId]);
        if (portfolioResult.rows.length === 0) {
            return res.status(404).json({
                error: "Portfolio not found"
            });
        }
        const portfolio_id = portfolioResult.rows[0].portfolio_id;
        const navQuery = `
            SELECT current_nav
            FROM mf_details
            WHERE id = $1
        `;
        const navResult = await pgManager_1.default.query(navQuery, [mutual_id]);
        if (navResult.rows.length === 0) {
            return res.status(404).json({
                error: "Fund not found"
            });
        }
        const unit_value = navResult.rows[0].current_nav;
        const data = {
            id: Date.now(),
            amount,
            purchase_date: new Date(),
            unit_value,
            portfolio_id,
            mutual_id,
            status: "ACTIVE"
        };
        console.log(data);
        // INSERT SIP
        const result = await (0, sipModel_1.addSip)(data);
        return res.status(201).json({
            message: "SIP Created Successfully",
            sip: result
        });
    }
    catch (err) {
        console.log("CREATE SIP ERROR:", err);
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.createSip = createSip;
const createFund = async (req, res) => {
    try {
        const { id, name, amc_name, current_nav } = req.body;
        const data = {
            id,
            name,
            amc_name,
            current_nav,
        };
        const result = await fundModel.createFund(data);
        return res.status(201).json({
            message: "Fund Created Successfully",
            data: result
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};
exports.createFund = createFund;
const getFundsForInvestor = async (req, res) => {
    try {
        const investorId = String(req.user?.id);
        const rows = await fundModel.getFundsForInvestor(investorId);
        return res.status(200).json(rows);
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.getFundsForInvestor = getFundsForInvestor;
const getAllFunds = async (req, res) => {
    try {
        const rows = await fundModel.getAllFunds();
        return res.status(200).json(rows);
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};
exports.getAllFunds = getAllFunds;
const updateNAV = async (req, res) => {
    try {
        const fundId = Number(req.params.fundId);
        const { current_nav } = req.body;
        const result = await fundModel.updateNAV(fundId, current_nav);
        if (!result) {
            return res.status(404).json({
                message: "Fund Not Found",
            });
        }
        return res.status(200).json({
            message: "NAV Updated Successfully",
            data: result
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};
exports.updateNAV = updateNAV;
