const { Product, Category, Review, User, Order, OrderDetail } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const where = { status: 'active' };
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (category) {
      where.category_id = category;
    }
    let order = [['created_at', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    if (sort === 'price_desc') order = [['price', 'DESC']];
    if (sort === 'newest') order = [['created_at', 'DESC']];
    const products = await Product.findAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name'] }],
      order,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Review, include: [{ model: User, attributes: ['id', 'name'] }] },
      ],
    });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    const data = product.toJSON();
    if (req.user) {
      const order = await Order.findOne({
        where: { user_id: req.user.id, status: 'completed' },
        include: [{ model: OrderDetail, where: { product_id: req.params.id } }],
      });
      const existing = await Review.findOne({
        where: { product_id: req.params.id, user_id: req.user.id },
      });
      data.canReview = !!order && !existing;
      data.hasReviewed = !!existing;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
