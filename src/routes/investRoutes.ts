import express from "express";

import {
    login,
    getInvestorDetails,
    getInvestorHoldings,
    getInvestorNetWorth,
    createInvestor,
    logout,
    getBankDetails,
    getNomineeDetails
} from "../controller/investController";

import {
    verifyInvestor
} from "../utils/authManager";

const router = express.Router();

router.post(
    "/login",
    login
);

router.post(
    "/logout",
    logout
);

router.post(
    "/addInvestor",
    verifyInvestor,
    createInvestor
);

router.get(
    "/:id",
    verifyInvestor,
    getInvestorDetails
);

router.get(
    "/:id/holdings",
    verifyInvestor,
    getInvestorHoldings
);

router.get(
    "/:id/networth",
    verifyInvestor,
    getInvestorNetWorth
);

router.get(
    "/:id/bankdetails",
    verifyInvestor,
    getBankDetails
);

router.get(
    "/:id/nominee",
    verifyInvestor,
    getNomineeDetails
);

export default router;