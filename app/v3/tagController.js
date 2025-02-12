import { Tags } from "./models.js";

export const createTag = async (req, res) => {
  const { name } = req.body;
  console.log(req.body);
  if (!name) return res.status(400).json({ error: `Name is required!` });

  try {
    await Tags.create(req.body);
    res.status(201).json({ message: `Create ${name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};

export const getTags = async (req, res) => {
  try {
    const data = await Tags.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};

export const getTagById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Tags.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};

export const deleteTag = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Tags.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });
    await data.destroy();
    res.status(200).json({ message: `Delete ${data.name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};

export const updateTag = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: `Name is required!` });

  try {
    const data = await Tags.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });
    data.name = name;
    await data.save();
    res.status(200).json({ message: `Update ${data.name} to ${name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};
