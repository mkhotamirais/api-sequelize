import { Op, where, fn, col } from "sequelize";
import { Products, Tags, Categories } from "./models.js";

// Create a new product
export const createProduct = async (req, res) => {
  const { name, price, categoryId, tagIds } = req.body;
  const userId = req.user.id;

  if (!name || !price || !categoryId || !Array.isArray(tagIds) || tagIds.length === 0)
    return res.status(400).json({ error: "All fields are required!" });

  try {
    const category = await Categories.findByPk(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found!" });

    const tags = await Tags.findAll({ where: { id: tagIds } });
    if (tags.length !== tagIds.length) return res.status(404).json({ error: "One or more tags not found!" });

    const product = await Products.create({ name, price, categoryId, userId });

    await product.addV3Tags(tags);

    res.status(201).json({ message: `Product ${name} created successfully`, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  const { q = "", category, tags } = req.query;

  try {
    const data = await Products.findAll({
      where: q ? { name: { [Op.like]: fn("LOWER", `%${q.toLowerCase()}%`) } } : undefined,
      include: [
        {
          model: Categories,
          attributes: ["id", "name"],
          required: !!category,
          where: category ? { name: { [Op.like]: fn("LOWER", `%${category.toLowerCase()}%`) } } : undefined,
        },
        {
          model: Tags,
          attributes: ["id", "name"],
          through: { attributes: [] },
          required: tags ? true : false,
          where: tags ? { name: { [Op.in]: tags.split(",") } } : undefined,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Products.findOne({
      where: { id },
      include: [
        {
          model: Categories,
          attributes: ["id", "name"],
        },
        { model: Tags, attributes: ["id", "name"] },
      ],
    });
    if (!data) return res.status(404).json({ error: `Product with id ${id} not found` });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, categoryId, tagIds } = req.body;
  const userId = req.user.id;

  if (!name) return res.status(400).json({ error: "Name is required!" });
  if (!price) return res.status(400).json({ error: "Price is required!" });

  try {
    const product = await Products.findOne({ where: { id } });
    if (!product) return res.status(404).json({ error: `Product with id ${id} not found` });

    // Check if user is authorized
    if (product.userId !== userId) {
      return res.status(403).json({ error: "You are not authorized to update this product" });
    }

    // Check category if provided
    if (categoryId) {
      const category = await Categories.findByPk(categoryId);
      if (!category) return res.status(404).json({ error: "Category not found!" });
    }

    // Check tags if provided
    let tags = [];
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      tags = await Tags.findAll({ where: { id: tagIds } });
      if (tags.length !== tagIds.length) {
        return res.status(404).json({ error: "One or more tags not found!" });
      }
    }

    // Update product
    await product.update({ name, price, categoryId });

    // Update tags only if provided
    if (tags.length > 0) {
      await product.setV3Tags(tags);
    }

    res.status(200).json({ message: `Product ${name} updated successfully`, product });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const product = await Products.findByPk(id);
    if (!product) return res.status(404).json({ error: `Product with id ${id} not found` });

    if (product.userId !== userId)
      return res.status(403).json({ error: "You are not authorized to delete this product" });

    await product.destroy();
    res.status(200).json({ message: `Product ${product.name} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};
