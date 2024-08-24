import express from "express";
import { createProduct, deleteProduct, readProductById, readProducts, updateProduct } from "./productController.js";
const router = express.Router();

router.route("/product").get(readProducts).post(createProduct);
router.route("/product/:id").get(readProductById).patch(updateProduct).delete(deleteProduct);

export default router;
