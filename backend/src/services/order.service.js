
import Order from '../models/order.model.js'
import Cart from '../models/cart.model.js'

// ================================================================
// SERVICE 1 — Tạo đơn hàng từ giỏ hàng
// POST /api/orders
// ================================================================
export const createOrderService = async (userId, orderData) => {
    const { paymentMethod, shippingInfo, note } = orderData

    // 1. Tìm cart của user + populate thông tin product
    const cart = await Cart.findOne({ user: userId }).populate({
        path: 'items.product',
        select: 'name price image isAvailable',
    })

    // 2. Kiểm tra cart có tồn tại không
    if (!cart) {
        throw new Error('Giỏ hàng không tồn tại')
    }

    // 3. Kiểm tra cart có item không
    if (!cart.items || cart.items.length === 0) {
        throw new Error('Giỏ hàng đang trống')
    }

    // Kiểm tra thêm: tất cả product vẫn còn available không
    const unavailable = cart.items.filter(item => !item.product?.isAvailable)
    if (unavailable.length > 0) {
        const names = unavailable.map(i => i.product?.name).join(', ')
        throw new Error(`Sản phẩm không còn bán: ${names}`)
    }

    // 4. Tạo orderItems theo Snapshot pattern
    // Lưu lại name, price, image tại thời điểm đặt
    // Sau này admin đổi giá/tên thì đơn hàng cũ vẫn hiển thị đúng
    const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,     // snapshot
        price: item.price,            // dùng price trong cart (đã snapshot từ lúc thêm)
        image: item.product.image,    // snapshot
        quantity: item.quantity,
    }))

    // 5. Tính lại totalAmount ở backend
    // Không tin vào totalAmount từ client — tính lại để đảm bảo chính xác
    const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    )

    // 6. Tạo order mới
    const order = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount,
        paymentMethod: paymentMethod || 'COD',
        shippingInfo,
        note: note || '',
    })

    // 7. Clear cart sau khi tạo order thành công
    // Dùng trực tiếp thay vì gọi clearCartService để tránh circular import
    cart.items = []
    cart.totalAmount = 0
    await cart.save()

    // 8. Return order
    return order
}

// ================================================================
// SERVICE 2 — Lấy danh sách đơn hàng của user đang login
// GET /api/orders/my
// ================================================================
export const getMyOrdersService = async (userId) => {

    // 1. Tìm orders theo userId
    // 2. Sort mới nhất trước (-1 = descending)
    // 3. Không populate product vì đã có snapshot name/price/image
    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .select('-__v') // bỏ field __v không cần thiết

    // 4. Return danh sách orders
    return orders
}

// ================================================================
// SERVICE 3 — Lấy chi tiết một đơn hàng
// GET /api/orders/:id
// ================================================================
export const getOrderByIdService = async (orderId, user) => {

    // 1. Tìm order theo orderId + populate thông tin user cơ bản
    const order = await Order.findById(orderId)
        .populate('user', 'name email phone')
        .select('-__v')

    // 2. Nếu không có order → báo lỗi
    if (!order) {
        throw new Error('Không tìm thấy đơn hàng')
    }

    // 3. Nếu user không phải admin → kiểm tra order.user có trùng user._id không
    if (user.role !== 'admin') {
        // 4. Nếu không trùng → báo lỗi không có quyền
        if (order.user._id.toString() !== user._id.toString()) {
            throw new Error('Bạn không có quyền xem đơn hàng này')
        }
    }

    // 5. Return order
    return order
}

// ================================================================
// SERVICE 4 — Admin lấy toàn bộ đơn hàng
// GET /api/orders
// ================================================================
export const getAllOrdersService = async () => {

    // 1. Lấy toàn bộ orders
    // 2. Populate thông tin user để admin biết ai đặt
    // 3. Sort mới nhất trước
    const orders = await Order.find()
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .select('-__v')

    // 4. Return danh sách orders
    return orders
}

// ================================================================
// SERVICE 5 — Admin cập nhật trạng thái đơn hàng
// PUT /api/orders/:id/status
// ================================================================
export const updateOrderStatusService = async (orderId, status) => {

    // 1. Khai báo danh sách status hợp lệ
    const validStatuses = ['pending', 'confirmed', 'preparing', 'completed', 'cancelled']

    // 2. Kiểm tra status gửi lên có hợp lệ không
    if (!validStatuses.includes(status)) {
        throw new Error(`Trạng thái không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(', ')}`)
    }

    // 3. Tìm order theo orderId
    const order = await Order.findById(orderId)

    // 4. Nếu không có order → báo lỗi
    if (!order) {
        throw new Error('Không tìm thấy đơn hàng')
    }

    // Kiểm tra thêm: không cho cập nhật đơn đã hoàn thành hoặc đã hủy
    if (order.status === 'completed') {
        throw new Error('Không thể cập nhật đơn hàng đã hoàn thành')
    }
    if (order.status === 'cancelled') {
        throw new Error('Không thể cập nhật đơn hàng đã hủy')
    }

    // 5. Cập nhật order.status
    order.status = status

    // 6. Save order
    await order.save()

    // 7. Return order mới
    return order
}