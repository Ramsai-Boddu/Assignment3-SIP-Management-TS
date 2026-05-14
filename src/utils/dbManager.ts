import sqlite3 from "sqlite3";

const db = new sqlite3.Database(
    "D:/sipmanager.db",
    (error: Error | null) => {

        if (error) {

            console.log(error);

        } else {

            console.log("Connected to Database");

        }
    }
);

export default db;