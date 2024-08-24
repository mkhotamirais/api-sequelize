import { Sequelize } from "sequelize";
import "dotenv/config";
const dbUri = process.env.DB_URI;

// const database = process.env.DB_NAME;
// const username = process.env.DB_USER;
// const password = process.env.DB_PASS;
// const host = process.env.DB_HOST;

// const db = new Sequelize(database, username, password, {
//   host,
//   dialect: "mysql",
//   logging: console.log(`Connect to ${database}`),
//   // dialectOptions: {
//   //   ignoreDeprecations: true, // Menonaktifkan deprecation warning
//   // },
//   // define: { engine: "MYISAM" },
// });

const db = new Sequelize(dbUri);

export default db;
