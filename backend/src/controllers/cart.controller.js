
// import service xử lý logic giỏ hàng
import { getCartService, addToCartService } from "../services/cart.service.js"

// controller xử lý request lấy xem giỏ hàng
export const getCart = async (req, res) => {
    try {
        // Bước 1 lấy userId từ req.user (được gán từ middleware auth)
        const userId = req.user._id

        // Bước 2 gọi service để lấy giỏ hàng của user
        const cart = await getCartService(userId)

        // Bước 3 trả response thành công về cho client
        return res.status(200).json({
            message: "Get cart successfully",
            cart
        })

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi Server",
            error: error.message
        })
    }
}


// controller xử lý request thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
    try {
        // Bước 1 — Lấy dữ liệu từ body
        // quantity có thể là string → cần ép kiểu về number
        const { productId, quantity } = req.body

        // Ép quantity về số, nếu không có thì mặc định = 1
        const qty = Number(quantity) || 1

        // Bước 2 — Validate productId (bắt buộc)
        if (!productId) {
            return res.status(400).json({ message: 'Thiếu productId' })
        }

        // Bước 3 — Validate quantity
        // Không cho phép số lượng <= 0
        if (qty < 1) {
            return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' })
        }
        // Chặn số thập phân như 3.5
        if (!Number.isInteger(qty)) {
            return res.status(400).json({
                message: 'Số lượng phải là số nguyên'
            })
        }

        // Bước 4 — Gọi service xử lý logic chính
        // Truyền userId từ middleware auth (req.user)
        const cart = await addToCartService(req.user._id, productId, qty)

        // Bước 5 — Trả response thành công
        res.status(200).json({
            success: true,
            data: cart
        })

    } catch (error) {
        // Bước 6 — Log lỗi để debug phía server
        console.error('Lỗi addToCart:', error)

        // Bước 7 — Trả lỗi về client
        // Ở version đơn giản: coi mọi lỗi là 400 (bad request)
        res.status(400).json({
            message: error.message
        })
    }
}