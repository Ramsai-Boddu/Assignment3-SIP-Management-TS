import client from "../utils/pgManager";

interface InvestorData {
    investor_id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    pan: string;
    aadhar: string;
    data_of_birth: string;
    gender: string;
    occupation: string;
    portfolio_id: number;
    email: string;
    password: string;
    role: string;
}

interface User {
    investor_id: number;
    email: string;
    password: string;
    role: string;
}

const invalidTokens: string[] = [];

const findUser = async (
    email: string
): Promise<User | undefined> => {

    const query = `
        SELECT *
        FROM user_login
        WHERE email = $1
    `;

    const result = await client.query<User>(
        query,
        [email]
    );

    return result.rows[0];
};

const logoutUser = async (
    email: string,
    token: string
): Promise<boolean> => {

    const user = await findUser(email);

    if (!user) {

        return false;

    }

    invalidTokens.push(token);

    return true;
};

const getUser = async (
    id: string
): Promise<any> => {

    const query = `
        SELECT *
        FROM investor
        WHERE investor_id = $1
    `;

    const result = await client.query(
        query,
        [id]
    );

    return result.rows[0];
};

const getHoldings = async (
    id: string
): Promise<any[]> => {

    const query = `
        SELECT 
            i.first_name,
            i.investor_id,
            p.portfolio_id,

            a.id AS sip_id,
            a.amount,
            a.purchase_date,
            a.unit_value,
            a.status,

            m.id AS fund_id,
            m.name AS fund_name,
            m.amc_name,
            m.current_nav

        FROM investor AS i

        LEFT JOIN portfolio AS p
            ON i.investor_id = p.investor_id

        LEFT JOIN sip AS a
            ON p.portfolio_id = a.portfolio_id

        LEFT JOIN mf_details AS m
            ON a.mutual_id = m.id

        WHERE i.investor_id = $1
    `;

    const result = await client.query(
        query,
        [id]
    );

    return result.rows;
};

const getNetWorth = async (
    id: string
): Promise<any> => {

    const query = `
        SELECT 
            i.investor_id,
            i.first_name,
            SUM(
                th.units * mf.current_nav
            ) AS net_worth

        FROM investor i

        JOIN portfolio p
            ON i.investor_id = p.investor_id

        JOIN transaction_history th
            ON p.portfolio_id = th.portfolio_id

        JOIN mf_details mf
            ON th.mutual_id = mf.id

        WHERE i.investor_id = $1

        GROUP BY i.investor_id, i.first_name
    `;

    const result = await client.query(
        query,
        [id]
    );

    return result.rows[0];
};

const addInvestor = async (
    data: InvestorData
): Promise<InvestorData> => {

    try {

        await client.query("BEGIN");

        const investorQuery = `
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

        await client.query(
            investorQuery,
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

        const portfolioQuery = `
            INSERT INTO portfolio(
                portfolio_id,
                investor_id
            )
            VALUES ($1, $2)
        `;

        await client.query(
            portfolioQuery,
            [
                data.portfolio_id,
                data.investor_id
            ]
        );

        const loginQuery = `
            INSERT INTO user_login(
                investor_id,
                email,
                password,
                role
            )
            VALUES ($1, $2, $3, $4)
        `;

        await client.query(
            loginQuery,
            [
                data.investor_id,
                data.email,
                data.password,
                data.role
            ]
        );

        await client.query("COMMIT");

        return data;

    } catch (err) {

        await client.query("ROLLBACK");

        throw err;
    }
};

const fetchBankDetails = async (
    id: string
): Promise<any[]> => {

    const query = `
        SELECT
            bd.account_no,
            bd.account_type,
            b.bank_name,
            b.branch,
            b.ifsc,
            b.address

        FROM bank_details bd

        JOIN bank b
            ON bd.bank_id = b.bank_id

        WHERE bd.investor_id = $1
    `;

    const result = await client.query(
        query,
        [id]
    );

    return result.rows;
};

const fetchNomineeDetails = async (
    id: string
): Promise<any[]> => {

    const query = `
        SELECT
            first_name,
            middle_name,
            last_name,
            relationship,
            contact,
            date_of_birth

        FROM nominee

        WHERE investor_id = $1
    `;

    const result = await client.query(
        query,
        [id]
    );

    return result.rows;
};

export {
    findUser,
    getUser,
    getHoldings,
    getNetWorth,
    addInvestor,
    invalidTokens,
    logoutUser,
    fetchBankDetails,
    fetchNomineeDetails
};