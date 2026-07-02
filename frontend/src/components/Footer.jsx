import { useState, useEffect } from 'react'
import { settingsAPI } from '../services/api'
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  const [s, setS] = useState(null)

  useEffect(() => {
    settingsAPI.getPublic().then(res => setS(res.data)).catch(() => setS({}))
  }, [])

  if (!s) return null

  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h6 className="fw-bold text-uppercase mb-3">Thông tin website</h6>
            <p className="mb-1 fw-bold">{s.site_name || 'Website bán đồ gia dụng'}</p>
            <p className="mb-1 small">Địa chỉ: {s.site_address || '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'}</p>
            <p className="mb-1 small">Điện thoại: {s.site_phone || '0123 456 789'}</p>
            <p className="mb-1 small">Email: {s.site_email || 'info@dodunggiadung.vn'}</p>
            <p className="mb-0 small">
              Website: <a href={s.site_url || 'https://quanlycuahang-chi.vercel.app/'} target="_blank" rel="noopener noreferrer" className="text-white">{s.site_url || 'https://quanlycuahang-chi.vercel.app/'}</a>
            </p>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold text-uppercase mb-3">Danh mục điều hướng</h6>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2"><a href="/" className="text-white text-decoration-none">Trang chủ</a></li>
              <li className="mb-0"><a href="/gioi-thieu" className="text-white text-decoration-none">Giới thiệu</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold text-uppercase mb-3">Mạng xã hội</h6>
            <div className="d-flex gap-3 mb-3">
              {s.social_facebook && <a href={s.social_facebook} target="_blank" rel="noopener noreferrer" className="text-white fs-5"><FaFacebook /></a>}
              {s.social_twitter && <a href={s.social_twitter} target="_blank" rel="noopener noreferrer" className="text-white fs-5"><FaTwitter /></a>}
              {s.social_youtube && <a href={s.social_youtube} target="_blank" rel="noopener noreferrer" className="text-white fs-5"><FaYoutube /></a>}
              {s.social_instagram && <a href={s.social_instagram} target="_blank" rel="noopener noreferrer" className="text-white fs-5"><FaInstagram /></a>}
            </div>
            <hr className="border-secondary" />
            <p className="small mb-0">&copy; {new Date().getFullYear()} {s.copyright_text || 'Website bán đồ gia dụng'}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
