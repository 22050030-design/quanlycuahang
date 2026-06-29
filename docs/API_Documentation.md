# API Documentation

Base URL: `http://localhost:5000/api` (local) hoặc URL backend trên Cloud.

## Authentication

Tất cả API (trừ đăng ký, đăng nhập) yêu cầu token trong header:
```
Authorization: Bearer <token>
```

---

## User API

### 1. Đăng ký
**POST** `/api/auth/register`

Body:
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@email.com",
  "password": "123456",
  "phone": "0123456789",
  "address": "Hà Nội"
}
```

Response (201):
```json
{
  "message": "Đăng ký thành công",
  "token": "eyJ...",
  "user": { "id": 1, "name": "...", "email": "...", "role": "user" }
}
```

### 2. Đăng nhập
**POST** `/api/auth/login`

Body:
```json
{
  "email": "admin@shop.com",
  "password": "admin123"
}
```

Response (200):
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJ...",
  "user": { "id": 1, "name": "Admin", "email": "admin@shop.com", "role": "admin" }
}
```

### 3. Xem hồ sơ
**GET** `/api/auth/profile`

### 4. Cập nhật hồ sơ
**PUT** `/api/auth/profile`

Body:
```json
{
  "name": "Tên mới",
  "phone": "0123456789",
  "address": "Địa chỉ mới",
  "password": "mật khẩu mới (không bắt buộc)"
}
```

### 5. Danh sách sản phẩm
**GET** `/api/products`

Query params:
- `search` (tìm theo tên)
- `category` (lọc theo danh mục)
- `sort` (`price_asc`, `price_desc`, `newest`)

### 6. Chi tiết sản phẩm
**GET** `/api/products/:id`

### 7. Danh sách danh mục
**GET** `/api/products/categories`

### 8. Thêm vào giỏ hàng
**POST** `/api/cart/add`

Body:
```json
{
  "product_id": 1,
  "quantity": 2
}
```

### 9. Xem giỏ hàng
**GET** `/api/cart`

### 10. Cập nhật giỏ hàng
**PUT** `/api/cart/update`

Body:
```json
{
  "id": 1,
  "quantity": 3
}
```

### 11. Xóa khỏi giỏ hàng
**DELETE** `/api/cart/remove/:id`

### 12. Đặt hàng
**POST** `/api/orders`

Body:
```json
{
  "name": "Nguyễn Văn A",
  "phone": "0123456789",
  "shipping_address": "Hà Nội",
  "payment_method": "cod"
}
```

### 13. Lịch sử đơn hàng
**GET** `/api/orders/my-orders`

### 14. Chi tiết đơn hàng
**GET** `/api/orders/:id`

### 15. Hủy đơn hàng
**PUT** `/api/orders/:id/cancel`

Chỉ hủy được khi trạng thái là `pending`.

### 16. Đánh giá sản phẩm
**POST** `/api/reviews`

Body:
```json
{
  "product_id": 1,
  "rating": 5,
  "comment": "Sản phẩm tốt"
}
```

---

## Admin API

### 1. Dashboard
**GET** `/api/admin/dashboard`

### 2. Danh sách người dùng
**GET** `/api/admin/users`

Query: `?search=keyword`

### 3. Chi tiết người dùng
**GET** `/api/admin/users/:id`

### 4. Khóa/Mở khóa người dùng
**PUT** `/api/admin/users/:id/toggle-status`

### 5. Danh sách danh mục
**GET** `/api/admin/categories`

### 6. Thêm danh mục
**POST** `/api/admin/categories`

Body:
```json
{
  "name": "Danh mục mới",
  "description": "Mô tả"
}
```

### 7. Sửa danh mục
**PUT** `/api/admin/categories/:id`

### 8. Xóa danh mục
**DELETE** `/api/admin/categories/:id`

### 9. Danh sách sản phẩm (admin)
**GET** `/api/admin/products`

Query: `?search=keyword`

### 10. Thêm sản phẩm
**POST** `/api/admin/products`

Body:
```json
{
  "name": "Sản phẩm mới",
  "description": "Mô tả",
  "price": 100000,
  "image": "https://...",
  "quantity": 10,
  "category_id": 1,
  "status": "active"
}
```

### 11. Sửa sản phẩm
**PUT** `/api/admin/products/:id`

### 12. Xóa sản phẩm
**DELETE** `/api/admin/products/:id`

### 13. Danh sách đơn hàng (admin)
**GET** `/api/admin/orders`

Query: `?status=pending` (lọc theo trạng thái)

### 14. Chi tiết đơn hàng (admin)
**GET** `/api/admin/orders/:id`

### 15. Cập nhật trạng thái đơn hàng
**PUT** `/api/admin/orders/:id/status`

Body:
```json
{
  "status": "confirmed"
}
```

Các trạng thái: `pending`, `confirmed`, `shipping`, `completed`, `cancelled`

### 16. Sản phẩm sắp hết hàng
**GET** `/api/admin/low-stock-products`

### 17. Danh sách đánh giá
**GET** `/api/admin/reviews`

### 18. Xóa đánh giá
**DELETE** `/api/admin/reviews/:id`

---

## System API

### 19. Kiểm tra server
**GET** `/api/health`

Response:
```json
{
  "status": "success",
  "message": "API is running"
}
```

---

## Mã trạng thái đơn hàng

| Mã | Ý nghĩa |
|----|---------|
| `pending` | Chờ xác nhận |
| `confirmed` | Đã xác nhận |
| `shipping` | Đang giao hàng |
| `completed` | Hoàn thành |
| `cancelled` | Đã hủy |

## Mã lỗi HTTP

| Mã | Ý nghĩa |
|----|---------|
| 200 | Thành công |
| 201 | Tạo thành công |
| 400 | Lỗi dữ liệu đầu vào |
| 401 | Chưa đăng nhập |
| 403 | Không có quyền |
| 404 | Không tìm thấy |
| 500 | Lỗi server |
