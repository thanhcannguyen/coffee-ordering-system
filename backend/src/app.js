
import express from 'express'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import categoryRoute from './routes/category.route.js'
import productRoute from './routes/product.route.js'
import cartRoute from "./routes/cart.route.js"

// import middleware CORS để cho phép frontend gọi API backend
// thư viện giúp backend cho phép request từ domain khác (frontend)
import cors from 'cors'

const app = express()

//  Cho phép frontend (React) gọi API backend
app.use(cors({
    origin: 'http://localhost:5173',    //  chỉ cho phép FE này gọi
    credentials: true                   //  cho phép gửi token / cookie
}))


// Middleware — parse body JSON
// Phải có trước khi khai báo route
// Không có dòng này → req.body sẽ là undefined
// Cho phép đọc dữ liệu JSON từ request (req.body)
app.use(express.json())


// Routes
// Mọi request đến /api/auth/... sẽ vào authRoute
// Route auth: /api/auth/*
app.use('/api/auth', authRoute)

// Route user: /api/users/*
app.use('/api/users', userRoute)

// Route category: /api/categories/*
app.use('/api/categories', categoryRoute)

// Route product: /api/product/*
app.use('/api/products', productRoute)

// Route cart: /api/cart/*
app.use("/api/cart", cartRoute);

// Route không tồn tại — bắt 404
app.use((req, res) => {
    res.status(404).json({ message: `Không tìm thấy route: ${req.originalUrl}` })
})

export default app
