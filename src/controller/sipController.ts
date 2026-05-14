import { Request, Response } from "express";

import client from "../utils/pgManager";

import {
    addSip,
    fetchSipById,
    executeSip,
    fetchSipTransactions
} from "../models/sipModel";

interface AuthRequest extends Request {
    user?: {
        investor_id?: string;
    };
}

interface CreateSipBody {
    mutual_id: number;
    amount: number;
}

const createSip = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {

    try {

        const investorId = req.user?.investor_id;

        const {
            mutual_id,
            amount
        }: CreateSipBody = req.body;

        const portfolioQuery = `
            SELECT portfolio_id
            FROM portfolio
            WHERE investor_id = $1
        `;

        const portfolioResult = await client.query(
            portfolioQuery,
            [investorId]
        );

        if (portfolioResult.rows.length === 0) {

            return res.status(404).json({
                error: "Portfolio not found"
            });

        }

        const portfolio_id =
            portfolioResult.rows[0].portfolio_id;

        const navQuery = `
            SELECT current_nav
            FROM mf_details
            WHERE id = $1
        `;

        const navResult = await client.query(
            navQuery,
            [mutual_id]
        );

        if (navResult.rows.length === 0) {

            return res.status(404).json({
                error: "Fund not found"
            });

        }

        const sipId = Math.floor(
            1000000 + Math.random() * 900000
        );

        const unit_value =
            navResult.rows[0].current_nav;

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

        const result = await addSip(data);

        return res.status(201).json({
            message: "SIP Created Successfully",
            sip: result
        });

    } catch (err: any) {

        console.log("CREATE SIP ERROR:", err);

        return res.status(500).json({
            error: err.message
        });

    }
};

const getSipById = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const sipId: number =
            Number(req.params.sipId);

        const sip = await fetchSipById(sipId);

        if (!sip) {

            return res.status(404).json({
                error: "SIP Not Found"
            });

        }

        return res.status(200).json({
            message: "SIP Found",
            sip
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

const processSip = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const sipId: number =
            Number(req.params.sipId);

        const result = await executeSip(sipId);

        return res.status(200).json({
            message: "SIP Processed Successfully",
            transaction: result
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

const getSipTransactions = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const sipId: number =
            Number(req.params.sipId);

        const transactions =
            await fetchSipTransactions(sipId);

        if (transactions.length === 0) {

            return res.status(404).json({
                error: "No Transactions Found"
            });

        }

        return res.status(200).json({
            message: "Transactions Found",
            transactions
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

const getTransactions = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const investorId = req.params.investorId as string;

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

        const result = await client.query(
            query,
            [investorId]
        );

        return res.status(200).json({
            transactions: result.rows
        });

    } catch (error: any) {

        console.log(error);

        return res.status(500).json({
            error: error.message
        });

    }
};

export {
    createSip,
    getSipById,
    processSip,
    getSipTransactions,
    getTransactions
};