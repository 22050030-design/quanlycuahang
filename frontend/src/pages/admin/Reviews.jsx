import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { FaStar, FaTrash } from 'react-icons/fa'

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
    <div className="container-fluid py-4" style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <style>{`
        .admin-table { border-radius: 12px; overflow: hidden; }
        .admin-table thead th { background: #f5f5f5; color: #37474f; font-weight: 600; font-size: .85rem; border-bottom: none; padding: .75rem 1rem; }
        .admin-table tbody td { padding: .75rem 1rem; vertical-align: middle; }
        .btn-rounded { border-radius: 8px; font-size: .8rem; padding: .3rem .8rem; font-weight: 500; }
      `}</style>

      <div className="d-flex align-items-center gap-2 mb-4">
        <FaStar style={{ fontSize: '1.5rem', color: '#f9a825' }} />
        <h2 className="fw-bold mb-0" style={{ color: '#1a237e' }}>Quản lý đánh giá</h2>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-5">
          <FaStar style={{ fontSize: '3rem', color: '#ccc' }} />
          <p className="text-muted mt-3">Chưa có đánh giá nào</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table admin-table table-hover bg-white shadow-sm">
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
                  <td className="fw-bold">{r.id}</td>
                  <td>{r.Product?.name}</td>
                  <td>{r.User?.name}</td>
                  <td style={{ color: '#f9a825' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                  <td style={{ color: '#555', maxWidth: 250 }} className="text-truncate">{r.comment}</td>
                  <td style={{ fontSize: '.85rem', color: '#666' }}>{new Date(r.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button className="btn btn-rounded" style={{ background: '#ffebee', color: '#c62828' }} onClick={() => handleDelete(r.id)}>
                      <FaTrash className="me-1" /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
