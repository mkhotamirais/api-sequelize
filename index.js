import express from "express";
import "dotenv/config";
import db from "./config/index.js";
import { Products as v1Products } from "./app/v1/models.js";
// import { Products as v2Products } from "./app/v2/models.js";
// import { Users as v2Users } from "./app/v2/models.js";
import cors from "cors";
import { corsOptions, credentials } from "./middleware.js";

import v1Router from "./app/v1/router.js";
// import v2Router from "./app/v2/router.js";

(async () => {
  await db.authenticate();
  await v1Products.sync();
  // await v2Users.sync();
  // await v2Products.sync();
})();

const app = express();
const port = process.env.PORT || 3000;

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Api Sequelize");
});

app.use("/api-sequelize/v1", v1Router);
// app.use("/api-sequelize/v2", v2Router);

app.listen(port, () => console.log(`Running on http://localhost:${port}`));
