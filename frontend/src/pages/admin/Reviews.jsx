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
    <div className="container-fluid py-4" style={{ background: '#121212', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        .admin-table { border-radius: 12px; overflow: hidden; }
        .admin-table thead th { background: #1e1e1e; color: #ccc; font-weight: 600; font-size: .85rem; border-bottom: 1px solid #333; padding: .75rem 1rem; }
        .admin-table tbody td { padding: .75rem 1rem; vertical-align: middle; background: #1a1a1a; color: #ddd; border-bottom: 1px solid #2a2a2a; }
        .admin-table tbody tr:hover td { background: #252525; }
        .btn-rounded { border-radius: 8px; font-size: .8rem; padding: .3rem .8rem; font-weight: 500; }
      `}</style>

      <div className="d-flex align-items-center gap-2 mb-4">
        <FaStar style={{ fontSize: '1.5rem', color: '#ffcc80' }} />
        <h2 className="fw-bold mb-0" style={{ color: '#fff' }}>Quản lý đánh giá</h2>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-5">
          <FaStar style={{ fontSize: '3rem', color: '#555' }} />
          <p className="mt-3" style={{ color: '#888' }}>Chưa có đánh giá nào</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table admin-table shadow-sm">
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
                  <td style={{ color: '#ffcc80' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                  <td style={{ color: '#aaa', maxWidth: 250 }} className="text-truncate">{r.comment}</td>
                  <td style={{ fontSize: '.85rem', color: '#888' }}>{new Date(r.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button className="btn btn-rounded" style={{ background: '#4a1515', color: '#ef9a9a', border: 'none' }} onClick={() => handleDelete(r.id)}>
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
