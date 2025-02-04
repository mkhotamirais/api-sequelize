import { Products } from "./models.js";

export const createProduct = async (req, res) => {
  const { name, price } = req.body;

  if (!name) return res.status(400).json({ error: `Name is required!` });
  if (!price) return res.status(400).json({ error: `Price is required!` });

  try {
    await Products.create(req.body);
    res.status(201).json({ message: `Create ${name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const data = await Products.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Products.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!name) return res.status(400).json({ error: `Name is required!` });
  if (!price) return res.status(400).json({ error: `Price is required!` });

  try {
    const data = await Products.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });
    const oldName = data.name;

    data.name = name;
    data.price = price;

    await data.save();
    res.status(200).json({ message: `Update ${oldName} to ${data.name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Products.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });

    await data.destroy();
    res.status(200).json({ message: `Delete ${data.name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};
