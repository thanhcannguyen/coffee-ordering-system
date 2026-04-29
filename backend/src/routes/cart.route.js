
import express from "express";
import { getCart } from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET /api/cart
// Lấy giỏ hàng của user đang đăng nhập
router.get("/", protect, getCart);

export default router;