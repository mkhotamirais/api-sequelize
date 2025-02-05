import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "./productController.js";
import upload from "./upload.js";

const router = express.Router();

router.route("/product").get(getProducts).post(upload, createProduct);
router.route("/product/:id").get(getProductById).patch(upload, updateProduct).delete(deleteProduct);

export default router;
