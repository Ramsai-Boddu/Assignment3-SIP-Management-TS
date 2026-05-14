import { Request, Response } from "express";

import {
    findUser,
    getUser,
    getHoldings,
    getNetWorth,
    addInvestor,
    logoutUser,
    fetchNomineeDetails,
    fetchBankDetails
} from "../models/userModel";

import { signJwt } from "../utils/authManager";

interface LoginBody {
    email: string;
    password: string;
}

const login = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const {
            email,
            password
        }: LoginBody = req.body;

        const user = await findUser(email);

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

        const token = signJwt({
            email: user.email,
            role: user.role,
            investor_id: user.investor_id,
        });

        return res.status(200).json({
            message: "Login Success",
            investor_id: user.investor_id,
            token
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

const logout = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const token =
            req.headers.authorization;

        const { email } = req.body;

        if (!email || !token) {

            return res.status(400).json({
                message: "Email and Token are required"
            });

        }

        const result = await logoutUser(
            email,
            token
        );

        if (!result) {

            return res.status(400).json({
                message: "Logout Failed"
            });

        }

        return res.status(200).json({
            message: "Logout Successful"
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

const createInvestor = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const data = req.body;

        const result =
            await addInvestor(data);

        return res.status(201).json({
            message: "Investor Created",
            data: result
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

const getInvestorDetails = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const id =
            req.params.id as string;

        const user = await getUser(id);

        if (!user) {

            return res.status(404).json({
                message: "Investor Not Found"
            });

        }

        return res.status(200).json({
            message: "Investor Found",
            data: user
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

const getInvestorHoldings = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const id =
            req.params.id as string;

        const holdings =
            await getHoldings(id);

        if (!holdings || holdings.length === 0) {

            return res.status(404).json({
                message: "No Holdings"
            });

        }

        return res.status(200).json({
            message: "Holdings Found",
            holdings
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

const getInvestorNetWorth = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const id =
            req.params.id as string;

        const netWorth =
            await getNetWorth(id);

        if (!netWorth) {

            return res.status(404).json({
                message: "No Net Worth"
            });

        }

        return res.status(200).json({
            message: "Net Worth Calculated",
            netWorth
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

const getBankDetails = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const id =
            req.params.id as string;

        const details =
            await fetchBankDetails(id);

        if (!details || details.length === 0) {

            return res.status(404).json({
                message: "No Bank Details Found"
            });

        }

        return res.status(200).json({
            message: "Bank Details Found",
            data: details
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

const getNomineeDetails = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        const id =
            req.params.id as string;

        const nominee =
            await fetchNomineeDetails(id);

        if (!nominee || nominee.length === 0) {

            return res.status(404).json({
                message: "No Nominee Found"
            });

        }

        return res.status(200).json({
            message: "Nominee Found",
            data: nominee
        });

    } catch (err: any) {

        return res.status(500).json({
            error: err.message
        });

    }
};

export {
    login,
    logout,
    createInvestor,
    getInvestorDetails,
    getInvestorHoldings,
    getInvestorNetWorth,
    getBankDetails,
    getNomineeDetails
};