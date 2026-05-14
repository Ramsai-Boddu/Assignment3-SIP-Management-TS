"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const investRoutes_1 = __importDefault(require("./routes/investRoutes"));
const fundRoutes_1 = __importDefault(require("./routes/fundRoutes"));
const sipRoutes_1 = __importDefault(require("./routes/sipRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000"
}));
app.use("/sip/invest", investRoutes_1.default);
app.use("/sip/fund", fundRoutes_1.default);
app.use("/sip", sipRoutes_1.default);
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
