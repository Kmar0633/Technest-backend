import express from "express";
import product from "./handlers/product.js";
import category from "./handlers/category.js";
const router = express.Router();

router.get("/products",product.get)
router.get("/categories",category.get)
export default router;