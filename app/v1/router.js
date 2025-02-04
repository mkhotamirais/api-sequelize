import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "./productController.js";

const router = express.Router();

router.route("/product").get(getProducts).post(createProduct);
router.route("/product/:id").get(getProductById).patch(updateProduct).delete(deleteProduct);

export default router;
