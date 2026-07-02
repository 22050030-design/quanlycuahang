import { NavLink } from 'react-router-dom'
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaTag, FaExclamationTriangle, FaStar } from 'react-icons/fa'

export default function AdminLayout({ children }) {
  const linkClass = ({ isActive }) =>
    `d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded-3 small ${isActive ? 'bg-white bg-opacity-10 text-white fw-bold' : 'text-white-50'}`

  return (
      <div className="d-flex" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <div className="d-flex flex-column flex-shrink-0 p-3" style={{ width: 250, background: '#1e1e1e' }}>
        <div className="d-flex align-items-center gap-2 mb-4 px-2">
          <span style={{ fontSize: '1.2rem' }}>⚙️</span>
          <span className="fw-bold text-white" style={{ fontSize: '1rem' }}>Admin Panel</span>
        </div>

        <span className="px-2 mb-1" style={{ fontSize: '.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Điều hướng</span>
        <NavLink to="/admin" end className={linkClass}><FaTachometerAlt /> Dashboard</NavLink>
        <NavLink to="/admin/products" className={linkClass}><FaBox /> Quản lý sản phẩm</NavLink>
        <NavLink to="/admin/orders" className={linkClass}><FaShoppingCart /> Quản lý đơn hàng</NavLink>

        <hr className="my-3" style={{ borderColor: '#333' }} />
        <span className="px-2 mb-1" style={{ fontSize: '.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Liên kết nhanh</span>
        <NavLink to="/admin/users" className={linkClass}><FaUsers /> Người dùng</NavLink>
        <NavLink to="/admin/categories" className={linkClass}><FaTag /> Danh mục</NavLink>
        <NavLink to="/admin/low-stock" className={linkClass}><FaExclamationTriangle /> Sắp hết hàng</NavLink>
        <NavLink to="/admin/reviews" className={linkClass}><FaStar /> Đánh giá</NavLink>
      </div>

      <div className="flex-grow-1 p-4" style={{ overflowX: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
