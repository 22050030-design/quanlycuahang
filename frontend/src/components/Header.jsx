import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { productAPI } from '../services/api'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState(null)
  const [show, setShow] = useState(false)
  const wrapperRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const q = query.trim()
    if (!q) {
      setSuggestions(null)
      setShow(false)
      return
    }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await productAPI.searchSuggestions(q)
        setSuggestions(res.data)
        setShow(true)
      } catch { setShow(false) }
    }, 300)
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`)
      setShow(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">🛒 Cửa Hàng</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Sản phẩm</Link>
            </li>
          </ul>
          <div ref={wrapperRef} className="position-relative mx-2" style={{ minWidth: 260 }}>
            <form onSubmit={handleSearch} className="d-flex">
              <input
                className="form-control form-control-sm"
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => suggestions && setShow(true)}
              />
            </form>
            {show && suggestions && (
              <div className="position-absolute bg-white text-dark rounded shadow-sm mt-1 w-100"
                style={{ zIndex: 9999, maxHeight: 400, overflowY: 'auto' }}>
                {suggestions.products.length > 0 ? (
                  <>
                    <div className="px-3 py-2 small fw-bold text-secondary border-bottom">Sản phẩm gợi ý</div>
                    {suggestions.products.map(p => (
                      <Link key={p.id} to={`/products/${p.id}`}
                        className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark"
                        onClick={() => setShow(false)}>
                        <img src={p.image} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover' }}
                          className="rounded" />
                        <div className="small flex-grow-1">{p.name}</div>
                        <div className="small fw-bold text-danger">{formatPrice(p.price)}</div>
                      </Link>
                    ))}
                    {suggestions.suggestions.length > 0 && (
                      <>
                        <div className="px-3 py-2 small fw-bold text-secondary border-bottom">Gợi ý từ khóa</div>
                        {suggestions.suggestions.map((s, i) => (
                          <button key={i} className="d-block w-100 text-start px-3 py-1 small border-0 bg-transparent"
                            onClick={() => { setQuery(s); setShow(false); navigate(`/products?search=${encodeURIComponent(s)}`) }}>
                            {s}
                          </button>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 small text-muted">Không tìm thấy sản phẩm phù hợp</div>
                    <div className="px-3 py-2 small fw-bold text-secondary border-bottom">Có phải bạn muốn tìm:</div>
                    {suggestions.categories.slice(0, 3).map(c => (
                      <button key={c.id} className="d-block w-100 text-start px-3 py-1 small border-0 bg-transparent"
                        onClick={() => { setQuery(''); setShow(false); navigate(`/products?category=${c.id}`) }}>
                        Danh mục: {c.name}
                      </button>
                    ))}
                    <div className="px-3 py-2 small fw-bold text-secondary border-bottom mt-1">Sản phẩm hot</div>
                    {suggestions.hotProducts.map(p => (
                      <Link key={p.id} to={`/products/${p.id}`}
                        className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark"
                        onClick={() => setShow(false)}>
                        <img src={p.image} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover' }}
                          className="rounded" />
                        <div className="small flex-grow-1">{p.name}</div>
                        <div className="small fw-bold text-danger">{formatPrice(p.price)}</div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">🛒 Giỏ hàng</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">Đơn hàng</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Hồ sơ</Link>
                </li>
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link text-warning fw-bold" to="/admin">Admin</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="nav-link btn btn-link text-white" onClick={handleLogout}>Đăng xuất</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Đăng nhập</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Đăng ký</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
