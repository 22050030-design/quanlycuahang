import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cartAPI } from '../../services/api'

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const navigate = useNavigate()

  useEffect(() => { loadCart() }, [])

  const loadCart = async () => {
    try {
      const res = await cartAPI.get()
      setCart(res.data)
    } catch { }
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  const handleUpdate = async (id, qty) => {
    try {
      await cartAPI.update({ id, quantity: qty })
      loadCart()
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi')
    }
  }

  const handleRemove = async (id) => {
    try {
      await cartAPI.remove(id)
      loadCart()
    } catch { }
  }

  if (cart.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Giỏ hàng trống</h3>
        <Link to="/products" className="btn btn-primary mt-3">Mua sắm ngay</Link>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Giỏ hàng</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>{formatPrice(item.price)}</td>
                <td style={{ width: 120 }}>
                  <div className="input-group input-group-sm">
                    <button className="btn btn-outline-secondary" onClick={() => handleUpdate(item.id, item.quantity - 1)}>-</button>
                    <input className="form-control text-center" value={item.quantity} readOnly />
                    <button className="btn btn-outline-secondary" onClick={() => handleUpdate(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                  </div>
                </td>
                <td className="fw-bold">{formatPrice(item.price * item.quantity)}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Tổng cộng: <span className="text-danger">{formatPrice(cart.total)}</span></h4>
        <button className="btn btn-success btn-lg" onClick={() => navigate('/checkout')}>Đặt hàng</button>
      </div>
    </div>
  )
}
