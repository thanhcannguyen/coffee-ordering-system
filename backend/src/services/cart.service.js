
import Cart from "../models/cart.model.js"
import Product from "../models/product.model.js"



// Helper — tính lại totalAmount sau mỗi thay đổi
// Tách ra helper để không lặp code ở mọi service
const calcTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0)

// Populate config dùng chung
// Chỉ khai báo 1 lần, dùng ở mọi nơi cần populate
const populateConfig = {
    path: 'items.product',
    select: 'name price image category isAvailable',
}


// hàm lấy giỏ hàng (cart)
export const getCartService = async (userId) => {
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



// Thêm sản phẩm vào giỏ hàng
export const addToCartService = async (userId, productId, quantity = 1) => {
    // 1. Tìm sản phẩm
    const product = await Product.findById(productId)
    // 2. Nếu không có hoặc ngừng bán → báo lỗi
    if (!product) {
        throw new ('Sản phẩm này không tồn tại')
    }
    if (!product.isAvailable) {
        throw new ('Sản phẩm này khôn có sẵn')
    }

    // 3. Tìm giỏ hàng của user
    let cart = await Cart.findOne({ user: userId })

    // 4. Nếu chưa có → tạo giỏ hàng
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [],
            totalAmount: 0
        })
    }
    // 5. Xem sản phẩm đã có trong giỏ chưa
    const existingItem = cart.items.find(
        item => item.product.toString() === productId.toString()
    )
    // 6. Có rồi → cộng số lượng
    if (existingItem) {
        existingItem.quantity += quantity
    } else {
        // 7. Chưa có → thêm mới
        cart.items.push({
            product: productId,
            quantity: quantity,
            price: product.price,
        })
    }

    // 8. Tính lại tổng tiền
    cart.totalAmount = calcTotal(cart.items)
    // 9. Lưu DB
    await cart.save()
    // 10. Trả cart sau khi populate
    return await cart.populate(populateConfig)

}