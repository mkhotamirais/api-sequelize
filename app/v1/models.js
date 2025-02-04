import db from "../../config/index.js";
import { DataTypes } from "sequelize";

const Products = db.define(
  "v1Products",
  {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export { Products };
