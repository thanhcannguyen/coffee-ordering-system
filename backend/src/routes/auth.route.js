
import express from 'express'
import { register, verifyEmail } from '../controllers/auth.controller.js'

// Tạo router cho auth
const router = express.Router()

// Đăng ký
router.post('/register', register)

// Xác minh email (OTP)
router.post('/verify-email', verifyEmail)

export default router