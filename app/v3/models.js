import db from "../../config/index.js";
import { DataTypes } from "sequelize";

// Model Users
const Users = db.define(
  "v3Users",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("user", "editor", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

// Model Tags
const Tags = db.define(
  "v3Tags",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

// Model Categories
const Categories = db.define(
  "v3Categories",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

// Model Products
const Products = db.define(
  "v3Products",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Categories, key: "id" },
      onDelete: "SET NULL",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Users, key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

// Model ProductTags (Many-to-Many)
const ProductTags = db.define(
  "v3ProductTags",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    tagId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { freezeTableName: true, timestamps: false }
);

// Relasi One-to-Many
Users.hasMany(Products, { foreignKey: "userId", onDelete: "CASCADE" });
Products.belongsTo(Users, { foreignKey: "userId" });

Categories.hasMany(Products, { foreignKey: "categoryId", onDelete: "SET NULL" });
Products.belongsTo(Categories, { foreignKey: "categoryId" });

// Relasi Many-to-Many
Tags.belongsToMany(Products, { through: ProductTags, foreignKey: "tagId" });
Products.belongsToMany(Tags, { through: ProductTags, foreignKey: "productId" });

export { Users, Tags, Categories, Products, ProductTags };
