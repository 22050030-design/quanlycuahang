-- ============================================
-- File: seed.sql
-- Mục đích: Thêm dữ liệu mẫu cho hệ thống
-- Cách dùng: Chạy sau schema.sql
-- Hoặc chạy: mysql -u root quanlycuahang < seed.sql
-- ============================================

-- Xóa dữ liệu cũ (nếu có)
DELETE FROM reviews;
DELETE FROM order_details;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM carts;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;

-- Reset auto increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;

-- Mật khẩu admin: admin123 (hash bcrypt)
INSERT INTO users (name, email, password, phone, address, role, is_active) VALUES
('Admin', 'admin@shop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0123456789', 'Hà Nội', 'admin', TRUE);

INSERT INTO categories (name, description) VALUES
('Thời trang', 'Quần áo, giày dép, phụ kiện thời trang'),
('Điện tử', 'Điện thoại, laptop, máy tính bảng, linh kiện điện tử'),
('Đồ gia dụng', 'Đồ dùng nhà bếp, nội thất, đồ trang trí'),
('Phụ kiện', 'Túi xách, đồng hồ, kính mát, trang sức'),
('Sách vở', 'Sách, vở, bút, dụng cụ học tập');

INSERT INTO products (name, description, price, image, quantity, category_id, status) VALUES
('Áo thun nam', 'Áo thun nam chất liệu cotton cao cấp, thoáng mát, phù hợp mọi hoạt động', 150000, 'https://picsum.photos/seed/ao1/400/400', 50, 1, 'active'),
('Quần jean nữ', 'Quần jean nữ ống suông thời trang, chất liệu denim bền đẹp', 350000, 'https://picsum.photos/seed/jean1/400/400', 30, 1, 'active'),
('Điện thoại iPhone 15', 'Điện thoại iPhone 15 chính hãng, dung lượng 128GB', 20000000, 'https://picsum.photos/seed/iphone1/400/400', 10, 2, 'active'),
('Laptop Dell XPS', 'Laptop Dell XPS 15 cao cấp, Intel Core i7, RAM 16GB', 35000000, 'https://picsum.photos/seed/laptop1/400/400', 5, 2, 'active'),
('Nồi cơm điện', 'Nồi cơm điện đa năng 1.8L, nấu cơm, nấu cháo, hấp', 800000, 'https://picsum.photos/seed/noicom1/400/400', 20, 3, 'active'),
('Bộ chén đĩa sứ', 'Bộ chén đĩa sứ cao cấp 12 món, sang trọng, bền đẹp', 450000, 'https://picsum.photos/seed/chen1/400/400', 15, 3, 'active'),
('Đồng hồ thông minh', 'Đồng hồ thông minh đa năng, đo nhịp tim, đếm bước chân', 2500000, 'https://picsum.photos/seed/watch1/400/400', 25, 4, 'active'),
('Ba lô du lịch', 'Ba lô du lịch chống nước 40L, nhiều ngăn tiện lợi', 650000, 'https://picsum.photos/seed/balo1/400/400', 3, 4, 'active'),
('Sách dạy nấu ăn', 'Sách dạy nấu ăn 100 món ngon từ cơ bản đến nâng cao', 120000, 'https://picsum.photos/seed/sach1/400/400', 40, 5, 'active'),
('Bút bi cao cấp', 'Bút bi cao cấp nhập khẩu, viết êm, mực đều', 50000, 'https://picsum.photos/seed/but1/400/400', 100, 5, 'active'),
('Giày thể thao nam', 'Giày thể thao nam hàng chính hãng, êm nhẹ, bền đẹp', 1200000, 'https://picsum.photos/seed/giay1/400/400', 2, 1, 'active'),
('Tai nghe Bluetooth', 'Tai nghe Bluetooth chống ồn, âm thanh chất lượng cao', 1500000, 'https://picsum.photos/seed/tai1/400/400', 8, 2, 'active');
