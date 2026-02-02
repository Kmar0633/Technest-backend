import express from "express";
import product from "./handlers/product.js";
import category from "./handlers/category.js";
import user from "./handlers/user.js";
import auth from "./auth/auth.js";
import cart from "./handlers/cart.js";
const router = express.Router();

router.get("/products",product.get)
router.get("/productDetail/:id",product.getProductDetail)
router.get("/categories",category.get)
router.post("/auth/register",user.register)
router.get("/user/profile",user.getUser)
router.post("/users/me",user.saveUser)
router.post("/auth/refresh",auth.refreshToken)
router.post("/auth/logout",user.logout)
router.post("/auth/login",user.login)
router.post("/cart/merge",cart.mergeCarts)
router.get("/cart", cart.getCart)
export default router;