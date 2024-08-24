import db from "../config/db.js";
import { DataTypes } from "sequelize";

const Products = db.define(
  "V1Product",
  {
    // id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // // sebenarnya id sudah otomatis dibuatkan, jadi tidak ditambah id juga tidak apa apa
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    freezeTableName: true,
  }
);

export { Products };
