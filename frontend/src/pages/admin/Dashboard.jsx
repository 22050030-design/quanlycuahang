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

  const sparklineData = [35, 50, 30, 60, 45, 70, 55, 80, 65, 90, 75, 85]
  const max = Math.max(...sparklineData)
  const min = Math.min(...sparklineData)
  const range = max - min || 1
  const w = 100; const h = 40
  const points = sparklineData.map((v, i) => {
    const x = (i / (sparklineData.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  const areaPoints = `0,${h} ${points} ${w},${h}`

  return (
    <div>
      <h2 className="fw-bold mb-4" style={{ color: '#0F172A' }}>Quản trị hệ thống</h2>

      <div className="row g-4">
        {/* Cột trái 2/3 */}
        <div className="col-md-8">
          {/* Khối Doanh thu */}
          <div className="card mb-4" style={{ borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <div className="small fw-semibold mb-1" style={{ color: '#10B981', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                    <FaDollarSign className="me-1" />Doanh thu
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A' }}>{formatPrice(data.totalRevenue)}</div>
                </div>
              </div>
              {/* Sparkline */}
              <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 50 }}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity=".2" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={areaPoints} fill="url(#sparkGrad)" />
                <polyline points={points} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* 2 ô song song: Tổng sản phẩm + Tổng đơn hàng */}
          <div className="row g-4">
            <div className="col-6">
              <div className="card" style={{ borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', aspectRatio: '1/1' }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <FaBox style={{ fontSize: '2.5rem', color: '#3B82F6', opacity: .7 }} className="mb-3" />
                  <div className="small fw-semibold mb-2" style={{ color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '.5px' }}>Tổng sản phẩm</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>{data.totalProducts}</div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card" style={{ borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', aspectRatio: '1/1' }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <FaShoppingCart style={{ fontSize: '2.5rem', color: '#8B5CF6', opacity: .7 }} className="mb-3" />
                  <div className="small fw-semibold mb-2" style={{ color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '.5px' }}>Tổng đơn hàng</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>{data.totalOrders}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải 1/3 */}
        <div className="col-md-4 d-flex flex-column gap-4">
          <div className="card flex-grow-1" style={{ borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
              <FaUsers style={{ fontSize: '2.5rem', color: '#10B981', opacity: .7 }} className="mb-3" />
              <div className="small fw-semibold mb-2" style={{ color: '#10B981', textTransform: 'uppercase', letterSpacing: '.5px' }}>Tổng người dùng</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>{data.totalUsers}</div>
            </div>
          </div>
          <div className="card flex-grow-1" style={{ borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
              <FaClock style={{ fontSize: '2.5rem', color: '#F59E0B', opacity: .7 }} className="mb-3" />
              <div className="small fw-semibold mb-2" style={{ color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '.5px' }}>Chờ xác nhận</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>{data.pendingOrders}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
