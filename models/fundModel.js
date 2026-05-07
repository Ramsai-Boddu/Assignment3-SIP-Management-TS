const db = require("../utils/dbManager");

const createFund = (data, callback) => {
  const query = `
        INSERT INTO mf_details(
            id,
            name,
            amc_name,
            current_nav
        )
        VALUES (?, ?, ?, ?)
    `;

  db.run(
    query,
    [data.id, data.name, data.amc_name, data.current_nav],
    function (err) {
      callback(err, this);
    },
  );
};
const getAllFunds = (callback) => {
  const query = `
        SELECT * FROM mf_details
    `;

  db.all(query, [], (err, rows) => {
    callback(err, rows);
  });
};
const updateNAV = (fundId, current_nav, callback) => {
  const query = `
        UPDATE mf_details
        SET current_nav = ?
        WHERE id = ?
    `;

  db.run(query, [current_nav, fundId], function (err) {
    callback(err, this);
  });
};

module.exports = {
  createFund,
  getAllFunds,
  updateNAV,
};
