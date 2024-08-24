import express from "express";
import { createProduct, deleteProduct, readProductById, readProducts, updateProduct } from "./productController.js";
import { deleteUser, readUserById, readUsers, updateUser } from "./userController.js";
import { refresh, signin, signout, signup } from "./authController.js";
const router = express.Router();

router.patch("/signin", signin);
router.post("/signup", signup);
router.get("/refresh", refresh);
router.patch("/signout", signout);

router.route("/product").get(readProducts).post(createProduct);
router.route("/product/:id").get(readProductById).patch(updateProduct).delete(deleteProduct);

router.route("/user").get(readUsers);
router.route("/user/:id").get(readUserById).patch(updateUser).delete(deleteUser);

export default router;
