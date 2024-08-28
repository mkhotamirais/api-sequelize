import express from "express";
import { createProduct, deleteProduct, readProductById, readProducts, updateProduct } from "./productController.js";
import { deleteUser, readUserById, readUsers, updateUser } from "./userController.js";
import { deleteMe, getMe, refresh, signin, signout, signup, updateMe } from "./authController.js";
import { isAdmin, isLoginBearer } from "./mw.js";
const router = express.Router();

router.patch("/signin", signin);
router.post("/signup", signup);
router.get("/refresh", refresh);
router.patch("/signout", signout);

router.route("/product").get(readProducts).post(isLoginBearer, isAdmin, createProduct);
router.use(isLoginBearer);
router.route("/product/:id").get(readProductById).patch(updateProduct).delete(deleteProduct);

router.route("/me").get(getMe).patch(updateMe).delete(deleteMe);
router.patch("/signout", signout);

router.use(isAdmin);
router.route("/user").get(readUsers);
router.route("/user/:id").get(readUserById).patch(updateUser).delete(deleteUser);

export default router;
