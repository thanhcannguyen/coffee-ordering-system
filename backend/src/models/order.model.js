import mongoose from 'mongoose'

// Schema cho từng sản phẩm trong đơn hàng
// Dùng Snapshot pattern — lưu lại thông tin tại thời điểm đặt
// Lý do: sau này admin sửa giá/tên/ảnh thì đơn hàng cũ vẫn hiển thị đúng
const orderItemSchema = new mongoose.Schema({

    // Vẫn giữ ref để có thể navigate sang ProductDetail nếu cần
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },

    // Snapshot tên — không bị ảnh hưởng khi admin đổi tên sản phẩm
    name: {
        type: String,
        required: true,
    },

    // Snapshot giá — không bị ảnh hưởng khi admin đổi giá
    price: {
        type: Number,
        required: true,
        min: 0,
    },

    // Snapshot ảnh — để hiển thị lại trong lịch sử đơn hàng
    // Không required vì product có thể không có ảnh
    image: {
        type: String,
        default: '',
    },

    // Số lượng khách đặt
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },

}, { _id: false })
// _id: false — item không cần ID riêng
// vì không bao giờ query item độc lập, chỉ query qua order

// ================================================================
// Schema chính cho 1 đơn hàng
// ================================================================
const orderSchema = new mongoose.Schema({

    // Người đặt hàng
    // index: true — vì getMyOrders query theo field này liên tục
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },

    // Danh sách sản phẩm — phải có ít nhất 1
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: (items) => items.length > 0,
            message: 'Đơn hàng phải có ít nhất 1 sản phẩm',
        },
    },

    // Tổng tiền — tính từ items lúc tạo order, không tính lại sau
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },

    // Trạng thái đơn hàng — flow một chiều:
    // pending → confirmed → preparing → completed
    //         ↘ cancelled (chỉ từ pending hoặc confirmed)
    // index: true — vì admin hay filter theo status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'completed', 'cancelled'],
        default: 'pending',
        index: true,
    },

    // Phương thức thanh toán
    paymentMethod: {
        type: String,
        enum: ['COD', 'BANKING', 'MOMO', 'VNPAY'],
        default: 'COD',
    },

    // Thông tin giao hàng — snapshot từ profile user lúc đặt
    // Lý do snapshot: user có thể đổi địa chỉ sau khi đặt
    shippingInfo: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },

    // Ghi chú thêm của khách
    note: {
        type: String,
        default: '',
    },

}, {
    timestamps: true, // tự thêm createdAt, updatedAt
})

const Order = mongoose.model('Order', orderSchema)

export default Order