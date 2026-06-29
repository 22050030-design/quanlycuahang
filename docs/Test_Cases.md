# Test Cases

## 1. Chức năng User

### TC-01: Đăng ký tài khoản thành công
- **Bước:** Điền đầy đủ thông tin hợp lệ
- **Mong đợi:** Đăng ký thành công, chuyển về trang chủ
- **Thực tế:** 

### TC-02: Đăng ký với email đã tồn tại
- **Bước:** Nhập email đã được đăng ký trước đó
- **Mong đợi:** Thông báo "Email đã được đăng ký"

### TC-03: Đăng nhập thành công (User)
- **Bước:** Nhập email và mật khẩu đúng
- **Mong đợi:** Đăng nhập thành công, chuyển về trang chủ

### TC-04: Đăng nhập thành công (Admin)
- **Bước:** Nhập admin@shop.com / admin123
- **Mong đợi:** Đăng nhập thành công, chuyển đến /admin

### TC-05: Đăng nhập sai mật khẩu
- **Bước:** Nhập sai mật khẩu
- **Mong đợi:** Thông báo "Email hoặc mật khẩu không đúng"

### TC-06: Xem danh sách sản phẩm
- **Bước:** Vào trang /products
- **Mong đợi:** Hiển thị danh sách sản phẩm

### TC-07: Tìm kiếm sản phẩm
- **Bước:** Nhập "áo" vào ô tìm kiếm
- **Mong đợi:** Hiển thị sản phẩm liên quan đến áo

### TC-08: Lọc sản phẩm theo danh mục
- **Bước:** Chọn danh mục "Điện tử"
- **Mong đợi:** Chỉ hiển thị sản phẩm điện tử

### TC-09: Sắp xếp sản phẩm
- **Bước:** Chọn "Giá thấp đến cao"
- **Mong đợi:** Sản phẩm sắp xếp tăng dần theo giá

### TC-10: Xem chi tiết sản phẩm
- **Bước:** Click vào một sản phẩm
- **Mong đợi:** Hiển thị thông tin chi tiết và đánh giá

### TC-11: Thêm sản phẩm vào giỏ hàng
- **Bước:** Click "Thêm vào giỏ hàng"
- **Mong đợi:** Thông báo thành công

### TC-12: Xem giỏ hàng
- **Bước:** Vào trang /cart
- **Mong đợi:** Hiển thị danh sách sản phẩm và tổng tiền

### TC-13: Cập nhật số lượng trong giỏ hàng
- **Bước:** Tăng/giảm số lượng
- **Mong đợi:** Cập nhật thành tiền và tổng tiền

### TC-14: Xóa sản phẩm khỏi giỏ hàng
- **Bước:** Click "Xóa"
- **Mong đợi:** Sản phẩm bị xóa khỏi giỏ

### TC-15: Đặt hàng thành công
- **Bước:** Điền thông tin và click "Đặt hàng"
- **Mong đợi:** Thông báo thành công, chuyển đến chi tiết đơn hàng

### TC-16: Đặt hàng khi giỏ trống
- **Bước:** Vào /checkout khi giỏ trống
- **Mong đợi:** Chuyển về /cart

### TC-17: Xem lịch sử đơn hàng
- **Bước:** Vào /orders
- **Mong đợi:** Danh sách đơn hàng đã đặt

### TC-18: Hủy đơn hàng (khi đang pending)
- **Bước:** Click "Hủy đơn hàng"
- **Mong đợi:** Đơn hàng chuyển sang trạng thái "Đã hủy"

### TC-19: Hủy đơn hàng (khi đã confirmed)
- **Bước:** Thử hủy đơn đã xác nhận
- **Mong đợi:** Thông báo lỗi

### TC-20: Đánh giá sản phẩm
- **Bước:** Chọn số sao, nhập nội dung, gửi
- **Mong đợi:** Đánh giá hiển thị trong chi tiết sản phẩm

### TC-21: Cập nhật hồ sơ cá nhân
- **Bước:** Sửa thông tin và lưu
- **Mong đợi:** Thông báo cập nhật thành công

---

## 2. Chức năng Admin

### TC-22: Xem Dashboard
- **Bước:** Vào /admin
- **Mong đợi:** Hiển thị thống kê tổng quan

### TC-23: Quản lý người dùng
- **Bước:** Vào /admin/users
- **Mong đợi:** Hiển thị danh sách người dùng

### TC-24: Xem chi tiết người dùng
- **Bước:** Click "Xem" ở một người dùng
- **Mong đợi:** Modal hiển thị thông tin chi tiết

### TC-25: Khóa/Mở khóa người dùng
- **Bước:** Click "Khóa" hoặc "Mở khóa"
- **Mong đợi:** Cập nhật trạng thái thành công

### TC-26: Thêm danh mục mới
- **Bước:** Nhập tên, mô tả và lưu
- **Mong đợi:** Danh mục xuất hiện trong danh sách

### TC-27: Sửa danh mục
- **Bước:** Sửa tên danh mục và lưu
- **Mong đợi:** Thông tin được cập nhật

### TC-28: Xóa danh mục
- **Bước:** Xóa một danh mục
- **Mong đợi:** Danh mục bị xóa khỏi danh sách

### TC-29: Thêm sản phẩm mới
- **Bước:** Nhập đầy đủ thông tin sản phẩm
- **Mong đợi:** Sản phẩm xuất hiện trong danh sách

### TC-30: Sửa sản phẩm
- **Bước:** Sửa thông tin sản phẩm
- **Mong đợi:** Thông tin được cập nhật

### TC-31: Xóa sản phẩm
- **Bước:** Xóa một sản phẩm
- **Mong đợi:** Sản phẩm bị xóa

### TC-32: Tìm kiếm sản phẩm (admin)
- **Bước:** Nhập từ khóa vào ô tìm kiếm
- **Mong đợi:** Lọc sản phẩm theo tên

### TC-33: Xem danh sách đơn hàng (admin)
- **Bước:** Vào /admin/orders
- **Mong đợi:** Danh sách đơn hàng

### TC-34: Lọc đơn hàng theo trạng thái
- **Bước:** Chọn trạng thái "Chờ xác nhận"
- **Mong đợi:** Chỉ hiển thị đơn hàng chờ xác nhận

### TC-35: Cập nhật trạng thái đơn hàng
- **Bước:** Chọn trạng thái mới và click "Cập nhật"
- **Mong đợi:** Trạng thái thay đổi

### TC-36: Xem sản phẩm sắp hết hàng
- **Bước:** Vào /admin/low-stock
- **Mong đợi:** Danh sách sản phẩm có số lượng < 5

### TC-37: Xem đánh giá sản phẩm
- **Bước:** Vào /admin/reviews
- **Mong đợi:** Danh sách đánh giá

### TC-38: Xóa đánh giá
- **Bước:** Click "Xóa" ở một đánh giá
- **Mong đợi:** Đánh giá bị xóa

---

## 3. Kiểm thử API (Backend)

### TC-39: Kiểm tra health check
```bash
curl https://quanlycuahang-api.onrender.com/api/health
```
**Mong đợi:** Status 200, trả về JSON

### TC-40: Kiểm tra CORS
- **Bước:** Gọi API từ domain khác
- **Mong đợi:** CORS headers hiển thị đúng

### TC-41: Kiểm tra xác thực JWT
- **Bước:** Gọi API /api/cart không có token
- **Mong đợi:** Status 401

### TC-42: Kiểm tra phân quyền Admin
- **Bước:** Gọi API admin với token user thường
- **Mong đợi:** Status 403

---

## 4. Kiểm thử nghiệp vụ

### TC-43: Kiểm tra tồn kho khi đặt hàng
- **Bước:** Đặt số lượng lớn hơn tồn kho
- **Mong đợi:** Thông báo lỗi

### TC-44: Kiểm tra trừ tồn kho sau đặt hàng
- **Bước:** Đặt hàng thành công, kiểm tra số lượng sản phẩm
- **Mong đợi:** Số lượng giảm đúng số đã đặt

### TC-45: Kiểm tra hoàn tồn kho khi hủy đơn
- **Bước:** Hủy đơn hàng, kiểm tra số lượng sản phẩm
- **Mong đợi:** Số lượng được hoàn lại

### TC-46: Kiểm tra phân quyền User/Admin
- **Bước:** User không vào được /admin
- **Mong đợi:** Chuyển hướng về trang chủ
