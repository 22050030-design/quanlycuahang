import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { productAPI } from '../services/api'

export default function SearchBar({ initialValue = '', onSearch, className = '' }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialValue)
  const [suggestions, setSuggestions] = useState(null)
  const [show, setShow] = useState(false)
  const wrapperRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShow(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const q = query.trim()
    if (!q) { setSuggestions(null); setShow(false); return }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await productAPI.searchSuggestions(q)
        setSuggestions(res.data)
        setShow(true)
      } catch { setShow(false) }
    }, 300)
  }, [query])

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setShow(false)
    if (onSearch) onSearch(q)
    else navigate(`/products?search=${encodeURIComponent(q)}`)
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  return (
    <div ref={wrapperRef} className={`position-relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <input className="form-control" type="search" placeholder="Tìm kiếm sản phẩm..."
          value={query} onChange={e => setQuery(e.target.value)}
          onFocus={() => suggestions && setShow(true)} />
      </form>
      {show && suggestions && (
        <div className="position-absolute bg-white text-dark rounded shadow-sm mt-1 w-100"
          style={{ zIndex: 9999, maxHeight: 400, overflowY: 'auto', border: '1px solid rgba(0,0,0,.1)' }}>
          {suggestions.products.length > 0 ? (
            <>
              <div className="px-3 py-2 small fw-bold text-secondary border-bottom">Sản phẩm gợi ý</div>
              {suggestions.products.map(p => (
                <Link key={p.id} to={`/products/${p.id}`}
                  className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark"
                  onClick={() => setShow(false)}>
                  <img src={p.image} alt={p.name}
                    style={{ width: 36, height: 36, objectFit: 'cover' }} className="rounded" />
                  <div className="small flex-grow-1">{p.name}</div>
                  <div className="small fw-bold text-danger">{formatPrice(p.price)}</div>
                </Link>
              ))}
              {suggestions.suggestions.length > 0 && (
                <>
                  <div className="px-3 py-2 small fw-bold text-secondary border-bottom">Gợi ý từ khóa</div>
                  {suggestions.suggestions.map((s, i) => (
                    <button key={i}
                      className="d-block w-100 text-start px-3 py-1 small border-0 bg-transparent"
                      onClick={() => { setShow(false); navigate(`/products?search=${encodeURIComponent(s)}`) }}>
                      {s}
                    </button>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              <div className="px-3 py-2 small text-muted">Không tìm thấy sản phẩm</div>
              <div className="px-3 py-2 small fw-bold text-secondary border-bottom">Có phải bạn muốn tìm:</div>
              {suggestions.categories.slice(0, 3).map(c => (
                <button key={c.id}
                  className="d-block w-100 text-start px-3 py-1 small border-0 bg-transparent"
                  onClick={() => { setShow(false); navigate(`/products?category=${c.id}`) }}>
                  Danh mục: {c.name}
                </button>
              ))}
              <div className="px-3 py-2 small fw-bold text-secondary border-bottom mt-1">Sản phẩm hot</div>
              {suggestions.hotProducts.map(p => (
                <Link key={p.id} to={`/products/${p.id}`}
                  className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark"
                  onClick={() => setShow(false)}>
                  <img src={p.image} alt={p.name}
                    style={{ width: 36, height: 36, objectFit: 'cover' }} className="rounded" />
                  <div className="small flex-grow-1">{p.name}</div>
                  <div className="small fw-bold text-danger">{formatPrice(p.price)}</div>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
