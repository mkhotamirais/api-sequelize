import { Products } from "./models.js";

export const readProducts = async (req, res) => {
  try {
    const data = await Products.findAll({
      order: [["createdAt", "DESC"]],
      // attributes: ['id']
      // attributes: {exclude: ['id']}
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

export const readProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Products.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found` });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  if (!name) return res.status(400).json({ error: `Name is required` });
  if (!price) return res.status(400).json({ error: `Price is required` });
  try {
    await Products.create(req.body);
    res.status(201).json({ message: `Create ${name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Products.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found` });
    await Products.destroy({ where: { id } });
    res.status(200).json({ message: `Delete '${data.name}' success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  if (!name) return res.status(400).json({ error: `Name is required` });
  if (!price) return res.status(400).json({ error: `Price is required` });
  try {
    const data = await Products.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found` });
    if (!name || !price) return badRequest(res, "Isi semua field yang tidak boleh kosong");
    await Products.update(req.body, { where: { id } });
    res.status(200).json({ message: `Update ${name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.original?.sqlMessage || error.message });
  }
};
