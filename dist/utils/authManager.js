"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyInvestor = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = "asdfghjkledcrfvtghn";
const signJwt = (payload) => {
    try {
        const token = jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: "30m"
        });
        return token;
    }
    catch (error) {
        console.log(error);
    }
};
exports.signJwt = signJwt;
const verifyInvestor = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                error: "Token Required"
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (decoded.role !== "investor") {
            return res.status(403).json({
                error: "Access Denied"
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            error: "Invalid Token"
        });
    }
};
exports.verifyInvestor = verifyInvestor;
