import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { productAPI, cartAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import SearchBar from '../../components/SearchBar'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sort, setSort] = useState('')
  const { user } = useAuth()
  const category = searchParams.get('category')

  useEffect(() => {
    productAPI.getCategories().then(res => setCategories(res.data))
  }, [])

  useEffect(() => {
    const params = {}
    if (search) params.search = search
    if (category) params.category = category
    if (sort) params.sort = sort
    productAPI.getAll(params).then(res => setProducts(res.data))
  }, [search, category, sort])

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  const handleAddToCart = async (productId) => {
    if (!user) return window.location.href = '/login'
    try {
      await cartAPI.add({ product_id: productId, quantity: 1 })
      alert('Đã thêm vào giỏ hàng')
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi')
    }
  }

  const handleSearch = (q) => {
    setSearch(q)
    setSearchParams(q ? { search: q } : {})
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Sản phẩm</h2>

      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <SearchBar initialValue={search} onSearch={handleSearch} />
        </div>
        <div className="col-md-3 mb-2">
          <select className="form-select" value={category || ''} onChange={e => { setSearchParams(e.target.value ? { category: e.target.value } : {}); window.location.href = e.target.value ? `/products?category=${e.target.value}` : '/products' }}>
            <option value="">Tất cả danh mục</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">Mặc định</option>
            <option value="price_asc">Giá thấp đến cao</option>
            <option value="price_desc">Giá cao đến thấp</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">Không tìm thấy sản phẩm</p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map(product => (
            <div className="col-6 col-md-4 col-lg-3" key={product.id}>
              <div className="card h-100 shadow-sm">
                <img src={product.image} className="card-img-top" alt={product.name} style={{ height: 200, objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{product.name}</h6>
                  <p className="text-muted small mb-1">{product.Category?.name}</p>
                  <p className="text-danger fw-bold mb-2">{formatPrice(product.price)}</p>
                  <p className="small mb-2">Còn: {product.quantity}</p>
                  <div className="mt-auto d-flex gap-2">
                    <Link to={`/products/${product.id}`} className="btn btn-sm btn-outline-secondary flex-grow-1">Chi tiết</Link>
                    <button className="btn btn-sm btn-primary" onClick={() => handleAddToCart(product.id)}>+ Giỏ</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
