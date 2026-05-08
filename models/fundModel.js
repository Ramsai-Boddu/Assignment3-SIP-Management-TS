const client = require("../utils/pgManager");

const createFund = async (data) => {
  const query = `
    INSERT INTO mf_details(
      id,
      name,
      amc_name,
      current_nav
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    data.id,
    data.name,
    data.amc_name,
    data.current_nav
  ];

  const result = await client.query(query, values);

  return result.rows[0];
};

const getAllFunds = async () => {
  const query = `
    SELECT * FROM mf_details
  `;

  const result = await client.query(query);

  return result.rows;
};

const updateNAV = async (fundId, current_nav) => {
  const query = `
    UPDATE mf_details
    SET current_nav = $1
    WHERE id = $2
    RETURNING *;
  `;

  const result = await client.query(query, [
    current_nav,
    fundId
  ]);

  return result.rows[0];
};

module.exports = {
  createFund,
  getAllFunds,
  updateNAV,
};

// const db = require("../utils/dbManager");
// const client = require("./utils/pgManager");

// const createFund = (data, callback) => {
//   const query = `
//         INSERT INTO mf_details(
//             id,
//             name,
//             amc_name,
//             current_nav
//         )
//         VALUES (?, ?, ?, ?)
//     `;

//   db.run(
//     query,
//     [data.id, data.name, data.amc_name, data.current_nav],
//     function (err) {
//       callback(err, this);
//     },
//   );
// };
// const getAllFunds = (callback) => {
//   const query = `
//         SELECT * FROM mf_details
//     `;

//   db.all(query, [], (err, rows) => {
//     callback(err, rows);
//   });
// };
// const updateNAV = (fundId, current_nav, callback) => {
//   const query = `
//         UPDATE mf_details
//         SET current_nav = ?
//         WHERE id = ?
//     `;

//   db.run(query, [current_nav, fundId], function (err) {
//     callback(err, this);
//   });
// };

// module.exports = {
//   createFund,
//   getAllFunds,
//   updateNAV,
// };
