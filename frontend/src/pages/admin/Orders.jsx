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
    pending: { background: '#4a3600', color: '#ffcc80' },
    confirmed: { background: '#0d3b66', color: '#90caf9' },
    shipping: { background: '#1a237e', color: '#9fa8da' },
    completed: { background: '#1b5e20', color: '#a5d6a7' },
    cancelled: { background: '#4a1515', color: '#ef9a9a' },
  }

  return (
    <div className="container-fluid py-4" style={{ background: '#121212', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        .admin-table { border-radius: 12px; overflow: hidden; }
        .admin-table thead th { background: #1e1e1e; color: #ccc; font-weight: 600; font-size: .85rem; border-bottom: 1px solid #333; padding: .75rem 1rem; }
        .admin-table tbody td { padding: .75rem 1rem; vertical-align: middle; background: #1a1a1a; color: #ddd; border-bottom: 1px solid #2a2a2a; }
        .admin-table tbody tr:hover td { background: #252525; }
        .btn-rounded { border-radius: 8px; font-size: .8rem; padding: .3rem .8rem; font-weight: 500; }
        .form-control-dark { background: #2a2a2a; border: 1px solid #444; color: #fff; border-radius: 10px; }
        .form-control-dark:focus { background: #333; border-color: #666; color: #fff; box-shadow: none; }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#fff' }}><FaShoppingCart className="me-2" />Quản lý đơn hàng</h2>
        <div>
          <select className="form-select form-control-dark" style={{ fontSize: '.9rem', minWidth: 180 }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="" style={{ background: '#2a2a2a' }}>Tất cả trạng thái</option>
            <option value="pending" style={{ background: '#2a2a2a' }}>Chờ xác nhận</option>
            <option value="confirmed" style={{ background: '#2a2a2a' }}>Đã xác nhận</option>
            <option value="shipping" style={{ background: '#2a2a2a' }}>Đang giao hàng</option>
            <option value="completed" style={{ background: '#2a2a2a' }}>Hoàn thành</option>
            <option value="cancelled" style={{ background: '#2a2a2a' }}>Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table admin-table shadow-sm">
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
                <td>{order.User?.name}<br /><span style={{ fontSize: '.8rem', color: '#888' }}>{order.User?.email}</span></td>
                <td style={{ fontSize: '.85rem', color: '#888' }}>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                <td className="fw-bold" style={{ color: '#a5d6a7' }}>{formatPrice(order.total_amount)}</td>
                <td><span style={{ borderRadius: 8, padding: '.25rem .7rem', fontSize: '.8rem', fontWeight: 600, ...statusStyle[order.status] }}>{statusMap[order.status]}</span></td>
                <td>
                  <Link to={`/admin/orders/${order.id}`} className="btn btn-rounded text-decoration-none d-inline-flex align-items-center"
                    style={{ background: '#333', color: '#fff', border: '1px solid #555' }}>
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
