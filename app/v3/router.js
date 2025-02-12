import express from "express";
import { isLogin, matchUser } from "./v3middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "./categoryController.js";
import { createTag, deleteTag, getTagById, getTags, updateTag } from "./tagController.js";
import { signin, signup, signout, getMe, updateMe, deleteMe } from "./authController.js";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "./productController.js";
import { deleteUser, getUserById, getUsers, updateUser } from "./userController.js";

const router = express.Router();

// PUBLIC
router.post("/signin", signin);
router.post("/signup", signup);

router.get("/category", getCategories);
router.get("/category/:id", getCategoryById);

router.get("/tag", getTags);
router.get("/tag/:id", getTagById);

router.get("/product", getProducts);
router.get("/product/:id", getProductById);

// LOGIN
router.use(isLogin);

router.post("/signout", signout);

// PRIVATE
router.use("/me", matchUser(["user"]));
router.route("/me").get(getMe).patch(updateMe).delete(deleteMe);

// ADMIN & EDITOR
router.use("/tag", matchUser(["admin", "editor"]));
router.use("/category", matchUser(["admin", "editor"]));

router.post("/category", createCategory);
router.route("/category/:id").patch(updateCategory).delete(deleteCategory);

router.post("/tag", createTag);
router.route("/tag/:id").patch(updateTag).delete(deleteTag);

router.post("/product", createProduct);
router.route("/product/:id").patch(updateProduct).delete(deleteProduct);

// ADMIN ONLY
router.use("/user", matchUser(["admin"]));
router.get("/user", getUsers);
router.route("/user/:id").get(getUserById).patch(updateUser).delete(deleteUser);

export default router;
