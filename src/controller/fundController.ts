import { Request, Response } from "express";
import * as fundModel from "../models/fundModel";
import client from "../utils/pgManager";
import { addSip } from "../models/sipModel";

interface AuthRequest extends Request {
    user?: {
        id?: number;
        investor_id?: number;
    };
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
        } = req.body;

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

        const unit_value =
            navResult.rows[0].current_nav;

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

const createFund = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const {
            id,
            name,
            amc_name,
            current_nav
        } = req.body;

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

    } catch (err: any) {

        return res.status(500).json({
            error: err.message,
        });

    }
};

const getFundsForInvestor = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {

    try {

        const investorId  = String(req.user?.id);

        const rows = await fundModel.getFundsForInvestor(
            investorId 
        );

        return res.status(200).json(rows);

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

const getAllFunds = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const rows = await fundModel.getAllFunds();

        return res.status(200).json(rows);

    } catch (err: any) {

        return res.status(500).json({
            error: err.message,
        });

    }
};

const updateNAV = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const fundId = Number(req.params.fundId as string);

        const { current_nav } = req.body;

        const result = await fundModel.updateNAV(
            fundId,
            current_nav
        );

        if (!result) {

            return res.status(404).json({
                message: "Fund Not Found",
            });

        }

        return res.status(200).json({
            message: "NAV Updated Successfully",
            data: result
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message,
        });

    }
};

export {
    createSip,
    createFund,
    getAllFunds,
    updateNAV,
    getFundsForInvestor
};