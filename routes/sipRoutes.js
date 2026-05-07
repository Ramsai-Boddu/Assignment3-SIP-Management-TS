const express = require('express');

const { createSip,getSipById,processSip,getSipTransactions } = require('../controller/sipController');
const { verifyInvestor } = require('../utils/authManager');

const router = express.Router();

router.post('/createSip',verifyInvestor, createSip);
router.get('/:sipId',verifyInvestor, getSipById);
router.post('/:sipId/process',verifyInvestor, processSip);
router.get('/:sipId/transactions',verifyInvestor, getSipTransactions);

module.exports = router;