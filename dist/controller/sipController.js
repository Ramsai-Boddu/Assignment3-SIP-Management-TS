"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.getSipTransactions = exports.processSip = exports.getSipById = exports.createSip = void 0;
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
        const sipId = Math.floor(1000000 + Math.random() * 900000);
        const unit_value = navResult.rows[0].current_nav;
        const data = {
            id: sipId,
            amount,
            purchase_date: new Date(),
            unit_value,
            portfolio_id,
            mutual_id,
            status: "ACTIVE"
        };
        console.log(data);
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
const getSipById = async (req, res) => {
    try {
        const sipId = Number(req.params.sipId);
        const sip = await (0, sipModel_1.fetchSipById)(sipId);
        if (!sip) {
            return res.status(404).json({
                error: "SIP Not Found"
            });
        }
        return res.status(200).json({
            message: "SIP Found",
            sip
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.getSipById = getSipById;
const processSip = async (req, res) => {
    try {
        const sipId = Number(req.params.sipId);
        const result = await (0, sipModel_1.executeSip)(sipId);
        return res.status(200).json({
            message: "SIP Processed Successfully",
            transaction: result
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.processSip = processSip;
const getSipTransactions = async (req, res) => {
    try {
        const sipId = Number(req.params.sipId);
        const transactions = await (0, sipModel_1.fetchSipTransactions)(sipId);
        if (transactions.length === 0) {
            return res.status(404).json({
                error: "No Transactions Found"
            });
        }
        return res.status(200).json({
            message: "Transactions Found",
            transactions
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.getSipTransactions = getSipTransactions;
const getTransactions = async (req, res) => {
    try {
        const investorId = req.params.investorId;
        const query = `
            SELECT
                th.transaction_id,
                th.sip_id,
                th.transaction_type,
                th.amount,
                th.nav,
                th.units,
                th.transaction_date,
                mf.name AS fund_name,
                s.status

            FROM transaction_history th

            JOIN sip s
                ON th.sip_id = s.id

            JOIN portfolio p
                ON s.portfolio_id = p.portfolio_id

            JOIN mf_details mf
                ON th.mutual_id = mf.id

            WHERE p.investor_id = $1

            ORDER BY th.transaction_date DESC
        `;
        const result = await pgManager_1.default.query(query, [investorId]);
        return res.status(200).json({
            transactions: result.rows
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message
        });
    }
};
exports.getTransactions = getTransactions;
