import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { FaBox, FaUsers, FaShoppingCart, FaClock, FaDollarSign } from 'react-icons/fa'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    adminAPI.getDashboard().then(res => setData(res.data))
  }, [])

  if (!data) return <div className="text-center p-5">Đang tải...</div>

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  return (
    <div>
      <h2 className="fw-bold mb-4" style={{ color: '#1a237e' }}>Quản trị hệ thống</h2>

      <div className="row g-4">
        {/* Cột trái 2/3 */}
        <div className="col-md-8">
          {/* Khối Doanh thu */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16, background: '#808080' }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="small fw-semibold mb-1" style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                    <FaDollarSign className="me-1" />Doanh thu
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>{formatPrice(data.totalRevenue)}</div>
                </div>
              </div>
              {/* Biểu đồ giả */}
              <div style={{ height: 50, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                {[35, 50, 30, 60, 45, 70, 55, 80, 65, 90, 75, 85].map((h, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${h}%`, background: 'rgba(255,255,255,.15)',
                    borderRadius: '4px 4px 0 0'
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* 2 ô song song: Tổng sản phẩm + Tổng đơn hàng */}
          <div className="row g-4">
            <div className="col-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: 16, background: '#808080', aspectRatio: '1/1' }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <FaBox style={{ fontSize: '2.5rem', color: '#fff', opacity: .3 }} className="mb-3" />
                  <div className="small fw-semibold mb-2" style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '.5px' }}>Tổng sản phẩm</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{data.totalProducts}</div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: 16, background: '#808080', aspectRatio: '1/1' }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <FaShoppingCart style={{ fontSize: '2.5rem', color: '#fff', opacity: .3 }} className="mb-3" />
                  <div className="small fw-semibold mb-2" style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '.5px' }}>Tổng đơn hàng</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{data.totalOrders}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải 1/3 */}
        <div className="col-md-4 d-flex flex-column gap-4">
          <div className="card border-0 shadow-sm flex-grow-1" style={{ borderRadius: 16, background: '#808080' }}>
            <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
              <FaUsers style={{ fontSize: '2.5rem', color: '#fff', opacity: .3 }} className="mb-3" />
              <div className="small fw-semibold mb-2" style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '.5px' }}>Tổng người dùng</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{data.totalUsers}</div>
            </div>
          </div>
          <div className="card border-0 shadow-sm flex-grow-1" style={{ borderRadius: 16, background: '#808080' }}>
            <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
              <FaClock style={{ fontSize: '2.5rem', color: '#fff', opacity: .3 }} className="mb-3" />
              <div className="small fw-semibold mb-2" style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '.5px' }}>Chờ xác nhận</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{data.pendingOrders}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
