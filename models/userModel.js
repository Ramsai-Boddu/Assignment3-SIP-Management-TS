const db = require("../utils/dbManager");

async function findUser(email) {
    return await new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM user_login WHERE email = ?`,
            [email],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

const invalidTokens = []

const logoutUser = (email,token) =>{
    const userIndex = findUser(email)
    if(!userIndex){
        return false
    }
    invalidTokens.push(token)
    return true
}

async function getUser(id) {
    return await new Promise((resolve, reject) => {
        db.get(`select * from investor where investor_id = ?`, [id],
            (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            }
        )
    })
}

async function getHoldings(id) {
    return await new Promise((resolve, reject) => {
        db.all(`select i.first_name, i.investor_id,p.portfolio_id,a.* from investor as i
             Left join portfolio as p on i.investor_id = p.investor_id 
             left join sip as a on p.portfolio_id = a.portfolio_id 
             where i.investor_id= ?;`, [id],
            (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            }
        )
    })
}

async function getNetWorth(id) {
    return await new Promise((resolve, reject) => {
        db.get(`SELECT 
    i.investor_id,
    i.first_name,
    SUM(
        th.units * mf.current_nav
    ) AS net_worth
    FROM investor i
    JOIN portfolio p ON i.investor_id = p.investor_id
    JOIN transaction_history th ON p.portfolio_id = th.portfolio_id
    JOIN mf_details mf ON th.mutual_id = mf.id
    WHERE i.investor_id = ?
    GROUP BY i.investor_id;`, [id],
            (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            }
        )
    })
}

async function addInvestor(data) {
    return await new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            db.run(
                `
                INSERT INTO investor(
                    investor_id,
                    first_name,
                    last_name,
                    middle_name,
                    pan,
                    aadhar,
                    data_of_birth,
                    gender,
                    occupation
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    data.investor_id,
                    data.first_name,
                    data.last_name,
                    data.middle_name,
                    data.pan,
                    data.aadhar,
                    data.data_of_birth,
                    data.gender,
                    data.occupation
                ]
            );

            db.run(
                `
                INSERT INTO portfolio(
                    portfolio_id,
                    investor_id
                )
                VALUES (?, ?)
                `,
                [
                    data.portfolio_id,
                    data.investor_id
                ]
            );

            db.run(
                `
                INSERT INTO user_login(
                    investor_id,
                    email,
                    password,
                    role
                )
                VALUES (?, ?, ?,?)
                `,
                [
                    data.investor_id,
                    data.email,
                    data.password,
                    data.role
                ],
                (err) => {

                    if (err) {

                        db.run("ROLLBACK");
                        reject(err);

                    } else {

                        db.run("COMMIT");
                        resolve(data);

                    }

                }
            );

        });

    });

}

module.exports = { findUser, getUser, getHoldings, getNetWorth, addInvestor , invalidTokens , logoutUser}