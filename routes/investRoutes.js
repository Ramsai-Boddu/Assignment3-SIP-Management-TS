const express = require('express')
const { login, getInvestorDetails, getInvestorHoldings, getInvestorNetWorth, createInvestor, logout } = require('../controller/investController')
const { verifyInvestor } = require('../utils/authManager')
const router = express.Router()

router.post('/login',login)
router.post('/logout',logout)
router.post('/addInvestor',verifyInvestor,createInvestor)
router.get('/:id',verifyInvestor,getInvestorDetails)
router.get('/:id/holdings',verifyInvestor,getInvestorHoldings)
router.get('/:id/networth',verifyInvestor,getInvestorNetWorth)

module.exports = router