const {addSip, fetchSipById,executeSip,fetchSipTransactions } = require('../models/sipModel');

const createSip = async (req, res) => {
    try {
        const data = req.body;
        const result = await addSip(data);
        return res.status(201).json({
            message: "SIP Created",
            sip: result
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }

};

const getSipById = async (req, res) => {
    try {
        const { sipId } = req.params;
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
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });

    }
};

const processSip = async (req, res) => {
    try {
        const { sipId } = req.params;
        const result = await executeSip(sipId);
        return res.status(200).json({
            message: "SIP Processed Successfully",
            transaction: result
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

const getSipTransactions = async (req, res) => {
    try {
        const { sipId } = req.params;
        const transactions = await fetchSipTransactions(sipId);
        if (transactions.length === 0) {
            return res.status(404).json({
                error: "No Transactions Found"
            });
        }
        return res.status(200).json({
            message: "Transactions Found",
            transactions
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};



module.exports = { createSip, getSipById,processSip,getSipTransactions };