require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Product } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    const adminHashed = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@shop.com',
      password: adminHashed,
      phone: '0123456789',
      address: 'Hà Nội',
      role: 'admin',
    });
    const userHashed = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'Nguyễn Văn A',
      email: 'user@shop.com',
      password: userHashed,
      phone: '0987654321',
      address: 'TP. Hồ Chí Minh',
      role: 'user',
    });
    const categories = await Category.bulkCreate([
      { name: 'Thời trang', description: 'Quần áo, giày dép, phụ kiện thời trang' },
      { name: 'Điện tử', description: 'Điện thoại, laptop, máy tính bảng, linh kiện điện tử' },
      { name: 'Đồ gia dụng', description: 'Đồ dùng nhà bếp, nội thất, đồ trang trí' },
      { name: 'Phụ kiện', description: 'Túi xách, đồng hồ, kính mát, trang sức' },
      { name: 'Sách vở', description: 'Sách, vở, bút, dụng cụ học tập' },
    ]);
    await Product.bulkCreate([
      { name: 'Áo thun nam', description: 'Áo thun nam chất liệu cotton cao cấp', price: 150000, image: 'https://picsum.photos/seed/ao1/400/400', quantity: 50, category_id: categories[0].id },
      { name: 'Quần jean nữ', description: 'Quần jean nữ ống suông thời trang', price: 350000, image: 'https://picsum.photos/seed/jean1/400/400', quantity: 30, category_id: categories[0].id },
      { name: 'Điện thoại iPhone 15', description: 'Điện thoại iPhone 15 chính hãng', price: 20000000, image: 'https://picsum.photos/seed/iphone1/400/400', quantity: 10, category_id: categories[1].id },
      { name: 'Laptop Dell XPS', description: 'Laptop Dell XPS 15 cao cấp', price: 35000000, image: 'https://picsum.photos/seed/laptop1/400/400', quantity: 5, category_id: categories[1].id },
      { name: 'Nồi cơm điện', description: 'Nồi cơm điện đa năng 1.8L', price: 800000, image: 'https://picsum.photos/seed/noicom1/400/400', quantity: 20, category_id: categories[2].id },
      { name: 'Bộ chén đĩa sứ', description: 'Bộ chén đĩa sứ cao cấp 12 món', price: 450000, image: 'https://picsum.photos/seed/chen1/400/400', quantity: 15, category_id: categories[2].id },
      { name: 'Đồng hồ thông minh', description: 'Đồng hồ thông minh đa năng', price: 2500000, image: 'https://picsum.photos/seed/watch1/400/400', quantity: 25, category_id: categories[3].id },
      { name: 'Ba lô du lịch', description: 'Ba lô du lịch chống nước 40L', price: 650000, image: 'https://picsum.photos/seed/balo1/400/400', quantity: 3, category_id: categories[3].id },
      { name: 'Sách dạy nấu ăn', description: 'Sách dạy nấu ăn 100 món ngon', price: 120000, image: 'https://picsum.photos/seed/sach1/400/400', quantity: 40, category_id: categories[4].id },
      { name: 'Bút bi cao cấp', description: 'Bút bi cao cấp nhập khẩu', price: 50000, image: 'https://picsum.photos/seed/but1/400/400', quantity: 100, category_id: categories[4].id },
      { name: 'Giày thể thao nam', description: 'Giày thể thao nam hàng chính hãng', price: 1200000, image: 'https://picsum.photos/seed/giay1/400/400', quantity: 2, category_id: categories[0].id },
      { name: 'Tai nghe Bluetooth', description: 'Tai nghe Bluetooth chống ồn', price: 1500000, image: 'https://picsum.photos/seed/tai1/400/400', quantity: 8, category_id: categories[1].id },
    ]);
    console.log('Seed data created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}
seed();
