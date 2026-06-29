import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'

export default function Reviews() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    adminAPI.getReviews().then(res => setReviews(res.data))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa đánh giá này?')) return
    try {
      await adminAPI.deleteReview(id)
      setReviews(reviews.filter(r => r.id !== id))
    } catch { }
  }

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Quản lý đánh giá</h2>
      {reviews.length === 0 ? (
        <p className="text-muted">Chưa có đánh giá nào</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sản phẩm</th>
                <th>Người dùng</th>
                <th>Đánh giá</th>
                <th>Nội dung</th>
                <th>Ngày</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.Product?.name}</td>
                  <td>{r.User?.name}</td>
                  <td>{'⭐'.repeat(r.rating)}</td>
                  <td>{r.comment}</td>
                  <td>{new Date(r.created_at).toLocaleDateString('vi-VN')}</td>
                  <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Xóa</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
