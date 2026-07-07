# Hệ thống Quản lý Cửa hàng Trực tuyến

Hệ thống quản lý bán hàng trực tuyến với kiến trúc 3 tầng (Frontend - Backend - Database), dễ triển khai trên nền tảng Cloud.

## Công nghệ sử dụng

- **Frontend:** React 18 + Vite + Bootstrap 5
- **Backend:** Node.js + Express + Sequelize ORM
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Token)

## Cấu trúc thư mục

```
quanlycuahang/
├── README.md
├── .gitignore
├── backend/                 # API server
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js           # Entry point
│       ├── seed.js          # Script seed dữ liệu
│       ├── config/database.js
│       ├── models/          # 8 models (User, Category, Product, Cart, CartItem, Order, OrderDetail, Review)
│       ├── controllers/     # auth, product, cart, order, review, admin
│       ├── middleware/      # auth.js, adminAuth.js
│       └── routes/          # authRoutes, productRoutes, cartRoutes, orderRoutes, reviewRoutes, adminRoutes
└── frontend/                # Giao diện người dùng
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── components/      # Header, Footer, ProtectedRoute, AdminRoute
        ├── pages/user/      # 10 trang người dùng
        ├── pages/admin/     # 7 trang quản trị
        ├── services/api.js  # Kết nối API
        └── context/AuthContext.jsx
```

## Database (8 bảng)

| Bảng | Mô tả |
|------|-------|
| `users` | Người dùng (khách hàng + admin) |
| `categories` | Danh mục sản phẩm |
| `products` | Sản phẩm |
| `carts` | Giỏ hàng |
| `cart_items` | Chi tiết giỏ hàng |
| `orders` | Đơn hàng |
| `order_details` | Chi tiết đơn hàng |
| `reviews` | Đánh giá sản phẩm |

## Chức năng chính

### Người dùng (User)
1. Đăng ký tài khoản
2. Đăng nhập / Đăng xuất
3. Quản lý hồ sơ cá nhân
4. Xem danh sách sản phẩm
5. Tìm kiếm sản phẩm
6. Lọc sản phẩm theo danh mục
7. Sắp xếp sản phẩm (giá, mới nhất)
8. Xem chi tiết sản phẩm
9. Thêm vào giỏ hàng
10. Cập nhật giỏ hàng
11. Đặt hàng (COD)
12. Xem lịch sử đơn hàng
13. Hủy đơn hàng (khi chưa xác nhận)
14. Đánh giá sản phẩm

### Quản trị viên (Admin)
1. Dashboard thống kê
2. Quản lý người dùng (khóa/mở khóa, xem chi tiết)
3. Quản lý danh mục (CRUD)
4. Quản lý sản phẩm (CRUD + tìm kiếm)
5. Quản lý đơn hàng (xem, lọc theo trạng thái)
6. Cập nhật trạng thái đơn hàng
7. Xem sản phẩm sắp hết hàng
8. Quản lý đánh giá

## Hướng dẫn cài đặt

### Yêu cầu
- Node.js >= 18
- MySQL >= 5.7
- npm

### 1. Clone repository
```bash
git clone https://github.com/your-username/quanlycuahang.git
cd quanlycuahang
```

### 2. Cài đặt dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Cấu hình môi trường

```bash
# Backend
cp backend/.env.example backend/.env
# Sửa file .env với thông tin database của bạn

# Frontend
cp frontend/.env.example frontend/.env
```

### 4. Tạo database

```bash
# Tạo database bằng MySQL
mysql -u root -p < database/schema.sql

# Thêm dữ liệu mẫu
mysql -u root -p quanlycuahang < database/seed.sql

# Hoặc dùng seed script (tự động hash password)
cd backend
node src/seed.js
```

### 5. Chạy ứng dụng

```bash
# Terminal 1: Backend (port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (port 5173)
cd frontend
npm run dev
```

### 6. Truy cập

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health check:** http://localhost:5000/api/health

### 7. Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | admin@shop.com | admin123 |
| User | user@shop.com | user123 |

## API Endpoints

### User API
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| POST | /api/auth/register | Đăng ký |
| POST | /api/auth/login | Đăng nhập |
| GET | /api/auth/profile | Xem hồ sơ |
| PUT | /api/auth/profile | Cập nhật hồ sơ |
| GET | /api/products | Danh sách sản phẩm |
| GET | /api/products/:id | Chi tiết sản phẩm |
| POST | /api/cart/add | Thêm vào giỏ |
| GET | /api/cart | Xem giỏ hàng |
| PUT | /api/cart/update | Cập nhật giỏ |
| DELETE | /api/cart/remove/:id | Xóa khỏi giỏ |
| POST | /api/orders | Đặt hàng |
| GET | /api/orders/my-orders | Lịch sử đơn hàng |
| GET | /api/orders/:id | Chi tiết đơn hàng |
| PUT | /api/orders/:id/cancel | Hủy đơn hàng |
| POST | /api/reviews | Đánh giá sản phẩm |

### Admin API
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| GET | /api/admin/dashboard | Thống kê |
| GET | /api/admin/users | Danh sách người dùng |
| GET | /api/admin/users/:id | Chi tiết người dùng |
| PUT | /api/admin/users/:id/toggle-status | Khóa/Mở khóa |
| GET/POST/PUT/DELETE | /api/admin/categories | CRUD danh mục |
| GET/POST/PUT/DELETE | /api/admin/products | CRUD sản phẩm |
| GET | /api/admin/orders | Danh sách đơn hàng |
| GET | /api/admin/orders/:id | Chi tiết đơn hàng |
| PUT | /api/admin/orders/:id/status | Cập nhật trạng thái |
| GET | /api/admin/low-stock-products | Sản phẩm sắp hết hàng |
| GET/DELETE | /api/admin/reviews | Quản lý đánh giá |

### System API
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| GET | /api/health | Kiểm tra server |

## Triển khai Cloud

Xem hướng dẫn chi tiết tại [docs/Cloud_Deployment.md](docs/Cloud_Deployment.md)

## Tài liệu API

Xem chi tiết tại [docs/API_Documentation.md](docs/API_Documentation.md)

## Test Cases

Xem danh sách test cases tại [docs/Test_Cases.md](docs/Test_Cases.md)

## Hướng phát triển

Các chức năng có thể phát triển trong tương lai:
- Thanh toán online (VNPay, Momo)
- Quản lý vận chuyển
- Chat realtime
- Gửi email OTP
- Upload ảnh lên Cloudinary
- Thông báo realtime
- AI gợi ý sản phẩm
- Quên mật khẩu

## License

MIT
