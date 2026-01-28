import express from "express";
import product from "./handlers/product.js";
import category from "./handlers/category.js";
import user from "./handlers/user.js";
import auth from "./auth/auth.js";
const router = express.Router();

router.get("/products",product.get)
router.get("/productDetail/:id",product.getProductDetail)
router.get("/categories",category.get)
router.post("/auth/register",user.register)
router.post("/auth/refresh",auth.refreshToken)
router.post("/auth/logout",auth.logout)
export default router;