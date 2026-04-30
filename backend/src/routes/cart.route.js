
import express from "express";
import { getCart, addToCart } from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET /api/cart
// Lấy giỏ hàng của user đang đăng nhập
router.get("/", protect, getCart);

// POST / api/cart
// thêm sản phẩm vào giỏ hàng
router.post("/", protect, addToCart);

export default router;