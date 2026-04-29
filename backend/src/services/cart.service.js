
import Cart from "../models/cart.model.js"

// hàm lấy giỏ hàng (cart)
const getCartService = async (userId) => {
    // tìm giỏ hàng (cart) theo userId và populate thông tin product
    const cart = await Cart.findOne({ user: userId }).populate({
        path: "items.product",                  // đường dẫn tới product trong items
        select: "name price image category"     // chỉ lấy các field cần thiết
    })

    // Nếu chưa có giỏ hàng thì trả về giỏ hàng rỗng
    if (!cart) {
        return {
            user: userId,
            items: [],
            totalAmount: 0
        }
    }
    // Nếu có thì trả về giỏ hàng
    return cart
}

// export hàm để controller gọi được
export { getCartService }
