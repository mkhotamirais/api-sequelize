import { Users } from "./models.js";
import { genSalt, hash } from "bcrypt";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Users.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ error: `User with id ${id} not found` });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, confPassword } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required!" });
  if (!email) return res.status(400).json({ error: "Email is required!" });

  try {
    const data = await Users.findOne({ where: { id } });
    if (!data) return res.status(404).json({ error: `User with id ${id} not found` });

    // Check for duplicate name or email
    const duplicateName = await Users.findOne({ where: { name } });
    const duplicateEmail = await Users.findOne({ where: { email } });

    if (duplicateName && duplicateName.id !== id) {
      return res.status(409).json({ error: "Duplicate name!" });
    }

    if (duplicateEmail && duplicateEmail.id !== id) {
      return res.status(409).json({ error: "Duplicate email!" });
    }

    // Prevent changing primary admin
    if (data.email === "ahmad@gmail.com") {
      return res.status(400).json({ error: `You cannot change the primary admin's data` });
    }

    // Password validation
    if (password) {
      if (password !== confPassword) return res.status(400).json({ error: "Confirm password does not match!" });

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      req.body.password = hashedPassword;
    } else {
      req.body.password = data.password; // retain existing password if not provided
    }

    await Users.update(req.body, { where: { id } });
    res.status(200).json({ message: `User ${name} updated successfully` });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Users.findOne({ where: { id } });
    if (!data) return res.status(404).json({ error: `User with id ${id} not found` });

    // Prevent deletion of admin or primary admin
    if (data.role === "admin") return res.status(400).json({ error: `Admin role cannot be deleted!` });
    if (data.email === "ahmad@gmail.com") return res.status(400).json({ error: `The primary admin cannot be deleted` });

    await Users.destroy({ where: { id } });
    res.status(200).json({ message: `User ${data.name} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};
