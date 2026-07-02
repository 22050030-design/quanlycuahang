import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { FaBox, FaUsers, FaShoppingCart, FaClock, FaDollarSign, FaArrowUp, FaArrowDown } from 'react-icons/fa'

const smallCards = [
  { label: 'Tổng sản phẩm', key: 'totalProducts', icon: FaBox, color: '#16A34A', growth: 8.2 },
  { label: 'Tổng đơn hàng', key: 'totalOrders', icon: FaShoppingCart, color: '#F97316', growth: 15.7 },
  { label: 'Tổng người dùng', key: 'totalUsers', icon: FaUsers, color: '#7C3AED', growth: 23.4 },
  { label: 'Chờ xác nhận', key: 'pendingOrders', icon: FaClock, color: '#DC2626', growth: -5.1 },
]

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    adminAPI.getDashboard().then(res => setData(res.data))
  }, [])

  if (!data) return <div className="text-center p-5">Đang tải...</div>

  const fmt = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  // SVG line chart
  const cd = [30, 45, 35, 55, 60, 45, 70, 55, 65, 80, 75, 95]
  const cw = 600, ch = 130
  const mx = Math.max(...cd)
  const pts = cd.map((v, i) => ({ x: (i / (cd.length - 1)) * cw, y: ch - (v / mx) * ch }))
  const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const areaD = lineD + ` L ${cw} ${ch} L 0 ${ch} Z`

  return (
    <div style={{ background: '#F5F7FB', minHeight: '100vh', padding: '28px' }}>
      <h2 className="fw-bold mb-4" style={{ color: '#0F172A' }}>Quản trị hệ thống</h2>

      {/* Doanh thu – gradient xanh dương + line chart */}
      <div className="card border-0 mb-4 overflow-hidden" style={{
        borderRadius: 16,
        background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
        boxShadow: '0 8px 32px rgba(37,99,235,0.3)'
      }}>
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="d-flex align-items-center gap-2 mb-1">
                <FaDollarSign style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)' }} />
                <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: '.85rem', letterSpacing: '.5px' }}>DOANH THU</span>
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                {fmt(data.totalRevenue)}
              </div>
              <div className="d-flex align-items-center gap-1 mt-2" style={{ color: '#86EFAC', fontWeight: 600, fontSize: '.9rem' }}>
                <FaArrowUp />
                <span>+12.5% so với tháng trước</span>
              </div>
            </div>
            <div className="col-md-7">
              <svg viewBox={`0 0 ${cw} ${ch + 10}`} style={{ width: '100%', height: 140 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>
                <path d={areaD} fill="url(#areaGrad)" />
                <path d={lineD} fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill="#fff" />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 4 thẻ nhỏ */}
      <div className="row g-4">
        {smallCards.map(({ label, key, icon: Icon, color, growth }) => {
          const up = growth >= 0
          return (
            <div className="col-md-3 col-sm-6" key={label}>
              <div className="card border-0 h-100" style={{
                borderRadius: 16,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                cursor: 'default'
              }}>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span style={{ color: '#64748B', fontWeight: 600, fontSize: '.85rem', letterSpacing: '.3px' }}>
                      {label.toUpperCase()}
                    </span>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: color
                    }}>
                      <Icon style={{ fontSize: 20 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                    {data[key]}
                  </div>
                  <div className="d-flex align-items-center gap-1" style={{
                    color: up ? '#16A34A' : '#DC2626',
                    fontWeight: 600,
                    fontSize: '.85rem'
                  }}>
                    {up ? <FaArrowUp /> : <FaArrowDown />}
                    <span>{Math.abs(growth)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
