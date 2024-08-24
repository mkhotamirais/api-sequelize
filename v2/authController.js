import bcrypt from "bcrypt";
import { Users } from "./models.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import "dotenv/config";
const ats = process.env.ACCESS_TOKEN_SECRET;
const rts = process.env.REFRESHTOKEN_SECRET;

export const signup = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (!name) return res.status(400).json({ error: `Name is required` });
  if (!email) return res.status(400).json({ error: `Email is required` });
  if (!password) return res.status(400).json({ error: `Password is required` });
  try {
    // const duplicate = await Users.findOne({ where: { [Op.or]: [{ name }, { email }] } });
    // if (duplicate) return res.status(409).json({error: `Duplicate name or email`});

    const dupName = await Users.findOne({ where: { name } });
    if (dupName) return res.status(409).json({ error: `Duplicate name` });
    const dupEmail = await Users.findOne({ where: { email } });
    if (dupEmail) return res.status(409).json({ error: `Duplicate email` });

    if (password !== confPassword) return res.status(400).json({ error: `Confirm password wrong` });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    req.body.password = hash;
    await Users.create(req.body);
    res.status(201).json({ message: `Register ${name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ error: `Email is required` });
  if (!password) return res.status(400).json({ error: `Password is required` });
  try {
    const data = await Users.findOne({ where: { email } });
    if (!data) return res.status(400).json({ error: `Email ${email} not found` });

    const matchPass = bcrypt.compareSync(password, data.password);
    if (!matchPass) return res.status(400).json({ error: `Wrong password` });

    const { id, role } = data;
    const accessToken = jwt.sign({ id, email, role }, ats, { expiresIn: "15s" });
    const refreshToken = jwt.sign({ id, email, role }, rts, { expiresIn: "1d" });

    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      // maxAge: 30 * 24 * 60 * 60 * 1000,
      // sameSite: "lax", //
      sameSite: "none",
      path: "/",
    });
    await Users.update({ refreshToken }, { where: { id } });
    res.status(200).json({ message: `login success`, accessToken });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: `Unauthorized, no token` });
  try {
    const data = await Users.findOne({ where: { refreshToken } });
    if (!data) return forbidden(res);
    jwt.verify(refreshToken, rts, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const { id, email, role } = data;
      const accessToken = jwt.sign({ id, email, role }, ats, { expiresIn: "15s" });
      res.status(200).json({ message: `access token from refresh`, accessToken });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

export const signout = async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;
  try {
    if (!refreshToken) return res.status(204);
    const user = await Users.findOne({ where: { refreshToken } });
    if (!user) return res.status(204);
    await Users.update({ refreshToken: null }, { where: { id: user.id } });
    res.clearCookie(`refreshToken`, refreshToken, {
      secure: true,
      httpOnly: true,
      // maxAge: 30 * 24 * 60 * 60 * 1000,
      // sameSite: "lax", //
      sameSite: "none",
      path: "/",
    });
    res.status(200).json({ message: `logout success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};
