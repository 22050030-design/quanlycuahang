import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productAPI, cartAPI, reviewAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [msg, setMsg] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    productAPI.getById(id).then(res => setProduct(res.data)).catch(() => navigate('/'))
  }, [id])

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  const handleAddToCart = async () => {
    if (!user) return navigate('/login')
    try {
      await cartAPI.add({ product_id: parseInt(id), quantity: 1 })
      alert('Đã thêm vào giỏ hàng')
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi')
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    try {
      await reviewAPI.create({ product_id: parseInt(id), rating: parseInt(rating), comment })
      setMsg('Đánh giá thành công')
      setComment('')
      setRating(5)
      const res = await productAPI.getById(id)
      setProduct(res.data)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Lỗi')
    }
  }

  if (!product) return <div className="text-center p-5">Đang tải...</div>

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-5">
          <img src={product.image} className="img-fluid rounded shadow" alt={product.name} style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
        </div>
        <div className="col-md-7">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.Category?.name}</p>
          <h3 className="text-danger fw-bold">{formatPrice(product.price)}</h3>
          <p className={`badge ${product.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
            {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
          </p>
          <p>Số lượng: {product.quantity}</p>
          <p className="mt-3">{product.description}</p>
          <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.quantity === 0}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      <div className="mt-5">
        <h4>Đánh giá sản phẩm</h4>
        {product.Reviews?.length > 0 ? (
          product.Reviews.map(r => (
            <div className="card mb-2" key={r.id}>
              <div className="card-body py-2">
                <strong>{r.User?.name}</strong> - {'⭐'.repeat(r.rating)}
                <p className="mb-0">{r.comment}</p>
                <small className="text-muted">{new Date(r.created_at).toLocaleDateString('vi-VN')}</small>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Chưa có đánh giá</p>
        )}

        {user && (
          <form onSubmit={handleReview} className="mt-3 card p-3">
            <h5>Viết đánh giá</h5>
            {msg && <div className={`alert py-1 ${msg === 'Đánh giá thành công' ? 'alert-success' : 'alert-info'}`}>{msg}</div>}
            <div className="mb-2">
              <label className="form-label">Số sao</label>
              <select className="form-select" value={rating} onChange={e => setRating(e.target.value)}>
                {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} sao</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Nội dung</label>
              <textarea className="form-control" rows="2" value={comment} onChange={e => setComment(e.target.value)}></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Gửi đánh giá</button>
          </form>
        )}
      </div>
    </div>
  )
}
