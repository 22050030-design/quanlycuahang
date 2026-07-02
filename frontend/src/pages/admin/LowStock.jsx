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
    <div className="container-fluid py-4" style={{ background: '#121212', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        .admin-table { border-radius: 12px; overflow: hidden; }
        .admin-table thead th { background: #1e1e1e; color: #ccc; font-weight: 600; font-size: .85rem; border-bottom: 1px solid #333; padding: .75rem 1rem; }
        .admin-table tbody td { padding: .75rem 1rem; vertical-align: middle; background: #1a1a1a; color: #ddd; border-bottom: 1px solid #2a2a2a; }
        .admin-table tbody tr:hover td { background: #252525; }
      `}</style>

      <div className="d-flex align-items-center gap-2 mb-4">
        <FaExclamationTriangle style={{ fontSize: '1.5rem', color: '#ffcc80' }} />
        <h2 className="fw-bold mb-0" style={{ color: '#ffcc80' }}>Sản phẩm sắp hết hàng</h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5">
          <FaBox style={{ fontSize: '3rem', color: '#555' }} />
          <p className="mt-3" style={{ color: '#888' }}>Không có sản phẩm nào sắp hết hàng</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table admin-table shadow-sm">
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
                  <td><span style={{ borderRadius: 8, padding: '.2rem .6rem', background: '#333', color: '#fff', fontWeight: 600, fontSize: '.8rem' }}>{p.Category?.name}</span></td>
                  <td style={{ color: '#a5d6a7', fontWeight: 600 }}>{formatPrice(p.price)}</td>
                  <td style={{ color: '#ef9a9a', fontWeight: 700, fontSize: '1.1rem' }}>{p.quantity}</td>
                  <td><span style={{ borderRadius: 8, padding: '.25rem .7rem', fontSize: '.8rem', fontWeight: 600, background: '#4a1515', color: '#ef9a9a' }}>Sắp hết hàng</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
