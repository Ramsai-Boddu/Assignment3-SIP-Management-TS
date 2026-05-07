const fundModel = require("../models/fundModel");

const createFund = (req, res) => {
  const { id, name, amc_name, current_nav } = req.body;

  const data = {
    id,
    name,
    amc_name,
    current_nav,
  };

  fundModel.createFund(data, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    return res.status(201).json({
      message: "Fund Created Successfully",
    });
  });
};

const getAllFunds = (req, res) => {
  fundModel.getAllFunds((err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    return res.status(200).json(rows);
  });
};

const updateNAV = (req, res) => {
  const fundId = req.params.fundId;

  const { current_nav } = req.body;

  fundModel.updateNAV(fundId, current_nav, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Fund Not Found",
      });
    }

    return res.status(200).json({
      message: "NAV Updated Successfully",
    });
  });
};

module.exports = {
  createFund,
  getAllFunds,
  updateNAV,
};
