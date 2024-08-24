import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./config/db.js";
// import { Products as V1Product } from "./v1/productModel.js";

import v1Router from "./v1/router.js";

const port = process.env.PORT || 3000;
const app = express();

// (async () => {
//   await db.authenticate();
//   await V1Product.sync();
// })();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("welcome to api sequelize");
});

app.use("/v1", v1Router);

// app.listen(port, () => console.log(`Running on http://localhost:${port}`));

db.authenticate()
  .then(() => {
    app.listen(port, () => console.log(`Connected to railway and running on http://localhost:${port}`));
  })
  .catch((err) => console.error("Unable to connect to the database", err));

// db.sync()
//   .then(() => {
//     app.listen(port, () => console.log(`Database connected and sync and server running on http://localhost:${port}`));
//   })
//   .catch((err) => console.error("Unable to connect to the database", err));
