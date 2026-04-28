
import Product from "../models/product.model.js"
import Category from '../models/category.model.js'

// 1 . user : lấy danh sách sản phẩm
// GET /api/products
// GET /api/products?category=<categoryId>
// Public — ai cũng xem được
export const getProducts = async (req, res) => {
    try {
        // Bước 1: lấy query params nếu có
        // GET /api/product?category=64f2a1...
        const { category } = req.query

        // Bước 2: Nếu có category -> filter theo category
        // Nếu không có category -> lấy tất cả đang available
        const filter = { isAvailable: true }
        if (category) filter.category = category

        const products = await Product.find(filter)
            .populate('category', 'name') // lấy thêm tên category, không lấy các field khác
            .sort({ create: -1 })  // mới nhất lên trước

        // Bước 3. Trả kết quả
        return res.status(200).json({
            success: true,
            total: products.length,
            data: products
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        })
    }
}



// 2. user : xem chi tiết 1 sản phẩm
// GET /api/products/:id
// Public — ai cũng xem được

export const getProductById = async (req, res) => {
    try {
        // Bước 1 
        const product = await Product.findById(req.params.id).populate('category', 'name')

        if (!product) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            })
        }
        // Bước  sản phẩm đã bị ẩn -> không cho user xem
        if (!product.isAvailable) {
            return res.status(404).json({
                message: 'Sản phẩm này hiện không có sẳn'
            })
        }

        // Bước 
        return res.status(200).json({
            success: true,
            data: product
        })

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        })
    }
}


// 3 — Tạo sản phẩm mới
// POST /api/products
// Chỉ admin
export const createProduct = async (req, res) => {
    try {
        // Bước 1 — Lấy dữ liệu từ request
        const { name, description, price, image, category } = req.body

        // Bước 2 — Validate đầu vào
        if (!name || !price || !image || !category) {
            return res.status(400).json({
                message: 'Vui lòng điền đầy đủ tên, giá, ảnh và danh mục',
            })
        }

        if (price < 0) {
            return res.status(400).json({ message: 'Giá không được âm' })
        }

        // Bước 3 — Kiểm tra category có tồn tại không
        // Tránh tạo product với category không hợp lệ
        const existedCategory = await Category.findById(category)

        if (!existedCategory || !existedCategory.isActive) {
            return res.status(400).json({ message: 'Danh mục không tồn tại hoặc đã bị ẩn' })
        }

        // Bước 4 — Kiểm tra tên sản phẩm đã tồn tại chưa

        const existedProduct = await Product.findOne({
            name: { $regex: `^${name.trim()}$`, $options: 'i' }
        })

        if (existedProduct) {
            return res.status(400).json({ message: 'Tên sản phẩm này đã tồn tại' })
        }

        // Bước 5 — Tạo sản phẩm
        const product = await Product.create({
            name: name.trim(),
            description: description?.trim() || '',
            price,
            image,
            category,
        })

        // Populate category để response trả về tên category luôn
        await product.populate('category', 'name')

        return res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm thành công',
            data: product,
        })

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        })
    }
}

// 4 — Cập nhật sản phẩm
// PUT /api/products/:id
// Chỉ admin

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, image, category, isAvailable } = req.body

        // Bước 1 — Tìm sản phẩm
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
        }

        // Bước 2 — Nếu đổi tên, kiểm tra tên mới có trùng không
        if (name && name.trim() !== product.name) {
            const existed = await Product.findOne({
                name: { $regex: `^${name.trim()}$`, $options: 'i' },
                _id: { $ne: id } // loại trừ chính nó
            })

            if (existed) {
                return res.status(400).json({ message: 'Tên sản phẩm này đã tồn tại' })
            }
        }
        // Bước 3 — Nếu đổi category, kiểm tra category mới có hợp lệ khôn
        if (category) {
            const existedCategory = await Category.findById(category)
            if (!existedCategory || !existedCategory.isActive) {
                return res.status(400).json({ message: 'Danh mục không tồn tại hoặc đã bị ẩn' })
            }
        }

        // Bước 4 — Cập nhật từng field nếu được gửi lên
        if (name !== undefined) product.name = name.trim()
        if (description !== undefined) product.description = description.trim()
        if (price !== undefined) product.price = price
        if (image !== undefined) product.image = image
        if (category !== undefined) product.category = category
        if (isAvailable !== undefined) product.isAvailable = isAvailable

        await product.save()
        await product.populate('category', 'name')

        return res.status(200).json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            data: product,
        })

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        })
    }
}

//  5 — Ẩn sản phẩm (soft delete)
// DELETE /api/products/:id
// Chỉ admin
// Không xóa hẳn — vì sau này order sẽ tham chiếu đến product
// Xóa hẳn → order cũ sẽ mất thông tin sản phẩm
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
        }

        if (!product.isAvailable) {
            return res.status(400).json({ message: 'Sản phẩm này đã bị ẩn trước đó' })
        }

        product.isAvailable = false
        await product.save()

        return res.status(200).json({
            success: true,
            message: 'Đã ẩn sản phẩm thành công',
        })

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        })
    }
}