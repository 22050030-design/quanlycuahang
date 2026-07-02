import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { FaShoppingCart, FaEye } from 'react-icons/fa'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const params = statusFilter ? { status: statusFilter } : {}
    adminAPI.getOrders(params).then(res => setOrders(res.data))
  }, [statusFilter])

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

  return (
    <div className="container-fluid py-4">
      <style>{`
        .admin-table { border-radius: 12px; overflow: hidden; }
        .admin-table thead th { background: #f5f5f5; color: #37474f; font-weight: 600; font-size: .85rem; border-bottom: none; padding: .75rem 1rem; }
        .admin-table tbody td { padding: .75rem 1rem; vertical-align: middle; }
        .btn-rounded { border-radius: 8px; font-size: .8rem; padding: .3rem .8rem; font-weight: 500; }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#1a237e' }}><FaShoppingCart className="me-2" />Quản lý đơn hàng</h2>
        <div>
          <select className="form-select" style={{ borderRadius: 10, fontSize: '.9rem' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao hàng</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table admin-table table-hover bg-white shadow-sm">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="fw-bold">#{order.id}</td>
                <td>{order.User?.name}<br /><span style={{ fontSize: '.8rem', color: '#999' }}>{order.User?.email}</span></td>
                <td style={{ fontSize: '.85rem', color: '#666' }}>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                <td className="fw-bold" style={{ color: '#2e7d32' }}>{formatPrice(order.total_amount)}</td>
                <td><span style={{ borderRadius: 8, padding: '.25rem .7rem', fontSize: '.8rem', fontWeight: 600, ...statusStyle[order.status] }}>{statusMap[order.status]}</span></td>
                <td>
                  <Link to={`/admin/orders/${order.id}`} className="btn btn-rounded text-decoration-none d-inline-flex align-items-center"
                    style={{ background: '#e3f2fd', color: '#1565c0' }}>
                    <FaEye className="me-1" /> Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
