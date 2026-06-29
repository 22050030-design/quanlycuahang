const { Cart, CartItem, Product } = require('../models');

exports.add = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    let cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id });
    }
    const existing = await CartItem.findOne({
      where: { cart_id: cart.id, product_id },
    });
    if (existing) {
      existing.quantity += quantity || 1;
      existing.price = product.price;
      await existing.save();
    } else {
      await CartItem.create({
        cart_id: cart.id,
        product_id,
        quantity: quantity || 1,
        price: product.price,
      });
    }
    res.json({ message: 'Đã thêm vào giỏ hàng' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{ model: CartItem, include: [Product] }],
    });
    if (!cart) return res.json({ items: [], total: 0 });
    const items = cart.CartItems.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      name: item.Product.name,
      image: item.Product.image,
      price: parseFloat(item.price),
      quantity: item.quantity,
      stock: item.Product.quantity,
    }));
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items, total });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const item = await CartItem.findByPk(id, {
      include: [{ model: Cart }],
    });
    if (!item || item.Cart.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ' });
    }
    if (quantity <= 0) {
      await item.destroy();
    } else {
      item.quantity = quantity;
      await item.save();
    }
    res.json({ message: 'Cập nhật giỏ hàng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id, {
      include: [{ model: Cart }],
    });
    if (!item || item.Cart.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ' });
    }
    await item.destroy();
    res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
