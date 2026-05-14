import express from "express";

import {
    createSip,
    getSipById,
    processSip,
    getSipTransactions,
    getTransactions
} from "../controller/sipController";

import {
    verifyInvestor
} from "../utils/authManager";

const router = express.Router();

router.post(
    "/new/createSip",
    verifyInvestor,
    createSip
);

router.get(
    "/trans/:investorId/transactions",
    verifyInvestor,
    getTransactions
);

router.get(
    "/:sipId/transactions",
    verifyInvestor,
    getSipTransactions
);

router.post("/:sipId/process",verifyInvestor,processSip
);

router.get("/:sipId",verifyInvestor,getSipById
);

export default router;