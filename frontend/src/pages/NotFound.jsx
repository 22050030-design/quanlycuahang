import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-1">404</h1>
      <p className="lead">Trang không tồn tại</p>
      <Link to="/" className="btn btn-primary">Về trang chủ</Link>
    </div>
  )
}
