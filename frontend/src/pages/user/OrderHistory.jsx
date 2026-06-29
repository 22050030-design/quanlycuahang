import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderAPI } from '../../services/api'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    orderAPI.getMyOrders().then(res => setOrders(res.data))
  }, [])

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  const statusMap = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao hàng',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  }

  const statusClass = {
    pending: 'warning',
    confirmed: 'info',
    shipping: 'primary',
    completed: 'success',
    cancelled: 'danger',
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Đơn hàng của tôi</h2>
      {orders.length === 0 ? (
        <p className="text-muted">Chưa có đơn hàng nào</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="fw-bold">{formatPrice(order.total_amount)}</td>
                  <td><span className={`badge bg-${statusClass[order.status]}`}>{statusMap[order.status]}</span></td>
                  <td><Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary">Chi tiết</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
