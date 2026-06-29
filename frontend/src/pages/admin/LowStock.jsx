import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'

export default function LowStock() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    adminAPI.getLowStockProducts().then(res => setProducts(res.data))
  }, [])

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-danger">Sản phẩm sắp hết hàng</h2>
      {products.length === 0 ? (
        <p className="text-muted">Không có sản phẩm nào sắp hết hàng</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
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
                  <td>{p.id}</td>
                  <td><img src={p.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} /></td>
                  <td>{p.name}</td>
                  <td>{p.Category?.name}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td className="text-danger fw-bold">{p.quantity}</td>
                  <td><span className="badge bg-danger">Sắp hết hàng</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
