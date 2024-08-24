import { Users } from "./models.js";
import { genSalt, hash } from "bcrypt";

export const readUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

export const readUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Users.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, confPassword } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required!" });
  if (!email) return res.status(400).json({ error: "Email is required!" });

  try {
    const data = await Users.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });
    const dupName = await Users.findOne({ where: { name } });
    const dupEmail = await Users.findOne({ where: { email } });
    if (dupName && dupName.name !== name) return res.status(409).json({ error: "Duplicate name!" });
    if (dupEmail && dupEmail.email !== email) return res.status(409).json({ error: "Duplicate email!" });
    if (data.email === "ahmad@gmail.com")
      return res.status(400).json({ error: `You cannot change any of primary admin data` });

    if (password) {
      if (password !== confPassword) return res.status(400).json({ error: "Wrong confirm password!" });
      const salt = await genSalt(10);
      const hashPass = await hash(password, salt);
      req.body.password = hashPass;
    } else {
      req.body.password = data.password;
    }

    await Users.update(req.body, { where: { id } });
    res.status(200).json({ message: `Update ${name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Users.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });
    if (data.role === "admin") return res.status(400).json({ error: `Admin role cannot be deleted!` });
    if (data.email === "ahmad@gmail.com") return res.status(400).json({ error: `The primary admin cannot be deleted` });

    await Users.destroy({ where: { id } });
    res.status(200).json({ message: `Delete ${data.name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};
