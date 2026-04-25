
import express from 'express'
import authRoute from './routes/auth.route.js'

const app = express()

// Middleware — parse body JSON
// Phải có trước khi khai báo route
// Không có dòng này → req.body sẽ là undefined
app.use(express.json())


// Routes
// Mọi request đến /api/auth/... sẽ vào authRoute
app.use('/api/auth', authRoute)


// Route không tồn tại — bắt 404
app.use((req, res) => {
    res.status(404).json({ message: `Không tìm thấy route: ${req.originalUrl}` })
})

export default app
