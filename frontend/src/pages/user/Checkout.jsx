import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartAPI, orderAPI, authAPI } from '../../services/api'

export default function Checkout() {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' })
  const navigate = useNavigate()

  useEffect(() => {
    cartAPI.get().then(res => { if (res.data.items.length === 0) navigate('/cart'); setCart(res.data) })
    authAPI.getProfile().then(res => setProfile(res.data))
  }, [])

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await orderAPI.create({
        name: profile.name,
        phone: profile.phone,
        shipping_address: profile.address,
        payment_method: 'cod',
      })
      alert('Đặt hàng thành công!')
      navigate(`/orders/${res.data.order_id}`)
    } catch (err) {
      alert(err.response?.data?.message || 'Đặt hàng thất bại')
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Đặt hàng</h2>
      <div className="row g-4">
        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
              <h5>Thông tin giao hàng</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Người đặt</label>
                  <input className="form-control" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input className="form-control" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Địa chỉ giao hàng</label>
                  <textarea className="form-control" rows="2" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Phương thức thanh toán</label>
                  <input className="form-control" value="Thanh toán khi nhận hàng (COD)" disabled />
                </div>
                <button type="submit" className="btn btn-success w-100">Đặt hàng</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-body">
              <h5>Đơn hàng</h5>
              {cart.items.map(item => (
                <div key={item.id} className="d-flex justify-content-between mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Tổng cộng</span>
                <span className="text-danger">{formatPrice(cart.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
