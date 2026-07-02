import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa'

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
    pending: { background: '#4a3600', color: '#ffcc80' },
    confirmed: { background: '#0d3b66', color: '#90caf9' },
    shipping: { background: '#1a237e', color: '#9fa8da' },
    completed: { background: '#1b5e20', color: '#a5d6a7' },
    cancelled: { background: '#4a1515', color: '#ef9a9a' },
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

  if (!order) return <div className="text-center p-5" style={{ color: '#fff' }}>Đang tải...</div>

  return (
    <div className="container-fluid py-4" style={{ background: '#121212', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        .detail-table { border-radius: 12px; overflow: hidden; }
        .detail-table thead th { background: #1e1e1e; color: #ccc; font-weight: 600; font-size: .85rem; border-bottom: 1px solid #333; padding: .75rem 1rem; }
        .detail-table tbody td { padding: .75rem 1rem; vertical-align: middle; background: #1a1a1a; color: #ddd; border-bottom: 1px solid #2a2a2a; }
        .form-control-dark { background: #2a2a2a; border: 1px solid #444; color: #fff; border-radius: 8px; }
        .form-control-dark:focus { background: #333; border-color: #666; color: #fff; box-shadow: none; }
      `}</style>

      <Link to="/admin/orders" className="btn mb-3 d-inline-flex align-items-center"
        style={{ borderRadius: 8, background: '#2a2a2a', color: '#fff', fontWeight: 500, border: '1px solid #444' }}>
        <FaArrowLeft className="me-2" /> Quay lại
      </Link>

      <div className="card" style={{ border: 'none', borderRadius: 16, background: '#1e1e1e' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h4 className="fw-bold" style={{ color: '#fff' }}><FaShoppingCart className="me-2" />Đơn hàng #{order.id}</h4>
              <div className="d-flex align-items-center gap-2 mt-2">
                <span className="fw-semibold" style={{ color: '#ccc' }}>Trạng thái:</span>
                <select className="form-select form-control-dark w-auto" style={{ fontSize: '.9rem' }}
                  value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k} style={{ background: '#2a2a2a' }}>{v}</option>)}
                </select>
                {newStatus !== order.status && (
                  <button className="btn" style={{ borderRadius: 8, background: '#2a2a2a', color: '#fff', border: '1px solid #555' }}
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
              <div className="p-3" style={{ background: '#252525', borderRadius: 12 }}>
                <h6 className="fw-bold mb-2" style={{ color: '#ccc' }}>Thông tin khách hàng</h6>
                <div className="small" style={{ color: '#bbb' }}>
                  <div><strong style={{ color: '#ddd' }}>Họ tên:</strong> {order.User?.name}</div>
                  <div><strong style={{ color: '#ddd' }}>Email:</strong> {order.User?.email}</div>
                  <div><strong style={{ color: '#ddd' }}>Số điện thoại:</strong> {order.phone || order.User?.phone}</div>
                  <div><strong style={{ color: '#ddd' }}>Địa chỉ:</strong> {order.shipping_address}</div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3" style={{ background: '#252525', borderRadius: 12 }}>
                <h6 className="fw-bold mb-2" style={{ color: '#ccc' }}>Thông tin đơn hàng</h6>
                <div className="small" style={{ color: '#bbb' }}>
                  <div><strong style={{ color: '#ddd' }}>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString('vi-VN')}</div>
                  <div><strong style={{ color: '#ddd' }}>Thanh toán:</strong> {order.payment_method === 'cod' ? 'COD' : order.payment_method}</div>
                </div>
              </div>
            </div>
          </div>

          <table className="table detail-table shadow-sm">
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
                  <td className="fw-bold" style={{ color: '#a5d6a7' }}>{formatPrice(detail.price * detail.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr style={{ borderColor: '#333' }} />
          <div className="d-flex justify-content-end align-items-center gap-2">
            <span className="fw-bold" style={{ fontSize: '1.1rem', color: '#ccc' }}>Tổng cộng:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a5d6a7' }}>{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
