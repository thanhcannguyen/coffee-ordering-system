
// import service xử lý logic giỏ hàng
import { getCartService } from "../services/cart.service.js"

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
