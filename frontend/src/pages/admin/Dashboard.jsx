import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { FaBox, FaUsers, FaShoppingCart, FaClock, FaDollarSign, FaCog, FaTag, FaExclamationTriangle, FaStar } from 'react-icons/fa'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    adminAPI.getDashboard().then(res => setData(res.data))
  }, [])

  if (!data) return <div className="text-center p-5 text-white">Đang tải...</div>

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  const cards = [
    { label: 'Tổng sản phẩm', value: data.totalProducts, icon: FaBox },
    { label: 'Tổng người dùng', value: data.totalUsers, icon: FaUsers },
    { label: 'Tổng đơn hàng', value: data.totalOrders, icon: FaShoppingCart },
    { label: 'Chờ xác nhận', value: data.pendingOrders, icon: FaClock },
  ]

  return (
    <div className="container-fluid py-4" style={{ background: '#121212', minHeight: '100vh' }}>
      <style>{`
        .admin-card {
          border: none !important;
          border-radius: 16px !important;
          transition: transform .2s, box-shadow .2s;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1e1e1e !important;
        }
        .admin-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(255,255,255,.08);
        }
        .admin-stat {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.2;
          color: #fff;
        }
        .admin-label {
          font-size: .85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .5px;
          opacity: .7;
          color: #ccc;
        }
        .admin-icon-big {
          font-size: 2.8rem;
          opacity: .3;
          display: block;
          color: #fff;
        }
        .quick-link-btn {
          border-radius: 10px;
          font-size: .85rem;
          padding: .5rem 1rem;
          transition: all .2s;
          background: #2a2a2a !important;
          color: #fff !important;
        }
        .quick-link-btn:hover {
          transform: translateY(-2px);
          background: #333 !important;
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#fff' }}>Quản trị hệ thống</h2>
        <div className="d-flex gap-2">
          <Link to="/admin/products" className="btn" style={{ borderRadius: 10, background: '#2a2a2a', color: '#fff', fontWeight: 600, border: '1px solid #444' }}>
            <FaBox className="me-1" /> Quản lý sản phẩm
          </Link>
          <Link to="/admin/orders" className="btn" style={{ borderRadius: 10, background: '#2a2a2a', color: '#fff', fontWeight: 600, border: '1px solid #444' }}>
            <FaShoppingCart className="me-1" /> Quản lý đơn hàng
          </Link>
        </div>
      </div>

      <div className="row g-5 mb-5">
        {cards.map((c, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="card admin-card shadow-sm">
              <div className="text-center px-3 py-4">
                <c.icon className="admin-icon-big mb-3" />
                <div className="admin-label mb-2">{c.label}</div>
                <div className="admin-stat">{c.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-5">
        <div className="col-md-6">
          <div className="card admin-card shadow-sm" style={{ aspectRatio: 'auto', minHeight: 180 }}>
            <div className="text-center px-3 py-4 w-100">
              <FaDollarSign className="admin-icon-big mb-3" />
              <div className="admin-label mb-2">Doanh thu</div>
              <div className="admin-stat">{formatPrice(data.totalRevenue)}</div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-4" style={{ border: 'none', borderRadius: 16, height: '100%', background: '#1e1e1e' }}>
            <h6 className="fw-bold mb-3" style={{ color: '#fff' }}><FaCog className="me-2" />Liên kết nhanh</h6>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/admin/users" className="btn quick-link-btn"><FaUsers className="me-1" /> Người dùng</Link>
              <Link to="/admin/categories" className="btn quick-link-btn"><FaTag className="me-1" /> Danh mục</Link>
              <Link to="/admin/low-stock" className="btn quick-link-btn"><FaExclamationTriangle className="me-1" /> Sắp hết hàng</Link>
              <Link to="/admin/reviews" className="btn quick-link-btn"><FaStar className="me-1" /> Đánh giá</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
