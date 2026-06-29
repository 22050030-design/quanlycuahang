const { Review, Order, OrderDetail } = require('../models');

exports.create = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const order = await Order.findOne({
      where: { user_id: req.user.id, status: 'completed' },
      include: [{ model: OrderDetail, where: { product_id } }],
    });
    if (!order) {
      return res.status(400).json({
        message: 'Bạn chỉ có thể đánh giá sản phẩm đã mua và đã nhận hàng',
      });
    }
    const existing = await Review.findOne({
      where: { product_id, user_id: req.user.id },
    });
    if (existing) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
    }
    const review = await Review.create({
      product_id,
      user_id: req.user.id,
      rating,
      comment,
    });
    res.status(201).json({ message: 'Đánh giá thành công', review });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
