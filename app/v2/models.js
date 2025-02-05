import db from "../../config/index.js";
import { DataTypes } from "sequelize";

const Products = db.define(
  "v2Products",
  {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
    imageName: { type: DataTypes.STRING, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export { Products };
