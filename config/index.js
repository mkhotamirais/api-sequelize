import { Sequelize } from "sequelize";
import "dotenv/config";
import mysql2 from "mysql2";

const db_host = process.env.NODE_ENV === "production" ? process.env.DB_HOST_PROD : process.env.DB_HOST;
const db_user = process.env.NODE_ENV === "production" ? process.env.DB_USER_PROD : process.env.DB_USER;
const db_pass = process.env.NODE_ENV === "production" ? process.env.DB_PASS_PROD : process.env.DB_PASS;
const db_name = process.env.NODE_ENV === "production" ? process.env.DB_NAME_PROD : process.env.DB_NAME;
// const db_uri = process.env.DB_URI;

const db = new Sequelize(db_name, db_user, db_pass, {
  host: db_host,
  dialect: "mysql",
  dialectModule: mysql2, // 👈 Pastikan ini ada!
  logging: console.log("Database connected"),
});

// const db = new Sequelize(dbUri);

export default db;
