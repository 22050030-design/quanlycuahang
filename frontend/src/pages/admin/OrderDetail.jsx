import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'

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
      <Link to="/admin/orders" className="btn btn-outline-secondary mb-3">&larr; Quay lại</Link>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <h4>Đơn hàng #{order.id}</h4>
          </div>
          <p><strong>Khách hàng:</strong> {order.User?.name} ({order.User?.email})</p>
          <p><strong>Số điện thoại:</strong> {order.phone || order.User?.phone}</p>
          <p><strong>Địa chỉ:</strong> {order.shipping_address}</p>
          <p><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString('vi-VN')}</p>
          <p><strong>Thanh toán:</strong> {order.payment_method === 'cod' ? 'COD' : order.payment_method}</p>

          <div className="d-flex align-items-center gap-2 mb-3">
            <strong>Trạng thái:</strong>
            <select className="form-select w-auto" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            {newStatus !== order.status && (
              <button className="btn btn-primary" onClick={updateStatus}>Cập nhật</button>
            )}
          </div>

          <table className="table">
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
                      <img src={detail.Product?.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                      <span>{detail.Product?.name}</span>
                    </div>
                  </td>
                  <td>{formatPrice(detail.price)}</td>
                  <td>{detail.quantity}</td>
                  <td className="fw-bold">{formatPrice(detail.price * detail.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <div className="d-flex justify-content-end">
            <h4>Tổng cộng: <span className="text-danger">{formatPrice(order.total_amount)}</span></h4>
          </div>
        </div>
      </div>
    </div>
  )
}
