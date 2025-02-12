import { Products } from "./models.js";
import { existsSync, unlinkSync, renameSync } from "fs";
import path from "path";
import { rootPath } from "../../config/constants.js";

export const createProduct = async (req, res) => {
  const { name, price } = req.body;

  if (!name) return res.status(400).json({ error: `Name is required!` });
  if (!price) return res.status(400).json({ error: `Price is required!` });

  if (req.file) {
    const { originalname, filename, path: pathFile, size } = req.file;
    const validExt = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(originalname);

    if (!validExt.includes(ext)) {
      if (existsSync(pathFile)) unlinkSync(pathFile);
      return res.status(400).json({ error: `Invalid extension` });
    } else if (size > 1000000) {
      if (existsSync(pathFile)) unlinkSync(pathFile);
      return res.status(400).json({ error: `File max 1Mb` });
    }

    req.body.imageName = filename + ext;
    req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/v2product/${filename + ext}`;
    try {
      await Products.create(req.body);
      if (existsSync(pathFile)) renameSync(pathFile, pathFile + ext);
      res.status(201).json({ message: `Create ${name} success` });
    } catch (error) {
      if (existsSync(pathFile + ext)) unlinkSync(pathFile + ext);
      if (existsSync(pathFile)) unlinkSync(pathFile);
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  } else {
    try {
      await Products.create(req.body);
      res.status(201).json({ message: `Create ${name} success` });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
    }
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

  if (req.file) {
    const data = await Products.findOne({ where: { id } });

    const { originalname, filename, path: pathFile, size } = req.file;
    const validExt = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(originalname);

    if (!data) {
      if (existsSync(pathFile)) unlinkSync(pathFile);
      return res.status(400).json({ error: `Data id ${id} not found` });
    }

    if (!validExt.includes(ext)) {
      if (existsSync(pathFile)) unlinkSync(pathFile);
      return res.status(400).json({ error: `Invalid extension` });
    } else if (size > 1000000) {
      if (existsSync(pathFile)) unlinkSync(pathFile);
      return res.status(400).json({ error: `File max 1Mb` });
    }
    const oldName = data.name;
    const oldImageName = data.imageName;

    data.name = name;
    data.price = price;
    data.imageName = filename + ext;
    data.imageUrl = `${req.protocol}://${req.get("host")}/images/v2product/${filename + ext}`;

    try {
      const result = await data.save();
      const pathImage = path.join(rootPath, "public/images/v2product", `${oldImageName}`);

      if (!existsSync(pathImage) && !result.imageName) {
        renameSync(pathFile, pathFile + ext);
        return res.status(200).json({ message: `Update ${oldName} to ${data.name} success` });
      }
      if (existsSync(pathImage)) unlinkSync(pathImage);
      renameSync(pathFile, pathFile + ext);
      res.status(200).json({ message: `Update ${oldName} to ${data.name} success` });
    } catch (error) {
      if (existsSync(pathFile + ext)) unlinkSync(pathFile + ext);
      if (existsSync(pathFile)) unlinkSync(pathFile);
      console.log(error);
      res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
    }
  } else {
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
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Products.findOne({ where: { id } });
    if (!data) return res.status(400).json({ error: `Data id ${id} not found!` });

    const pathImage = path.join(rootPath, "public/images/v2product", `${data.imageName}`);
    if (existsSync(pathImage)) unlinkSync(pathImage);

    await data.destroy();
    res.status(200).json({ message: `Delete ${data.name} success` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error?.errors?.[0]?.message || error.message });
  }
};
