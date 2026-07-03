import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h6 className="fw-bold text-uppercase mb-3">Thông tin website</h6>
            <p className="mb-1 fw-bold">Website bán đồ gia dụng</p>
            <p className="mb-1 small">Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
            <p className="mb-1 small">Điện thoại: 0123 456 789</p>
            <p className="mb-1 small">Email: info@dodunggia dung.vn</p>
            <p className="mb-0 small">Website: <a href="https://quanlycuahang-chi.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white">https://quanlycuahang-chi.vercel.app/</a></p>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold text-uppercase mb-3">Danh mục điều hướng</h6>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2"><a href="/" className="text-white text-decoration-none">Trang chủ</a></li>
              <li className="mb-0"><a href="/products" className="text-white text-decoration-none">Trang sản phẩm</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold text-uppercase mb-3">Mạng xã hội</h6>
            <div className="d-flex gap-3 mb-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                <FaTwitter />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                <FaYoutube />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                <FaInstagram />
              </a>
            </div>
            <hr className="border-secondary" />
            <p className="small mb-0">&copy; {new Date().getFullYear()} Website bán đồ gia dụng. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
