import bcrypt from "bcrypt";
import { Users } from "./models.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { genSalt, hash } from "bcrypt";
import validator from "validator";

const ats = process.env.ACCESS_TOKEN_SECRET;

export const signup = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!validator.isEmail(email)) return res.status(400).json({ message: "Invalid email format" });
  if (!password) return res.status(400).json({ message: "Password is required" });
  if (password !== confPassword) return res.status(400).json({ message: "Confirm password is wrong" });

  try {
    const duplicate = await Users.findOne({ where: { [Op.or]: [{ name }, { email }] } });
    if (duplicate) {
      return res.status(409).json({
        message: duplicate.name === name ? "Duplicate name" : "Duplicate email",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;

    if (role && role === "admin") {
      req.body.role = "user";
    } else if (email === "ahmad@gmail.com") {
      req.body.role = "admin";
    }

    await Users.create(req.body);

    res.status(201).json({ message: `Register ${name} success` });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error?.original?.sqlMessage || error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password) return res.status(400).json({ message: "Password is required" });

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: `Email ${email} not found` });

    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) return res.status(401).json({ message: "Wrong password" });

    const accessToken = jwt.sign({ id: user.id, email, role: user.role }, ats, { expiresIn: "1d" });

    // Simpan token dalam cookie
    res.cookie("accessTokenApiSeqV3", accessToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({ message: `Signin ${user.name} success`, accessTokenApiSeqV3: accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signout = async (req, res) => {
  const accessToken = req.cookies.accessTokenApiSeqV3;

  try {
    if (!accessToken) return res.status(403).json({ message: "No access token provided" });

    res.clearCookie("accessTokenApiSeqV3", { secure: true, httpOnly: true, sameSite: "none", path: "/" });

    res.status(200).json({ message: "Logout success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get User Data (getMe)
export const getMe = async (req, res) => {
  const { id } = req.user;
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized, missing user data" });

    const user = await Users.findOne({ where: { id }, attributes: { exclude: ["password", "accessToken"] } });
    if (!user) return res.status(403).json({ message: "Forbidden, user not found" });

    res.status(200).json({ message: "User data retrieved successfully", user });
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update User Data (updateMe)
export const updateMe = async (req, res) => {
  const { id } = req.user;
  try {
    const existingDataToken = await Users.findOne({
      where: { id },
      attributes: { exclude: ["password", "accessToken"] },
    });
    if (!existingDataToken) return res.status(403).json({ message: "Forbidden: token tidak valid" });

    if (existingDataToken.role !== "admin" && req.body.role === "admin")
      return res.status(400).json({ message: "User cannot be an admin without admin permission" });

    if (existingDataToken.email === "ahmad@gmail.com" && req.body.role === "user")
      return res.status(400).json({ message: "You are the primary admin, you cannot be a user" });

    const { password, confPassword } = req.body;
    if (password) {
      if (password !== confPassword) return res.status(400).json({ message: "Confirm password is wrong" });
      const salt = await genSalt(10);
      req.body.password = await hash(password, salt);
    } else {
      req.body.password = existingDataToken.password;
    }

    await Users.update(req.body, { where: { id: existingDataToken.id } });
    res.status(200).json({ message: "Update your account success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Delete User Data (deleteMe)
export const deleteMe = async (req, res) => {
  const { id } = req.user;
  try {
    const existingDataToken = await Users.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    if (!existingDataToken) return res.status(403).json({ message: "Forbidden: token tidak valid" });

    if (existingDataToken.role === "admin")
      return res.status(400).json({ message: "Role admin cannot be deleted, change role first" });

    if (existingDataToken.email === "ahmad@gmail.com")
      return res.status(400).json({ message: "The primary admin cannot be deleted" });

    res.clearCookie("accessToken", {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      path: "/",
    });

    await Users.destroy({ where: { id: existingDataToken.id } });
    res.status(200).json({ message: "Delete your account success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
