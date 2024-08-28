import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Products = db.define(
  "V2Product",
  {
    name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, len: [3, 100] } },
    price: { type: DataTypes.INTEGER, allowNull: false, validate: { notEmpty: true } },
    userId: { type: DataTypes.INTEGER, allowNull: false, validate: { notEmpty: true } },
  },
  {
    freezeTableName: true,
  }
);

const Users = db.define(
  "V2User",
  {
    name: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { notEmpty: true } },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { notEmpty: true } },
    password: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    refreshToken: DataTypes.TEXT,
    role: { type: DataTypes.STRING, defaultValue: "user" },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Products, { foreignKey: "userId" });
Products.belongsTo(Users, { foreignKey: "userId" });

export { Products, Users };
