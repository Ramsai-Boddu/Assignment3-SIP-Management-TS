import client from "../utils/pgManager";

interface FundData {
    id: number;
    name: string;
    amc_name: string;
    current_nav: number;
}

const createFund = async (
    data: FundData
): Promise<any> => {

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

    const result = await client.query(
        query,
        values
    );

    return result.rows[0];
};

const getAllFunds = async (): Promise<any[]> => {

    const query = `
        SELECT * FROM mf_details
    `;

    const result = await client.query(query);

    return result.rows;
};

const getFundsForInvestor = async (
    investorId: string
): Promise<any[]> => {

    const query = `
    
        SELECT 
            mf.id AS mutual_id,
            mf.name,
            mf.amc_name,
            mf.current_nav,

            sip.id AS sip_id,
            sip.amount,
            sip.purchase_date,
            sip.status

        FROM mf_details mf

        LEFT JOIN sip
            ON mf.id = sip.mutual_id

        LEFT JOIN portfolio p
            ON sip.portfolio_id = p.portfolio_id

        AND p.investor_id = $1
    `;

    const result = await client.query(
        query,
        [investorId]
    );

    return result.rows;
};

const updateNAV = async (
    fundId: number,
    current_nav: number
): Promise<any> => {

    const query = `
        UPDATE mf_details
        SET current_nav = $1
        WHERE id = $2
        RETURNING *;
    `;

    const result = await client.query(
        query,
        [
            current_nav,
            fundId
        ]
    );

    return result.rows[0];
};

export {
    createFund,
    getAllFunds,
    updateNAV,
    getFundsForInvestor
};