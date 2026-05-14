import express from "express";

import cors from "cors";

import client from "./utils/pgManager";

import investRoutes from "./routes/investRoutes";
import fundRoutes from "./routes/fundRoutes";
import sipRoutes from "./routes/sipRoutes";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:3000"
    })
);

app.use(
    "/sip/invest",
    investRoutes
);

app.use(
    "/sip/fund",
    fundRoutes
);

app.use(
    "/sip",
    sipRoutes
);

const PORT: number = 4000;

app.listen(PORT, () => {

    console.log(
        `Server started on port ${PORT}`
    );

});