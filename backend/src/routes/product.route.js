
// routes/product.route.js
import express from 'express'
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js'
import { protect, restrictTo } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Public — ai cũng xem được
router.get('/', getProducts)
router.get('/:id', getProductById)

// Admin only
router.post('/', protect, restrictTo('admin'), createProduct)
router.put('/:id', protect, restrictTo('admin'), updateProduct)
router.delete('/:id', protect, restrictTo('admin'), deleteProduct)

export default router