import express from "express";
import product from "./handlers/product.js";
const router = express.Router();

router.get("/products",product.get)

export default router;