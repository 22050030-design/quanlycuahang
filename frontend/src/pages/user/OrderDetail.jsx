import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { orderAPI, reviewAPI } from '../../services/api'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [reviewForms, setReviewForms] = useState({})
  const [reviewMsg, setReviewMsg] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    orderAPI.getById(id).then(res => setOrder(res.data)).catch(() => {})
  }, [id])

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

  const toggleReview = (detailId) => {
    setReviewForms(prev => ({
      ...prev,
      [detailId]: prev[detailId] ? null : { rating: 5, comment: '' },
    }))
  }

  const handleReviewChange = (detailId, field, value) => {
    setReviewForms(prev => ({
      ...prev,
      [detailId]: { ...prev[detailId], [field]: value },
    }))
  }

  const handleReviewSubmit = async (detailId, productId) => {
    const form = reviewForms[detailId]
    if (!form) return
    try {
      await reviewAPI.create({ product_id: parseInt(productId), rating: parseInt(form.rating), comment: form.comment })
      setReviewMsg(prev => ({ ...prev, [detailId]: 'success' }))
      setReviewForms(prev => ({ ...prev, [detailId]: null }))
    } catch (err) {
      setReviewMsg(prev => ({ ...prev, [detailId]: err.response?.data?.message || 'Lỗi' }))
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return
    try {
      await orderAPI.cancel(id)
      const res = await orderAPI.getById(id)
      setOrder(res.data)
      alert('Hủy đơn hàng thành công')
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi hủy đơn hàng')
    }
  }

  if (!order) return <div className="text-center p-5">Đang tải...</div>

  return (
    <div className="container py-4">
      <Link to="/orders" className="btn btn-outline-secondary mb-3">&larr; Quay lại</Link>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h4>Đơn hàng #{order.id}</h4>
              <p className="text-muted">Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
              <p>Phương thức thanh toán: {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : order.payment_method}</p>
            </div>
            <div className="text-end">
              <span className={`badge bg-${statusClass[order.status]} fs-6`}>{statusMap[order.status]}</span>
              {order.status === 'pending' && (
                <div className="mt-2">
                  <button className="btn btn-sm btn-danger" onClick={handleCancel}>Hủy đơn hàng</button>
                </div>
              )}
            </div>
          </div>
          <hr />
          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                {order.status === 'completed' && <th style={{ width: 200 }}>Đánh giá</th>}
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
                  {order.status === 'completed' && (
                    <td>
                      {!reviewForms[detail.id] ? (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => toggleReview(detail.id)}>
                          Đánh giá
                        </button>
                      ) : (
                        <div>
                          {reviewMsg[detail.id] && (
                            <div className={`small ${reviewMsg[detail.id] === 'success' ? 'text-success' : 'text-danger'} mb-1`}>
                              {reviewMsg[detail.id] === 'success' ? 'Đã gửi đánh giá' : reviewMsg[detail.id]}
                            </div>
                          )}
                          {reviewForms[detail.id] && reviewMsg[detail.id] !== 'success' && (
                            <>
                              <select className="form-select form-select-sm mb-1" value={reviewForms[detail.id].rating} onChange={e => handleReviewChange(detail.id, 'rating', e.target.value)}>
                                {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} sao</option>)}
                              </select>
                              <textarea className="form-control form-control-sm mb-1" rows="2" placeholder="Nội dung..." value={reviewForms[detail.id].comment} onChange={e => handleReviewChange(detail.id, 'comment', e.target.value)}></textarea>
                              <div className="d-flex gap-1">
                                <button className="btn btn-sm btn-primary" onClick={() => handleReviewSubmit(detail.id, detail.product_id)}>Gửi</button>
                                <button className="btn btn-sm btn-secondary" onClick={() => toggleReview(detail.id)}>Hủy</button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  )}
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
