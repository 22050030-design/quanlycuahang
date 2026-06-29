import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    adminAPI.getDashboard().then(res => setData(res.data))
  }, [])

  if (!data) return <div className="text-center p-5">Đang tải...</div>

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Quản trị hệ thống</h2>
        <div>
          <Link to="/admin/products" className="btn btn-primary me-2">Quản lý sản phẩm</Link>
          <Link to="/admin/orders" className="btn btn-info">Quản lý đơn hàng</Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Tổng sản phẩm</h5>
              <h2>{data.totalProducts}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Tổng người dùng</h5>
              <h2>{data.totalUsers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5>Tổng đơn hàng</h5>
              <h2>{data.totalOrders}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5>Chờ xác nhận</h5>
              <h2>{data.pendingOrders}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h5>Doanh thu</h5>
              <h2>{formatPrice(data.totalRevenue)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5>Liên kết nhanh</h5>
              <div className="d-flex flex-wrap gap-2 mt-3">
                <Link to="/admin/users" className="btn btn-outline-secondary">Người dùng</Link>
                <Link to="/admin/categories" className="btn btn-outline-secondary">Danh mục</Link>
                <Link to="/admin/low-stock" className="btn btn-outline-danger">Sắp hết hàng</Link>
                <Link to="/admin/reviews" className="btn btn-outline-secondary">Đánh giá</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
