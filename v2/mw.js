import jwt from "jsonwebtoken";
import { Users } from "./models.js";
import "dotenv/config";
const ats = process.env.ACCESS_TOKEN_SECRET;

export const isLoginBearer = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization || req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: `unauthorized, your not logged in` });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, ats, async (error, decoded) => {
    if (error) return res.status(403).json({ error: `forbidden: token invalid` });
    req.user = await Users.findOne({ where: { id: decoded.id }, attributes: { exclude: ["password"] } });
    next();
  });
};

export const matchUser = async (req, res, next) => {
  const { id } = req.params;
  if (req.role === "admin") return next();
  if (id !== req.id.toString()) return forbidden(res, `token tidak valid`);
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: `admin only` });
  next();
};
