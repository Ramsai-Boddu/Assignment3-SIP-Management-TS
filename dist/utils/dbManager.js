"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new sqlite3_1.default.Database("D:/sipmanager.db", (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Connected to Database");
    }
});
exports.default = db;
