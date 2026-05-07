const db = require('../utils/dbManager');

async function addSip(data) {
    return await new Promise((resolve, reject) => {
        db.run(
            `
            INSERT INTO sip(
                id,
                amount,
                purchase_date,
                unit_value,
                portfolio_id,
                mutual_id,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                data.id,
                data.amount,
                data.purchase_date,
                data.unit_value,
                data.portfolio_id,
                data.mutual_id,
                data.status
            ],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }
        );
    });
}

async function fetchSipById(id) {
    return await new Promise((resolve, reject) => {
        db.get(
            `
            SELECT *
            FROM sip
            WHERE id = ?
            `,
            [id],
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

async function executeSip(sipId) {
    return await new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            db.get(
                `
                SELECT 
                    s.*,
                    mf.current_nav
                FROM sip s

                JOIN mf_details mf
                    ON s.mutual_id = mf.id

                WHERE s.id = ?
                `,
                [sipId],
                (err, sip) => {

                    if (err) {
                        db.run("ROLLBACK");
                        return reject(err);
                    }

                    if (!sip) {
                        db.run("ROLLBACK");
                        return reject(new Error("SIP Not Found"));
                    }

                    const units = sip.amount / sip.current_nav;

                    const transactionId = Date.now();

                    db.run(
                        `
                        INSERT INTO transaction_history(
                            transaction_id,
                            portfolio_id,
                            mutual_id,
                            sip_id,
                            transaction_type,
                            amount,
                            nav,
                            units,
                            transaction_date
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE('now'))
                        `,
                        [
                            transactionId,
                            sip.portfolio_id,
                            sip.mutual_id,
                            sip.id,
                            'BUY',
                            sip.amount,
                            sip.current_nav,
                            units
                        ],
                        (err) => {
                            if (err) {
                                db.run("ROLLBACK");
                                reject(err);
                            } else {
                                db.run("COMMIT");
                                resolve({
                                    sip_id: sip.id,
                                    amount: sip.amount,
                                    nav: sip.current_nav,
                                    units: units
                                });
                            }
                        }
                    );
                }
            );
        });
    });
}
async function fetchSipTransactions(sipId) {
    return await new Promise((resolve, reject) => {
        db.all(
            `
            SELECT *
            FROM transaction_history
            WHERE sip_id = ?
            `,
            [sipId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

module.exports = {addSip,fetchSipById,executeSip,fetchSipTransactions};