import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../../services/api'
import SearchBar from '../../components/SearchBar'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    productAPI.getAll({}).then(res => setProducts(res.data))
    productAPI.getCategories().then(res => setCategories(res.data))
  }, [])

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1 className="display-4 fw-bold">Chào mừng đến với Cửa Hàng</h1>
        <p className="lead text-muted">Mua sắm trực tuyến dễ dàng và tiện lợi</p>
      </div>
      <div className="row justify-content-center mb-5">
        <div className="col-md-6">
          <SearchBar />
        </div>
      </div>

      <section className="mb-5">
        <h2 className="mb-4">Danh mục sản phẩm</h2>
        <div className="row g-3">
          {categories.map(cat => (
            <div className="col-6 col-md-4 col-lg-2" key={cat.id}>
              <Link to={`/products?category=${cat.id}`} className="text-decoration-none">
                <div className="card text-center h-100 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-title text-dark">{cat.name}</h6>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Sản phẩm nổi bật</h2>
          <Link to="/products" className="btn btn-outline-primary">Xem tất cả</Link>
        </div>
        <div className="row g-4">
          {products.slice(0, 8).map(product => (
            <div className="col-6 col-md-4 col-lg-3" key={product.id}>
              <div className="card h-100 shadow-sm">
                <img src={product.image} className="card-img-top" alt={product.name} style={{ height: 200, objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{product.name}</h6>
                  <p className="text-danger fw-bold mb-2">{formatPrice(product.price)}</p>
                  <div className="mt-auto d-flex gap-2">
                    <Link to={`/products/${product.id}`} className="btn btn-sm btn-outline-secondary flex-grow-1">Chi tiết</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
