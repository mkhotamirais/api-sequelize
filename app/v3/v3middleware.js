import jwt from "jsonwebtoken";
import { Users } from "./models.js";
import "dotenv/config";

const ats = process.env.ACCESS_TOKEN_SECRET;

export const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.accessTokenApiSeqV3;

    if (!token) {
      return res.status(401).json({ error: `unauthorized, your not logged in` });
    }
    const decoded = jwt.verify(token, ats);

    const user = await Users.findOne({ where: { id: decoded.id }, attributes: { exclude: ["password"] } });
    if (!user) {
      return res.status(403).json({ message: "Forbidden: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Token invalid" });
  }
};

export const matchUser = (allowedRoles = []) => {
  return async (req, res, next) => {
    const { id } = req.params;

    if (req.user.role === "admin") return next();

    // Jika ada ID di params, cek apakah user bisa mengaksesnya
    if (id) {
      const targetUser = await Users.findByPk(id);
      if (!targetUser) return res.status(404).json({ error: "User not found" });

      // Editor hanya bisa mengakses user dengan role 'user' atau 'editor'
      if (req.user.role === "editor" && (targetUser.role === "user" || targetUser.role === "editor")) {
        return next();
      }

      // User hanya bisa mengakses dirinya sendiri
      if (req.user.role === "user" && req.user.id.toString() === id) {
        return next();
      }

      return res.status(403).json({ error: "Forbidden: You cannot access this resource" });
    }

    // Jika tidak ada ID, cek apakah role user diizinkan untuk akses route ini
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: You do not have permission" });
    }

    next();
  };
};

// *** jika menggunakan bearer
// export const isLogin = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization || req.headers.Authorization || req.headers["authorization"];
//     if (!authHeader?.startsWith("Bearer ")) {
//       return res.status(401).json({ message: `unauthorized: your not logged in` });
//     }
//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, ats);

//     const user = await Users.findOne({ where: { id: decoded.id }, attributes: { exclude: ["password"] } });

//     if (!user) {
//       return res.status(403).json({ message: "Forbidden: User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Forbidden: Token invalid" });
//   }
// };

// export const isAdmin = (req, res, next) => {
//   if (req.user.role !== "admin") return res.status(403).json({ error: `admin only` });
//   next();
// };
