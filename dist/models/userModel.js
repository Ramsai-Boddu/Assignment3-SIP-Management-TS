"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNomineeDetails = exports.fetchBankDetails = exports.logoutUser = exports.invalidTokens = exports.addInvestor = exports.getNetWorth = exports.getHoldings = exports.getUser = exports.findUser = void 0;
const pgManager_1 = __importDefault(require("../utils/pgManager"));
const invalidTokens = [];
exports.invalidTokens = invalidTokens;
const findUser = async (email) => {
    const query = `
        SELECT *
        FROM user_login
        WHERE email = $1
    `;
    const result = await pgManager_1.default.query(query, [email]);
    return result.rows[0];
};
exports.findUser = findUser;
const logoutUser = async (email, token) => {
    const user = await findUser(email);
    if (!user) {
        return false;
    }
    invalidTokens.push(token);
    return true;
};
exports.logoutUser = logoutUser;
const getUser = async (id) => {
    const query = `
        SELECT *
        FROM investor
        WHERE investor_id = $1
    `;
    const result = await pgManager_1.default.query(query, [id]);
    return result.rows[0];
};
exports.getUser = getUser;
const getHoldings = async (id) => {
    const query = `
        SELECT 
            i.first_name,
            i.investor_id,
            p.portfolio_id,

            a.id AS sip_id,
            a.amount,
            a.purchase_date,
            a.unit_value,
            a.status,

            m.id AS fund_id,
            m.name AS fund_name,
            m.amc_name,
            m.current_nav

        FROM investor AS i

        LEFT JOIN portfolio AS p
            ON i.investor_id = p.investor_id

        LEFT JOIN sip AS a
            ON p.portfolio_id = a.portfolio_id

        LEFT JOIN mf_details AS m
            ON a.mutual_id = m.id

        WHERE i.investor_id = $1
    `;
    const result = await pgManager_1.default.query(query, [id]);
    return result.rows;
};
exports.getHoldings = getHoldings;
const getNetWorth = async (id) => {
    const query = `
        SELECT 
            i.investor_id,
            i.first_name,
            SUM(
                th.units * mf.current_nav
            ) AS net_worth

        FROM investor i

        JOIN portfolio p
            ON i.investor_id = p.investor_id

        JOIN transaction_history th
            ON p.portfolio_id = th.portfolio_id

        JOIN mf_details mf
            ON th.mutual_id = mf.id

        WHERE i.investor_id = $1

        GROUP BY i.investor_id, i.first_name
    `;
    const result = await pgManager_1.default.query(query, [id]);
    return result.rows[0];
};
exports.getNetWorth = getNetWorth;
const addInvestor = async (data) => {
    try {
        await pgManager_1.default.query("BEGIN");
        const investorQuery = `
            INSERT INTO investor(
                investor_id,
                first_name,
                last_name,
                middle_name,
                pan,
                aadhar,
                data_of_birth,
                gender,
                occupation
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        await pgManager_1.default.query(investorQuery, [
            data.investor_id,
            data.first_name,
            data.last_name,
            data.middle_name,
            data.pan,
            data.aadhar,
            data.data_of_birth,
            data.gender,
            data.occupation
        ]);
        const portfolioQuery = `
            INSERT INTO portfolio(
                portfolio_id,
                investor_id
            )
            VALUES ($1, $2)
        `;
        await pgManager_1.default.query(portfolioQuery, [
            data.portfolio_id,
            data.investor_id
        ]);
        const loginQuery = `
            INSERT INTO user_login(
                investor_id,
                email,
                password,
                role
            )
            VALUES ($1, $2, $3, $4)
        `;
        await pgManager_1.default.query(loginQuery, [
            data.investor_id,
            data.email,
            data.password,
            data.role
        ]);
        await pgManager_1.default.query("COMMIT");
        return data;
    }
    catch (err) {
        await pgManager_1.default.query("ROLLBACK");
        throw err;
    }
};
exports.addInvestor = addInvestor;
const fetchBankDetails = async (id) => {
    const query = `
        SELECT
            bd.account_no,
            bd.account_type,
            b.bank_name,
            b.branch,
            b.ifsc,
            b.address

        FROM bank_details bd

        JOIN bank b
            ON bd.bank_id = b.bank_id

        WHERE bd.investor_id = $1
    `;
    const result = await pgManager_1.default.query(query, [id]);
    return result.rows;
};
exports.fetchBankDetails = fetchBankDetails;
const fetchNomineeDetails = async (id) => {
    const query = `
        SELECT
            first_name,
            middle_name,
            last_name,
            relationship,
            contact,
            date_of_birth

        FROM nominee

        WHERE investor_id = $1
    `;
    const result = await pgManager_1.default.query(query, [id]);
    return result.rows;
};
exports.fetchNomineeDetails = fetchNomineeDetails;
