import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
// import db from "./config/db.js";
// import { Products as V1Products } from "./v1/models.js";
// import { Products as V2Products, Users as V2Users } from "./v2/models.js";

import v1Router from "./v1/router.js";
import v2Router from "./v2/router.js";

const port = process.env.PORT || 3000;
const app = express();

// (async () => {
//   await db.authenticate();
//   await V1Products.sync();
//   // urutannya harus user dulu baru produk
//   await V2Users.sync();
//   await V2Products.sync();
// })();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("welcome to api sequelize");
});

app.use("/v1", v1Router);
app.use("/v2", v2Router);

// -- Aktifkan koneksi ini jika tidak ingin milihat log database
app.listen(port, () => console.log(`Running on http://localhost:${port}`));

// -- Aktifkan koneksi ini jika ingin melihat log koneksi database
// db.authenticate()
//   .then(() => {
//     app.listen(port, () => console.log(`Connected to railway and running on http://localhost:${port}`));
//   })
//   .catch((err) => console.error("Unable to connect to the database", err));

// -- Aktifkan koneksi ini jika ingin membuat tabel baru database
// db.sync()
//   .then(() => {
//     app.listen(port, () => console.log(`Database connected and sync and server running on http://localhost:${port}`));
//   })
//   .catch((err) => console.error("Unable to connect to the database", err));
