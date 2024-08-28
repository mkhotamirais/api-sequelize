import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { existsSync, mkdirSync, appendFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { allowedOrigins } from "./config/origins.js";

export const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

export const corsOptions = {
  origin: (origin, callback) => {
    allowedOrigins.indexOf(origin) !== -1 || !origin
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export const logEvents = (message, fileName) => {
  const logItem = `${format(new Date(), "yyyyMMdd-HH:mm:ss")}\t${uuidv4()}\t${message}\n`;
  const dirName = dirname(fileURLToPath(import.meta.url));

  try {
    if (!existsSync(join(dirName, "logs"))) mkdirSync(join(dirName, "logs"));
    appendFileSync(join(dirName, "logs", fileName), logItem);
  } catch (error) {
    console.log(error);
  }
};
// path.join(path.dirname(url.fileURLToPath(import.meta.url)), "product.json"),

export const logSuccess = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "log-success.log");
  console.log(`${req.method}\t${req.path}`);
  next();
};

export const logError = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "log-error.log");
  console.log(err.stack);
  res.status(500).json({ message: err.message });
};
