const fundModel = require("../models/fundModel");

const createFund = async (req, res) => {

  try {

    const { id, name, amc_name, current_nav } = req.body;

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

  } catch (err) {

    return res.status(500).json({
      error: err.message,
    });

  }
};

const getAllFunds = async (req, res) => {

  try {

    const rows = await fundModel.getAllFunds();

    return res.status(200).json(rows);

  } catch (err) {

    return res.status(500).json({
      error: err.message,
    });

  }
};

const updateNAV = async (req, res) => {

  try {

    const fundId = req.params.fundId;

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

  } catch (err) {

    return res.status(500).json({
      error: err.message,
    });

  }
};

module.exports = {
  createFund,
  getAllFunds,
  updateNAV,
};