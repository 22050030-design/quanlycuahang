# Hướng dẫn triển khai Cloud

Hệ thống được thiết kế để dễ dàng triển khai lên các nền tảng Cloud phổ biến.

## Kiến trúc triển khai

```
[Frontend - Vercel/Netlify] --> [Backend - Render/Railway] --> [Database - Supabase/Aiven/PlanetScale]
```

---

## 1. Chuẩn bị

### 1.1. Đẩy mã nguồn lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/quanlycuahang.git
git push -u origin main
```

### 1.2. Kiểm tra file .gitignore

Đảm bảo đã có `.gitignore` với các nội dung:
- `node_modules/`
- `.env`
- `dist/`

---

## 2. Triển khai Database (MySQL Cloud)

### Option 1: Aiven (miễn phí)
1. Truy cập https://aiven.io
2. Đăng ký tài khoản
3. Tạo MySQL service (free tier)
4. Lấy thông tin kết nối (Host, Port, User, Password, Database)

### Option 2: Railway
1. Chọn MySQL starter
2. Copy connection string

### Option 3: Supabase
1. Sử dụng Supabase MySQL/PostgreSQL
2. Lấy thông tin kết nối từ Dashboard

Sau khi có database Cloud, chạy schema:
```bash
mysql -h <host> -u <user> -p <database> < database/schema.sql
mysql -h <host> -u <user> -p <database> < database/seed.sql
```

---

## 3. Triển khai Backend (Render)

### 3.1. Tạo Web Service trên Render
1. Truy cập https://render.com
2. New Web Service
3. Kết nối GitHub repository
4. Cấu hình:
   - **Name:** `quanlycuahang-api`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/app.js`
   - **Plan:** Free

### 3.2. Cấu hình biến môi trường

Thêm các biến sau trong Render Dashboard:

| Biến | Giá trị |
|------|---------|
| `PORT` | 5000 |
| `DB_HOST` | Host từ database Cloud |
| `DB_PORT` | 3306 |
| `DB_NAME` | Tên database |
| `DB_USER` | User database |
| `DB_PASSWORD` | Mật khẩu database |
| `JWT_SECRET` | Chuỗi bí mật (tự tạo) |
| `JWT_EXPIRES_IN` | 7d |
| `CLIENT_URL` | URL frontend sau khi deploy |

### 3.3. Deploy
- Render tự động deploy khi push code lên GitHub
- Hoặc bấm "Manual Deploy" > "Deploy latest commit"

Sau khi deploy, Render cấp URL dạng:
`https://quanlycuahang-api.onrender.com`

Kiểm tra:
```
https://quanlycuahang-api.onrender.com/api/health
```

---

## 4. Triển khai Frontend (Vercel)

### 4.1. Chuẩn bị
Sửa file `frontend/vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  // Không cần proxy khi deploy - dùng VITE_API_URL
})
```

### 4.2. Tạo project trên Vercel
1. Truy cập https://vercel.com
2. Add New Project
3. Import GitHub repository
4. Cấu hình:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 4.3. Cấu hình biến môi trường

| Biến | Giá trị |
|------|---------|
| `VITE_API_URL` | `https://quanlycuahang-api.onrender.com/api` |

### 4.4. Deploy
- Vercel tự động deploy khi push code
- URL dạng: `https://quanlycuahang.vercel.app`

---

## 5. Cập nhật CORS cho Backend

Trên Render, cập nhật biến `CLIENT_URL` thành:
```
CLIENT_URL=https://quanlycuahang.vercel.app
```

Hoặc dùng Wildcard cho development:
```
CLIENT_URL=*
```

---

## 6. Kiểm tra sau deploy

### Checklist:
- [ ] `/api/health` trả về `{"status": "success", "message": "API is running"}`
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập bằng admin
- [ ] Xem danh sách sản phẩm
- [ ] Thêm sản phẩm vào giỏ hàng
- [ ] Đặt hàng
- [ ] Admin cập nhật trạng thái đơn hàng
- [ ] Dashboard thống kê hiển thị đúng

---

## 7. Cập nhật mã nguồn

Khi cần cập nhật:
```bash
git add .
git commit -m "Mô tả thay đổi"
git push
```

Render và Vercel tự động deploy lại.

---

## 8. Xử lý sự cố thường gặp

| Vấn đề | Giải pháp |
|--------|-----------|
| Backend không kết nối được database | Kiểm tra biến môi trường DB, whitelist IP |
| CORS error | Kiểm tra CLIENT_URL trong .env backend |
| Frontend không gọi được API | Kiểm tra VITE_API_URL |
| 404 khi refresh trang | Cấu hình Vercel rewrite rules |
| Database timeout | Nâng cấp plan hoặc tối ưu query |
