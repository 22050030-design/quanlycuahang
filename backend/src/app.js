require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'API is running' });
});

const { sequelize, Setting } = require('./models');

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(async () => {
    console.log('Database connected');
    await Setting.sync();
    const count = await Setting.count();
    if (count === 0) {
      await Setting.bulkCreate([
        { key: 'site_name', value: 'Website bán đồ gia dụng' },
        { key: 'site_address', value: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh' },
        { key: 'site_phone', value: '0123 456 789' },
        { key: 'site_email', value: 'info@dodunggiadung.vn' },
        { key: 'site_url', value: 'https://quanlycuahang-chi.vercel.app/' },
        { key: 'copyright_text', value: 'Website bán đồ gia dụng' },
        { key: 'social_facebook', value: 'https://facebook.com' },
        { key: 'social_twitter', value: 'https://twitter.com' },
        { key: 'social_youtube', value: 'https://youtube.com' },
        { key: 'social_instagram', value: 'https://instagram.com' },
      ]);
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without DB)`);
    });
  });
