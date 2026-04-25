
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'               // Import thư viện bcryptjs để mã hóa (hash) mật khẩu
import nodemailer from 'nodemailer'         // Import thư viện nodemailer để gửi email từ backend


// Hàm có nhiệm vụ gửi email otp
const sendOTPEmail = async (email, otp) => {
    // Tạo transporter = cấu hình "người gửi email"
    // Hiểu đơn giản: backend dùng tài khoản Gmail này để gửi email đi
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // EMAIL_USER lấy từ file .env
            // Ví dụ: EMAIL_USER=myshop@gmail.com
            user: process.env.EMAIL_USER,

            // EMAIL_PASS là Gmail App Password
            // Không dùng mật khẩu Gmail thường
            pass: process.env.EMAIL_PASS, // Gmail App Password, không phải pass thường
        },
    })

    // Gửi email thật
    await transporter.sendMail({
        // Tên người gửi hiển thị trong email
        from: `"Shop" <${process.env.EMAIL_USER}>`,

        // Email người nhận, chính là email user đăng ký
        to: email,

        // Tiêu đề email
        subject: 'Mã xác minh đăng ký tài khoản',

        // Nội dung email dạng HTML
        html: `
            <h3>Mã xác minh của bạn</h3>
            <p>Nhập mã sau để hoàn tất đăng ký:</p>
            <h1 style="letter-spacing: 8px">${otp}</h1>
            <p>Mã có hiệu lực trong <strong>10 phút</strong>.</p>
            <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
        `,
    })
}


// controller xử lý các API
//  1. Đăng ký user 
export const register = async (req, res) => {
    try {
        // Bước 1 — Lấy dữ liệu từ req.body
        // Lấy ra name, email, password từ request client gửi lên
        const { name, email, password } = req.body

        //Bước 2 — Validate đầu vào
        // 2.1  Kiểm tra có thiếu field nào không
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin",
            })
        }
        // 2.2 Kiểm tra format email hợp lệ không
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Email không đúng định dạng"
            })
        }
        // 2.3 Kiểm tra password đủ 6 ký tự không
        if (password.length < 6) {
            return res.status(400).json({
                message: " Mật khẩu phải ít nhất 6 kí tự"
            })
        }

        // Bước 3 — Kiểm tra email đã tồn tại chưa
        // Query DB bằng findOne({email})
        // Nếu đã có → trả về lỗi 400 ngay
        const existEmail = await User.findOne({ email })
        if (existEmail) {
            return res.status(400).json({
                message: "Email đã tồn tại"
            })
        }

        // Bước 4 — Hash password
        //   Dùng bcrypt.hash() trước khi lưu
        //   Không bao giờ lưu password gốc
        const hashedPassword = await bcrypt.hash(password, 10)

        // Bước 5 — Tạo OTP và thời hạn hết hạn
        //   Tạo mã 6 số ngẫu nhiên, hết hạn sau 10 phút
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        // Math.random() * 900000 → số từ 0 đến 899999
        // + 100000               → số từ 100000 đến 999999 (luôn đủ 6 chữ số)
        // .toString()            → "084729" giữ nguyên số 0 đầu nếu có

        const otpExpire = new Date(Date.now() + 10 * 60 * 1000)
        // Date.now()        → thời điểm hiện tại (milliseconds)
        // 10 * 60 * 1000    → 10 phút tính bằng milliseconds
        // new Date(...)     → chuyển thành kiểu Date để lưu vào MongoDB


        // Bước 6 - Lưu user vào DB
        await User.create({
            name,
            email,
            password: hashedPassword,
            emailOTP: otp,
            emailOTPExpire: otpExpire,
            isEmailVerified: false
        })

        // Bước 7 - Gửi OTP đến email người dùng
        // làm sau khi lưu DB thành công

        await sendOTPEmail(email, otp)

        // Bước 8 - Trả response về client 
        res.status(200).json({
            success: true,
            message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác minh.',
        })

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi Server",
            error: error.message
        })
    }
}


// controller : Xác minh OTP
// POST /api/auth/verify-email
export const verifyEmail = async (req, res) => {
    try {
        // Bước 1 — Lấy email và OTP từ request
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({
                message: 'Vui lòng cung cấp email và mã xác minh',
            })
        }
        // Bước 2 — Tìm user, lấy thêm OTP (bị ẩn mặc định)
        const user = await User.findOne({ email }).select('+emailOTP +emailOTPExpire')

        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy tài khoản với email này',
            })
        }
        // Bước 3 — Kiểm tra tài khoản đã verify chưa
        // Tránh verify 2 lần
        if (user.isEmailVerified) {
            return res.status(400).json({
                message: 'Email này đã được xác minh trước đó',
            })
        }
        // Bước 4 — Kiểm tra OTP có đúng không
        if (user.emailOTP !== otp) {
            return res.status(400).json({
                message: 'Mã xác minh không đúng',
            })
        }
        // Bước 5 — Kiểm tra OTP có hết hạn chưa
        if (user.emailOTPExpire < Date.now()) {
            return res.status(400).json({
                message: 'Mã xác minh đã hết hạn, vui lòng đăng ký lại',
            })
        }
        // Bước 6 — Xác minh thành công
        // Active tài khoản + xóa OTP khỏi DB
        await User.findByIdAndUpdate(user._id, {
            isEmailVerified: true,
            emailOTP: undefined, // xóa — không cần giữ lại
            emailOTPExpire: undefined, // xóa — không cần giữ lại
        })
        // Bước 7 — Trả response
        res.status(200).json({
            success: true,
            message: 'Xác minh email thành công, bạn có thể đăng nhập ngay bây giờ',
        })

    } catch (error) {
        console.error('Lỗi verifyEmail:', error)
        res.status(500).json({
            message: 'Lỗi server, vui lòng thử lại sau',
        })
    }
}