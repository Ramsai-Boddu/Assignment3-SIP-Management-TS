"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSipTransactions = exports.executeSip = exports.fetchSipById = exports.addSip = void 0;
const pgManager_1 = __importDefault(require("../utils/pgManager"));
const addSip = async (data) => {
    const query = `
        INSERT INTO sip (
            id,
            amount,
            purchase_date,
            unit_value,
            portfolio_id,
            mutual_id,
            status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const values = [
        data.id,
        data.amount,
        data.purchase_date,
        data.unit_value,
        data.portfolio_id,
        data.mutual_id,
        data.status
    ];
    const result = await pgManager_1.default.query(query, values);
    return result.rows[0];
};
exports.addSip = addSip;
const fetchSipById = async (id) => {
    const query = `
        SELECT *
        FROM sip
        WHERE id = $1
    `;
    const result = await pgManager_1.default.query(query, [id]);
    return result.rows[0];
};
exports.fetchSipById = fetchSipById;
const executeSip = async (sipId) => {
    try {
        await pgManager_1.default.query("BEGIN");
        const sipQuery = `
            SELECT 
                s.*,
                mf.current_nav
            FROM sip s

            JOIN mf_details mf
                ON s.mutual_id = mf.id

            WHERE s.id = $1
        `;
        const sipResult = await pgManager_1.default.query(sipQuery, [sipId]);
        const sip = sipResult.rows[0];
        if (!sip) {
            throw new Error("SIP Not Found");
        }
        const units = sip.amount / sip.current_nav;
        const transactionId = Math.floor(10000000 + Math.random() * 90000000);
        console.log(transactionId);
        const transactionQuery = `
            INSERT INTO transaction_history(
                transaction_id,
                portfolio_id,
                mutual_id,
                sip_id,
                transaction_type,
                amount,
                nav,
                units,
                transaction_date
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE)
        `;
        await pgManager_1.default.query(transactionQuery, [
            transactionId,
            sip.portfolio_id,
            sip.mutual_id,
            sip.id,
            "BUY",
            sip.amount,
            sip.current_nav,
            units
        ]);
        await pgManager_1.default.query("COMMIT");
        return {
            sip_id: sip.id,
            amount: sip.amount,
            nav: sip.current_nav,
            units: units
        };
    }
    catch (err) {
        await pgManager_1.default.query("ROLLBACK");
        throw err;
    }
};
exports.executeSip = executeSip;
const fetchSipTransactions = async (sipId) => {
    const query = `
        SELECT *
        FROM transaction_history
        WHERE sip_id = $1
    `;
    const result = await pgManager_1.default.query(query, [sipId]);
    return result.rows;
};
exports.fetchSipTransactions = fetchSipTransactions;
