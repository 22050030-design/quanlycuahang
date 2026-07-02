import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { FaArrowLeft, FaShoppingCart, FaTruck, FaMoneyBillWave } from 'react-icons/fa'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    adminAPI.getOrderById(id).then(res => { setOrder(res.data); setNewStatus(res.data.status) })
  }, [id])

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  const statusMap = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao hàng',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  }

  const statusStyle = {
    pending: { background: '#fff3e0', color: '#e65100' },
    confirmed: { background: '#e3f2fd', color: '#1565c0' },
    shipping: { background: '#e8eaf6', color: '#283593' },
    completed: { background: '#e8f5e9', color: '#2e7d32' },
    cancelled: { background: '#ffebee', color: '#c62828' },
  }

  const updateStatus = async () => {
    try {
      await adminAPI.updateOrderStatus(id, newStatus)
      const res = await adminAPI.getOrderById(id)
      setOrder(res.data)
      setNewStatus(res.data.status)
      alert('Cập nhật trạng thái thành công')
    } catch (err) {
      alert('Lỗi')
    }
  }

  if (!order) return <div className="text-center p-5">Đang tải...</div>

  return (
    <div className="container-fluid py-4">
      <style>{`
        .detail-table { border-radius: 12px; overflow: hidden; }
        .detail-table thead th { background: #f5f5f5; color: #37474f; font-weight: 600; font-size: .85rem; border-bottom: none; padding: .75rem 1rem; }
        .detail-table tbody td { padding: .75rem 1rem; vertical-align: middle; }
      `}</style>

      <Link to="/admin/orders" className="btn mb-3 d-inline-flex align-items-center"
        style={{ borderRadius: 8, background: '#f5f5f5', color: '#37474f', fontWeight: 500 }}>
        <FaArrowLeft className="me-2" /> Quay lại
      </Link>

      <div className="card" style={{ border: 'none', borderRadius: 16 }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h4 className="fw-bold" style={{ color: '#1a237e' }}><FaShoppingCart className="me-2" />Đơn hàng #{order.id}</h4>
              <div className="d-flex align-items-center gap-2 mt-2">
                <span className="fw-semibold">Trạng thái:</span>
                <select className="form-select w-auto" style={{ borderRadius: 8, fontSize: '.9rem' }}
                  value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                {newStatus !== order.status && (
                  <button className="btn" style={{ borderRadius: 8, background: '#1565c0', color: '#fff' }}
                    onClick={updateStatus}>Cập nhật</button>
                )}
              </div>
            </div>
            <span style={{ borderRadius: 10, padding: '.4rem 1rem', fontSize: '.9rem', fontWeight: 600, ...statusStyle[order.status] }}>
              {statusMap[order.status]}
            </span>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="p-3" style={{ background: '#f5f5f5', borderRadius: 12 }}>
                <h6 className="fw-bold mb-2" style={{ color: '#37474f' }}>Thông tin khách hàng</h6>
                <div className="small">
                  <div><strong>Họ tên:</strong> {order.User?.name}</div>
                  <div><strong>Email:</strong> {order.User?.email}</div>
                  <div><strong>Số điện thoại:</strong> {order.phone || order.User?.phone}</div>
                  <div><strong>Địa chỉ:</strong> {order.shipping_address}</div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3" style={{ background: '#f5f5f5', borderRadius: 12 }}>
                <h6 className="fw-bold mb-2" style={{ color: '#37474f' }}>Thông tin đơn hàng</h6>
                <div className="small">
                  <div><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString('vi-VN')}</div>
                  <div><strong>Thanh toán:</strong> {order.payment_method === 'cod' ? 'COD' : order.payment_method}</div>
                </div>
              </div>
            </div>
          </div>

          <table className="table detail-table bg-white shadow-sm">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.OrderDetails?.map(detail => (
                <tr key={detail.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={detail.Product?.image} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }} />
                      <span className="fw-semibold">{detail.Product?.name}</span>
                    </div>
                  </td>
                  <td>{formatPrice(detail.price)}</td>
                  <td>{detail.quantity}</td>
                  <td className="fw-bold" style={{ color: '#2e7d32' }}>{formatPrice(detail.price * detail.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />
          <div className="d-flex justify-content-end align-items-center gap-2">
            <span className="fw-bold" style={{ fontSize: '1.1rem', color: '#37474f' }}>Tổng cộng:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c62828' }}>{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
