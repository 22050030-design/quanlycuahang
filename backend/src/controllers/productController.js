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

exports.searchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    const result = { products: [], suggestions: [], hotProducts: [], categories: [] };

    const categories = await Category.findAll({ attributes: ['id', 'name'] });
    result.categories = categories;

    const hotProducts = await Product.findAll({
      where: { status: 'active' },
      limit: 4,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'price', 'image'],
    });
    result.hotProducts = hotProducts;

    if (q && q.trim()) {
      const term = q.trim();
      const products = await Product.findAll({
        where: { name: { [Op.like]: `%${term}%` }, status: 'active' },
        limit: 5,
        attributes: ['id', 'name', 'price', 'image'],
      });
      result.products = products;

      const allNames = await Product.findAll({
        where: { status: 'active' },
        attributes: ['name'],
      });
      const names = [...new Set(allNames.map(p => p.name))];
      const suggestions = names
        .filter(n => n.toLowerCase().includes(term.toLowerCase()) && !products.some(p => p.name === n))
        .slice(0, 5);
      result.suggestions = suggestions;
    }

    res.json(result);
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
