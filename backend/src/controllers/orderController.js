const { Order, OrderDetail, Product, Cart, CartItem } = require('../models');

exports.create = async (req, res) => {
  try {
    const { name, phone, shipping_address, payment_method } = req.body;
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{ model: CartItem, include: [Product] }],
    });
    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }
    for (const item of cart.CartItems) {
      if (item.quantity > item.Product.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${item.Product.name}" không đủ số lượng (còn ${item.Product.quantity})`,
        });
      }
    }
    const total_amount = cart.CartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const order = await Order.create({
      user_id: req.user.id,
      total_amount,
      status: 'pending',
      payment_method: payment_method || 'cod',
      shipping_address: shipping_address || '',
      phone: phone || '',
      name: name || '',
    });
    for (const item of cart.CartItems) {
      await OrderDetail.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
      await Product.update(
        { quantity: item.Product.quantity - item.quantity },
        { where: { id: item.product_id } }
      );
    }
    await CartItem.destroy({ where: { cart_id: cart.id } });
    res.status(201).json({ message: 'Đặt hàng thành công', order_id: order.id });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: OrderDetail, include: [{ model: Product, attributes: ['id', 'name', 'image'] }] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        { model: OrderDetail, include: [{ model: Product, attributes: ['id', 'name', 'image'] }] },
      ],
    });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng ở trạng thái chờ xác nhận' });
    }
    const details = await OrderDetail.findAll({ where: { order_id: order.id } });
    for (const detail of details) {
      await Product.increment({ quantity: detail.quantity }, { where: { id: detail.product_id } });
    }
    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Hủy đơn hàng thành công', order });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
