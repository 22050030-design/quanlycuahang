import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { FaExclamationTriangle, FaBox } from 'react-icons/fa'

export default function LowStock() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    adminAPI.getLowStockProducts().then(res => setProducts(res.data))
  }, [])

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  return (
    <div className="container-fluid py-4">
      <style>{`
        .admin-table { border-radius: 12px; overflow: hidden; }
        .admin-table thead th { background: #f5f5f5; color: #37474f; font-weight: 600; font-size: .85rem; border-bottom: none; padding: .75rem 1rem; }
        .admin-table tbody td { padding: .75rem 1rem; vertical-align: middle; }
      `}</style>

      <div className="d-flex align-items-center gap-2 mb-4">
        <FaExclamationTriangle style={{ fontSize: '1.5rem', color: '#e65100' }} />
        <h2 className="fw-bold mb-0" style={{ color: '#e65100' }}>Sản phẩm sắp hết hàng</h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5">
          <FaBox style={{ fontSize: '3rem', color: '#ccc' }} />
          <p className="text-muted mt-3">Không có sản phẩm nào sắp hết hàng</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table admin-table table-hover bg-white shadow-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Cảnh báo</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className="fw-bold">{p.id}</td>
                  <td><img src={p.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} /></td>
                  <td>{p.name}</td>
                  <td><span style={{ borderRadius: 8, padding: '.2rem .6rem', fontSize: .8, background: '#e8eaf6', color: '#283593' }}>{p.Category?.name}</span></td>
                  <td style={{ color: '#2e7d32', fontWeight: 600 }}>{formatPrice(p.price)}</td>
                  <td style={{ color: '#c62828', fontWeight: 700, fontSize: '1.1rem' }}>{p.quantity}</td>
                  <td><span style={{ borderRadius: 8, padding: '.25rem .7rem', fontSize: .8, fontWeight: 600, background: '#ffebee', color: '#c62828' }}>Sắp hết hàng</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
