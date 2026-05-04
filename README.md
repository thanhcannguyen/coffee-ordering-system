# ☕ Coffee Ordering System

Hệ thống đặt hàng cà phê trực tuyến được xây dựng theo kiến trúc **Full-stack** với **React + Vite** (frontend) và **Node.js + Express + MongoDB** (backend). Dự án bao gồm đầy đủ luồng từ đăng ký tài khoản, xác minh email OTP, duyệt menu, giỏ hàng, đặt hàng cho đến quản trị hệ thống.

---

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cài đặt và chạy dự án](#-cài-đặt-và-chạy-dự-án)
- [Biến môi trường](#-biến-môi-trường)
- [API Reference](#-api-reference)
- [Mô hình dữ liệu](#-mô-hình-dữ-liệu)
- [Phân quyền](#-phân-quyền)
- [Luồng hoạt động](#-luồng-hoạt-động)

---

## ✨ Tính năng

### 👤 Người dùng (User)
- Đăng ký tài khoản với xác minh email qua mã OTP (6 số, hết hạn sau 5 phút)
- Đăng nhập / Đăng xuất, tự động duy trì phiên đăng nhập qua JWT
- Xem menu sản phẩm, lọc theo danh mục
- Xem chi tiết sản phẩm
- Quản lý giỏ hàng: thêm, cập nhật số lượng, xóa từng sản phẩm, xóa toàn bộ
- Đặt hàng với thông tin giao hàng, lựa chọn phương thức thanh toán (COD, Banking)
- Xem lịch sử đơn hàng và chi tiết từng đơn
- Cập nhật hồ sơ cá nhân (tên, số điện thoại, địa chỉ)

### 🔧 Quản trị viên (Admin)
- Dashboard tổng quan
- Quản lý danh mục: thêm, sửa, xóa, bật/tắt
- Quản lý sản phẩm: thêm, sửa, xóa, bật/tắt trạng thái còn bán
- Quản lý đơn hàng: xem tất cả đơn, cập nhật trạng thái
- Quản lý người dùng: xem danh sách, bật/tắt tài khoản

### 🛡️ Bảo mật
- Mật khẩu được hash bằng **bcryptjs** (salt rounds: 10)
- Xác thực API bằng **JWT** (hết hạn sau 7 ngày)
- Middleware phân quyền theo role (`user` / `admin`)
- OTP email được xóa khỏi DB sau khi xác minh thành công
- `password`, `emailOTP` được ẩn (`select: false`) khi query

---

## 🛠 Công nghệ sử dụng

### Backend
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| Node.js (ESM) | - | Runtime |
| Express | ^5.2.1 | Web framework |
| Mongoose | ^9.4.1 | ODM cho MongoDB |
| bcryptjs | ^3.0.3 | Hash mật khẩu |
| jsonwebtoken | ^9.0.3 | Tạo và xác thực JWT |
| nodemailer | ^8.0.6 | Gửi email OTP qua Gmail |
| cors | ^2.8.6 | Cho phép cross-origin request |
| dotenv | ^17.4.2 | Quản lý biến môi trường |
| morgan | ^1.10.1 | HTTP request logger |
| nodemon | ^3.1.14 | Auto-reload khi dev |

### Frontend
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| React | ^19.2.4 | UI framework |
| React DOM | ^19.2.4 | DOM rendering |
| React Router DOM | ^7.14.1 | Client-side routing |
| Axios | ^1.15.0 | HTTP client |
| Tailwind CSS | ^4.2.2 | Utility-first CSS |
| Vite | ^8.0.4 | Build tool |

### Database
- **MongoDB Atlas** — Cloud database

---

## 📁 Cấu trúc dự án

```
coffee-ordering-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # Kết nối MongoDB
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # Đăng ký, xác minh OTP, đăng nhập
│   │   │   ├── cart.controller.js      # Giỏ hàng
│   │   │   ├── category.controller.js  # Danh mục
│   │   │   ├── order.controller.js     # Đơn hàng
│   │   │   ├── product.controller.js   # Sản phẩm
│   │   │   └── user.controller.js      # Người dùng
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js      # protect (JWT) + restrictTo (role)
│   │   ├── models/
│   │   │   ├── cart.model.js           # Schema giỏ hàng
│   │   │   ├── category.model.js       # Schema danh mục
│   │   │   ├── order.model.js          # Schema đơn hàng
│   │   │   ├── product.model.js        # Schema sản phẩm
│   │   │   └── user.model.js           # Schema người dùng
│   │   ├── routes/
│   │   │   ├── auth.route.js           # /api/auth/*
│   │   │   ├── cart.route.js           # /api/cart/*
│   │   │   ├── category.route.js       # /api/categories/*
│   │   │   ├── order.route.js          # /api/orders/*
│   │   │   ├── product.route.js        # /api/products/*
│   │   │   └── user.route.js           # /api/users/*
│   │   ├── services/
│   │   │   ├── cart.service.js         # Business logic giỏ hàng
│   │   │   └── order.service.js        # Business logic đơn hàng
│   │   ├── app.js                      # Khởi tạo Express, đăng ký middleware & routes
│   │   └── server.js                   # Entry point, kết nối DB và start server
│   ├── .env                            # Biến môi trường (không commit)
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js        # Axios với baseURL & auth header tự động
    │   │   ├── cartApi.js
    │   │   ├── categoryApi.js
    │   │   ├── orderApi.js
    │   │   ├── productApi.js
    │   │   └── userApi.js
    │   ├── assets/
    │   │   └── hero.png
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── Pagination.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── Topbar.jsx
    │   │   └── user/
    │   │       ├── Footer.jsx
    │   │       └── Header.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx         # Quản lý token + user toàn app
    │   │   └── CartContext.jsx         # Quản lý giỏ hàng toàn app
    │   ├── layouts/
    │   │   ├── AdminLayout.jsx         # Layout admin (Sidebar + Topbar)
    │   │   └── UserLayout.jsx          # Layout user (Header + Footer)
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── Categories.jsx
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Orders.jsx
    │   │   │   ├── Products.jsx
    │   │   │   └── Users.jsx
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   └── VerifyEmail.jsx
    │   │   └── user/
    │   │       ├── Cart.jsx
    │   │       ├── Checkout.jsx
    │   │       ├── Menu.jsx
    │   │       ├── OrderDetail.jsx
    │   │       ├── Orders.jsx
    │   │       ├── ProductDetail.jsx
    │   │       └── Profile.jsx
    │   ├── routes/
    │   │   ├── AdminRoute.jsx          # Route guard cho admin
    │   │   └── UserRoute.jsx           # Route guard cho user đã đăng nhập
    │   ├── App.jsx                     # Khai báo toàn bộ routes
    │   ├── main.jsx                    # Entry point React
    │   └── index.css                   # Global styles + Tailwind
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🏗 Kiến trúc hệ thống

```
[Browser / React App]
        │
        │  HTTP Request (Axios + Bearer Token)
        ▼
[Express Server — port 5000]
        │
        ├── Middleware: CORS, JSON parser, Morgan
        │
        ├── Routes (/api/...)
        │       │
        │       ├── auth.middleware.js (protect + restrictTo)
        │       │
        │       └── Controllers
        │               │
        │               └── Services (business logic)
        │                       │
        ▼                       ▼
[MongoDB Atlas — cloud]
```

**Luồng dữ liệu:**
1. React gọi API qua `axiosInstance` (tự động đính kèm `Authorization: Bearer <token>`)
2. Middleware `protect` xác thực JWT, tìm user trong DB, gắn `req.user`
3. Middleware `restrictTo` kiểm tra role nếu cần
4. Controller nhận request, gọi Service (nếu có) hoặc xử lý trực tiếp
5. Service thực hiện business logic, tương tác với Mongoose Models
6. Trả về JSON response về client

---

## 🚀 Cài đặt và chạy dự án

### Yêu cầu
- Node.js >= 18
- npm >= 9
- Tài khoản MongoDB Atlas (hoặc MongoDB local)
- Tài khoản Gmail với **App Password** (để gửi OTP)

### 1. Clone repository

```bash
git clone <repository-url>
cd coffee-ordering-system
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/` (xem phần [Biến môi trường](#-biến-môi-trường)):

```bash
cp .env.example .env   # nếu có file mẫu
# hoặc tạo mới và điền các giá trị
```

Chạy backend:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Backend sẽ chạy tại: `http://localhost:5000`

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## 🔧 Biến môi trường

Tạo file `backend/.env` với nội dung sau:

```env
# Server
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?appName=<appName>

# JWT
JWT_SECRET=<chuỗi ngẫu nhiên dài và phức tạp>

# Email (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Lưu ý:** `EMAIL_PASS` là **Gmail App Password**, không phải mật khẩu Gmail thông thường.  
> Cách tạo: Google Account → Security → 2-Step Verification → App passwords.

> **⚠️ Quan trọng:** Không commit file `.env` lên Git. File này đã được liệt kê trong `.gitignore`.

---

## 📡 API Reference

> Base URL: `http://localhost:5000/api`  
> Các route có 🔒 yêu cầu header: `Authorization: Bearer <token>`  
> Các route có 👑 yêu cầu role **admin**

### Auth — `/api/auth`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/register` | Đăng ký tài khoản mới, gửi OTP về email | Public |
| POST | `/verify-email` | Xác minh email bằng OTP 6 số | Public |
| POST | `/login` | Đăng nhập, nhận JWT token | Public |

**POST /register**
```json
// Request body
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "123456"
}

// Response 200
{
  "success": true,
  "message": "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác minh."
}
```

**POST /verify-email**
```json
// Request body
{
  "email": "user@example.com",
  "otp": "084729"
}
```

**POST /login**
```json
// Request body
{
  "email": "user@example.com",
  "password": "123456"
}

// Response 200
{
  "success": true,
  "token": "eyJhbGci...",
  "data": {
    "id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

### Users — `/api/users`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/` | Lấy danh sách tất cả user | 🔒 👑 Admin |
| GET | `/profile` | Lấy thông tin cá nhân | 🔒 User |
| PUT | `/profile` | Cập nhật hồ sơ cá nhân | 🔒 User |

---

### Categories — `/api/categories`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/` | Lấy tất cả danh mục | Public |
| POST | `/` | Tạo danh mục mới | 🔒 👑 Admin |
| PUT | `/:id` | Cập nhật danh mục | 🔒 👑 Admin |
| DELETE | `/:id` | Xóa danh mục | 🔒 👑 Admin |

---

### Products — `/api/products`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/` | Lấy tất cả sản phẩm | Public |
| GET | `/:id` | Lấy chi tiết sản phẩm | Public |
| POST | `/` | Tạo sản phẩm mới | 🔒 👑 Admin |
| PUT | `/:id` | Cập nhật sản phẩm | 🔒 👑 Admin |
| DELETE | `/:id` | Xóa sản phẩm | 🔒 👑 Admin |

---

### Cart — `/api/cart`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/` | Lấy giỏ hàng của user đang đăng nhập | 🔒 User |
| POST | `/` | Thêm sản phẩm vào giỏ | 🔒 User |
| PUT | `/:productId` | Cập nhật số lượng sản phẩm | 🔒 User |
| DELETE | `/:productId` | Xóa một sản phẩm khỏi giỏ | 🔒 User |
| DELETE | `/` | Xóa toàn bộ giỏ hàng | 🔒 User |

---

### Orders — `/api/orders`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/` | Tạo đơn hàng từ giỏ hàng hiện tại | 🔒 User |
| GET | `/my` | Lấy danh sách đơn hàng của mình | 🔒 User |
| GET | `/:id` | Lấy chi tiết một đơn hàng | 🔒 User / Admin |
| GET | `/` | Lấy tất cả đơn hàng | 🔒 👑 Admin |
| PUT | `/:id/status` | Cập nhật trạng thái đơn hàng | 🔒 👑 Admin |

**POST /orders — Request body**
```json
{
  "paymentMethod": "COD",
  "shippingInfo": {
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "address": "123 Nguyễn Huệ, Q.1, TP.HCM"
  },
  "note": "Ít đường, nhiều đá"
}
```

---

## 🗄 Mô hình dữ liệu

### User
```
_id, name, email, password (hashed), phone, address { street, district, city },
role (user | admin), isActive, isEmailVerified,
emailOTP (select:false), emailOTPExpire,
createdAt, updatedAt
```

### Category
```
_id, name (unique), description, isActive, createdAt, updatedAt
```

### Product
```
_id, name (unique), description, price, image, category (ref: Category),
isAvailable, createdAt, updatedAt
```

### Cart
```
_id, user (ref: User, unique), items: [ { product, quantity, price } ], 
totalAmount, createdAt, updatedAt
```
> Mỗi `user` chỉ có đúng **1 cart** (unique constraint).  
> `price` trong `items` là snapshot tại thời điểm thêm vào giỏ — không bị ảnh hưởng khi admin thay đổi giá sản phẩm sau đó.

### Order
```
_id, user (ref: User),
items: [ { product, name, price, image, quantity } ],  ← Snapshot pattern
totalAmount, status (pending | confirmed | preparing | completed | cancelled),
paymentMethod (COD | BANKING | MOMO | VNPAY),
shippingInfo { fullName, phone, address }, note,
createdAt, updatedAt
```
> **Snapshot pattern:** `name`, `price`, `image` trong `items` được sao chép tại thời điểm đặt hàng. Đảm bảo lịch sử đơn hàng luôn hiển thị đúng dù admin sau này chỉnh sửa sản phẩm.

---

## 🔐 Phân quyền

| Tài nguyên | Public | User | Admin |
|---|:---:|:---:|:---:|
| Xem menu / sản phẩm | ✅ | ✅ | ✅ |
| Xem danh mục | ✅ | ✅ | ✅ |
| Đăng ký / Đăng nhập | ✅ | - | - |
| Giỏ hàng | ❌ | ✅ | ✅ |
| Đặt hàng / Lịch sử đơn | ❌ | ✅ | ✅ |
| Hồ sơ cá nhân | ❌ | ✅ | ✅ |
| Quản lý danh mục | ❌ | ❌ | ✅ |
| Quản lý sản phẩm | ❌ | ❌ | ✅ |
| Quản lý người dùng | ❌ | ❌ | ✅ |
| Quản lý tất cả đơn hàng | ❌ | ❌ | ✅ |
| Cập nhật trạng thái đơn | ❌ | ❌ | ✅ |

**Phân quyền được xử lý bởi 2 middleware:**
- `protect` — Xác minh JWT, kiểm tra user còn tồn tại và không bị khóa trong DB
- `restrictTo('admin')` — Kiểm tra `req.user.role === 'admin'`

---

## 🔄 Luồng hoạt động

### Đăng ký & Xác minh email
```
Register → Validate → Hash password → Tạo OTP 6 số (hết hạn 10 phút)
        → Lưu User vào DB → Gửi OTP qua Gmail → Trả về 200
        
Verify Email → Tìm user → Kiểm tra OTP + hạn dùng
            → Đặt isEmailVerified = true → Xóa OTP khỏi DB
```

### Đặt hàng
```
Checkout → POST /api/orders
         → Service lấy Cart + populate Product
         → Kiểm tra sản phẩm còn bán (isAvailable)
         → Tạo Snapshot: name, price, image từ Cart
         → Tính lại totalAmount (không tin client)
         → Tạo Order → Xóa Cart → Trả về Order
```

### Trạng thái đơn hàng
```
pending → confirmed → preparing → completed
       ↘                        ↗
         cancelled (từ pending/confirmed)
```
Không thể cập nhật đơn hàng đã `completed` hoặc `cancelled`.

---

## 📝 Lưu ý phát triển

- Sử dụng **ES Modules** (`"type": "module"`) ở cả backend và frontend — luôn dùng `import/export`, không dùng `require/module.exports`
- Frontend dùng port `5173`, backend dùng port `5000`. CORS backend chỉ cho phép origin `http://localhost:5173`
- Khi deploy production, cần cập nhật `origin` trong cấu hình CORS của `app.js`
- `node_modules/` và `.env` đã được `.gitignore` — không commit lên repository
