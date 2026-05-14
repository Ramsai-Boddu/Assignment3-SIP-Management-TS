"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFundsForInvestor = exports.updateNAV = exports.getAllFunds = exports.createFund = void 0;
const pgManager_1 = __importDefault(require("../utils/pgManager"));
const createFund = async (data) => {
    const query = `
        INSERT INTO mf_details(
            id,
            name,
            amc_name,
            current_nav
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [
        data.id,
        data.name,
        data.amc_name,
        data.current_nav
    ];
    const result = await pgManager_1.default.query(query, values);
    return result.rows[0];
};
exports.createFund = createFund;
const getAllFunds = async () => {
    const query = `
        SELECT * FROM mf_details
    `;
    const result = await pgManager_1.default.query(query);
    return result.rows;
};
exports.getAllFunds = getAllFunds;
const getFundsForInvestor = async (investorId) => {
    const query = `
    
        SELECT 
            mf.id AS mutual_id,
            mf.name,
            mf.amc_name,
            mf.current_nav,

            sip.id AS sip_id,
            sip.amount,
            sip.purchase_date,
            sip.status

        FROM mf_details mf

        LEFT JOIN sip
            ON mf.id = sip.mutual_id

        LEFT JOIN portfolio p
            ON sip.portfolio_id = p.portfolio_id

        AND p.investor_id = $1
    `;
    const result = await pgManager_1.default.query(query, [investorId]);
    return result.rows;
};
exports.getFundsForInvestor = getFundsForInvestor;
const updateNAV = async (fundId, current_nav) => {
    const query = `
        UPDATE mf_details
        SET current_nav = $1
        WHERE id = $2
        RETURNING *;
    `;
    const result = await pgManager_1.default.query(query, [
        current_nav,
        fundId
    ]);
    return result.rows[0];
};
exports.updateNAV = updateNAV;
