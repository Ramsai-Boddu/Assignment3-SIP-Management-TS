import { Client } from "pg";

import dotenv from "dotenv";

dotenv.config();

const client = new Client({
    host: "aws-1-ap-south-1.pooler.supabase.com",
    port: 6543,
    user: "postgres.yerezublsamksbvkrnwm",
    password: process.env.password,
    database: "postgres",
    ssl: {
        rejectUnauthorized: false
    }
});

const run = async (): Promise<void> => {

    try {

        await client.connect();

        console.log(
            "Connected to PostgreSQL"
        );

        const res = await client.query(
            "SELECT * FROM investor;"
        );

        console.log(res.rows);

    } catch (error) {

        console.log(error);

    }
};

run();

export default client;