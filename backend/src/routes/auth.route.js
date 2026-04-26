
import express from 'express'
import { register, verifyEmail, login } from '../controllers/auth.controller.js'

// Tạo router cho auth
const router = express.Router()

// Đăng ký
router.post('/register', register)

// Xác minh email (OTP)
router.post('/verify-email', verifyEmail)

// Đăng nhập
router.post('/login', login)

export default router