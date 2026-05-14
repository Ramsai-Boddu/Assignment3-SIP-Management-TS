import client from "../utils/pgManager";

interface SipData {
    id: number;
    amount: number;
    purchase_date: Date;
    unit_value: number;
    portfolio_id: number;
    mutual_id: number;
    status: string;
}

interface Sip {
    id: number;
    amount: number;
    purchase_date: Date;
    unit_value: number;
    portfolio_id: number;
    mutual_id: number;
    status: string;
    current_nav: number;
}

const addSip = async (
    data: SipData
): Promise<any> => {

    const query = `
        INSERT INTO sip (
            id,
            amount,
            purchase_date,
            unit_value,
            portfolio_id,
            mutual_id,
            status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;

    const values = [
        data.id,
        data.amount,
        data.purchase_date,
        data.unit_value,
        data.portfolio_id,
        data.mutual_id,
        data.status
    ];

    const result = await client.query(
        query,
        values
    );

    return result.rows[0];
};

const fetchSipById = async (
    id: number
): Promise<any> => {

    const query = `
        SELECT *
        FROM sip
        WHERE id = $1
    `;

    const result = await client.query(
        query,
        [id]
    );

    return result.rows[0];
};

const executeSip = async (
    sipId: number
): Promise<any> => {

    try {

        await client.query("BEGIN");

        const sipQuery = `
            SELECT 
                s.*,
                mf.current_nav
            FROM sip s

            JOIN mf_details mf
                ON s.mutual_id = mf.id

            WHERE s.id = $1
        `;

        const sipResult = await client.query<Sip>(
            sipQuery,
            [sipId]
        );

        const sip = sipResult.rows[0];

        if (!sip) {

            throw new Error("SIP Not Found");

        }

        const units =
            sip.amount / sip.current_nav;

        const transactionId = Math.floor(
            10000000 + Math.random() * 90000000
        );

        console.log(transactionId);

        const transactionQuery = `
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE)
        `;

        await client.query(
            transactionQuery,
            [
                transactionId,
                sip.portfolio_id,
                sip.mutual_id,
                sip.id,
                "BUY",
                sip.amount,
                sip.current_nav,
                units
            ]
        );

        await client.query("COMMIT");

        return {
            sip_id: sip.id,
            amount: sip.amount,
            nav: sip.current_nav,
            units: units
        };

    } catch (err) {

        await client.query("ROLLBACK");

        throw err;
    }
};

const fetchSipTransactions = async (
    sipId: number
): Promise<any[]> => {

    const query = `
        SELECT *
        FROM transaction_history
        WHERE sip_id = $1
    `;

    const result = await client.query(
        query,
        [sipId]
    );

    return result.rows;
};

export {
    addSip,
    fetchSipById,
    executeSip,
    fetchSipTransactions
};