"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNomineeDetails = exports.getBankDetails = exports.getInvestorNetWorth = exports.getInvestorHoldings = exports.getInvestorDetails = exports.createInvestor = exports.logout = exports.login = void 0;
const userModel_1 = require("../models/userModel");
const authManager_1 = require("../utils/authManager");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, userModel_1.findUser)(email);
        if (!user) {
            return res.status(404).json({
                message: "Investor Not Found"
            });
        }
        if (password !== user.password) {
            return res.status(401).json({
                error: "Invalid Password"
            });
        }
        const token = (0, authManager_1.signJwt)({
            email: user.email,
            role: user.role,
            investor_id: user.investor_id,
        });
        return res.status(200).json({
            message: "Login Success",
            investor_id: user.investor_id,
            token
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const { email } = req.body;
        if (!email || !token) {
            return res.status(400).json({
                message: "Email and Token are required"
            });
        }
        const result = await (0, userModel_1.logoutUser)(email, token);
        if (!result) {
            return res.status(400).json({
                message: "Logout Failed"
            });
        }
        return res.status(200).json({
            message: "Logout Successful"
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.logout = logout;
const createInvestor = async (req, res) => {
    try {
        const data = req.body;
        const result = await (0, userModel_1.addInvestor)(data);
        return res.status(201).json({
            message: "Investor Created",
            data: result
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.createInvestor = createInvestor;
const getInvestorDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await (0, userModel_1.getUser)(id);
        if (!user) {
            return res.status(404).json({
                message: "Investor Not Found"
            });
        }
        return res.status(200).json({
            message: "Investor Found",
            data: user
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.getInvestorDetails = getInvestorDetails;
const getInvestorHoldings = async (req, res) => {
    try {
        const id = req.params.id;
        const holdings = await (0, userModel_1.getHoldings)(id);
        if (!holdings || holdings.length === 0) {
            return res.status(404).json({
                message: "No Holdings"
            });
        }
        return res.status(200).json({
            message: "Holdings Found",
            holdings
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.getInvestorHoldings = getInvestorHoldings;
const getInvestorNetWorth = async (req, res) => {
    try {
        const id = req.params.id;
        const netWorth = await (0, userModel_1.getNetWorth)(id);
        if (!netWorth) {
            return res.status(404).json({
                message: "No Net Worth"
            });
        }
        return res.status(200).json({
            message: "Net Worth Calculated",
            netWorth
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.getInvestorNetWorth = getInvestorNetWorth;
const getBankDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const details = await (0, userModel_1.fetchBankDetails)(id);
        if (!details || details.length === 0) {
            return res.status(404).json({
                message: "No Bank Details Found"
            });
        }
        return res.status(200).json({
            message: "Bank Details Found",
            data: details
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.getBankDetails = getBankDetails;
const getNomineeDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const nominee = await (0, userModel_1.fetchNomineeDetails)(id);
        if (!nominee || nominee.length === 0) {
            return res.status(404).json({
                message: "No Nominee Found"
            });
        }
        return res.status(200).json({
            message: "Nominee Found",
            data: nominee
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
exports.getNomineeDetails = getNomineeDetails;
