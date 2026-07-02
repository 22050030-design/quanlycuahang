const { User, Category, Product, Order, OrderDetail, Review } = require('../models');
const { Op } = require('sequelize');

exports.getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    const orderCount = await Order.count({ where: { user_id: user.id } });
    const totalSpent = await Order.sum('total_amount', {
      where: { user_id: user.id, status: { [Op.in]: ['completed', 'shipping', 'confirmed'] } },
    });
    res.json({ ...user.toJSON(), order_count: orderCount, total_spent: totalSpent || 0 });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    user.is_active = !user.is_active;
    await user.save();
    res.json({ message: 'Cập nhật trạng thái thành công', is_active: user.is_active });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['created_at', 'DESC']] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });
    }
    const category = await Category.create({ name, description });
    res.status(201).json({ message: 'Tạo danh mục thành công', category });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    const { name, description } = req.body;
    if (name) {
      const existing = await Category.findOne({ where: { name, id: { [Op.ne]: req.params.id } } });
      if (existing) {
        return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });
      }
      category.name = name;
    }
    if (description !== undefined) category.description = description;
    await category.save();
    res.json({ message: 'Cập nhật thành công', category });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    await category.destroy();
    res.json({ message: 'Xóa danh mục thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    const products = await Product.findAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category_id } = req.body;
    let image = req.body.image || null;
    if (req.file) {
      image = 'uploads/products/' + req.file.filename;
    }
    const product = await Product.create({ name, description, price, image, quantity, category_id });
    res.status(201).json({ message: 'Tạo sản phẩm thành công', product });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    const { name, description, price, image, quantity, category_id, status } = req.body;
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price) product.price = price;
    if (req.file) {
      product.image = 'uploads/products/' + req.file.filename;
    } else if (image !== undefined) {
      product.image = image;
    }
    if (quantity !== undefined) product.quantity = quantity;
    if (category_id) product.category_id = category_id;
    if (status) product.status = status;
    await product.save();
    res.json({ message: 'Cập nhật thành công', product });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    await product.destroy();
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status && ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'].includes(status)) {
      where.status = status;
    }
    const orders = await Order.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: OrderDetail, include: [{ model: Product, attributes: ['id', 'name', 'image'] }] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'phone'] },
        { model: OrderDetail, include: [{ model: Product, attributes: ['id', 'name', 'image', 'price'] }] },
      ],
    });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    order.status = status;
    await order.save();
    res.json({ message: 'Cập nhật trạng thái thành công', order });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('total_amount', {
      where: { status: { [Op.in]: ['completed', 'shipping', 'confirmed'] } },
    });
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue || 0,
      pendingOrders,
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { quantity: { [Op.lt]: 5 } },
      include: [{ model: Category, attributes: ['id', 'name'] }],
      order: [['quantity', 'ASC']],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await require('../models').Setting.findAll();
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { Setting } = require('../models');
    const entries = Object.entries(req.body);
    for (const [key, value] of entries) {
      await Setting.upsert({ key, value });
    }
    const settings = await Setting.findAll();
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json({ message: 'Cập nhật thành công', settings: result });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Product, attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    await review.destroy();
    res.json({ message: 'Xóa đánh giá thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
