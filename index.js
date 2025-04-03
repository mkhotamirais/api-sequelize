import express from "express";
import "dotenv/config";
import cors from "cors";
import { corsOptions, credentials } from "./middleware.js";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
const dirName = path.dirname(fileURLToPath(import.meta.url));

// import db from "./config/index.js";
// import { Products as v1Products } from "./app/v1/models.js";
// import { Products as v2Products } from "./app/v2/models.js";
// import { Tags as v3Tags } from "./app/v3/models.js";
// import { Categories as v3Categories } from "./app/v3/models.js";
// import { Users as v3Users } from "./app/v3/models.js";
// import { Products as v3Products } from "./app/v3/models.js";
// import { ProductTags as v3ProductTags } from "./app/v3/models.js";

import v1Router from "./app/v1/router.js";
import v2Router from "./app/v2/router.js";
import v3Router from "./app/v3/router.js";

// (async () => {
//   await db.authenticate();
//   // await v1Products.sync();
//   // await v2Products.sync();
//   await v3Users.sync();
//   await v3Tags.sync();
//   await v3Categories.sync();
//   await v3Products.sync();
//   await v3ProductTags.sync();
// })();

const app = express();
const port = process.env.PORT || 3000;

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(dirName, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Api Sequelizee");
});

app.use("/api-sequelize/v1", v1Router);
app.use("/api-sequelize/v2", v2Router);
app.use("/api-sequelize/v3", v3Router);

app.listen(port, () => console.log(`Running on http://localhost:${port}`));
