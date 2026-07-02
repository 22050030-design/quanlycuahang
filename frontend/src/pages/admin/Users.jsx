import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { FaEye, FaLock, FaUnlock, FaSearch } from 'react-icons/fa'

export default function Users() {
  const [users, setUsers] = useState([])
  const [detail, setDetail] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    adminAPI.getUsers({ search }).then(res => setUsers(res.data))
  }, [search])

  const toggleStatus = async (id) => {
    try {
      await adminAPI.toggleUserStatus(id)
      setUsers(users.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u))
    } catch { }
  }

  const viewDetail = async (id) => {
    try {
      const res = await adminAPI.getUserById(id)
      setDetail(res.data)
    } catch { }
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  const badgeStyle = (role) => ({
    borderRadius: 8,
    padding: '.25rem .6rem',
    fontSize: '.75rem',
    fontWeight: 600,
    background: role === 'admin' ? '#fff3e0' : '#e8eaf6',
    color: role === 'admin' ? '#e65100' : '#283593',
  })

  return (
    <div className="container-fluid py-4">
      <style>{`
        .admin-table { border-radius: 12px; overflow: hidden; }
        .admin-table thead th { background: #f5f5f5; color: #37474f; font-weight: 600; font-size: .85rem; border-bottom: none; padding: .75rem 1rem; }
        .admin-table tbody td { padding: .75rem 1rem; vertical-align: middle; }
        .btn-rounded { border-radius: 8px; font-size: .8rem; padding: .3rem .8rem; font-weight: 500; }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#1a237e' }}>Quản lý người dùng</h2>
        <div className="position-relative" style={{ width: 260 }}>
          <FaSearch className="position-absolute" style={{ top: 10, left: 12, color: '#9e9e9e' }} />
          <input className="form-control" placeholder="Tìm kiếm người dùng..."
            style={{ borderRadius: 10, paddingLeft: 36, fontSize: '.9rem' }}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {detail && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderRadius: 16, border: 'none' }}>
              <div className="modal-header" style={{ borderRadius: '16px 16px 0 0', background: '#f5f5f5' }}>
                <h5 className="fw-bold" style={{ color: '#1a237e' }}>Chi tiết người dùng</h5>
                <button className="btn-close" onClick={() => setDetail(null)}></button>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 56, height: 56, background: '#e3f2fd', color: '#1565c0', fontSize: '1.3rem', fontWeight: 700 }}>
                    {detail.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '1.1rem' }}>{detail.name}</div>
                    <div className="text-muted small">{detail.email}</div>
                  </div>
                </div>
                <div className="row g-2 small">
                  <div className="col-6"><strong>ID:</strong> {detail.id}</div>
                  <div className="col-6"><strong>Vai trò:</strong> <span style={badgeStyle(detail.role)}>{detail.role === 'admin' ? 'Admin' : 'Người dùng'}</span></div>
                  <div className="col-6"><strong>Số điện thoại:</strong> {detail.phone || 'Chưa cập nhật'}</div>
                  <div className="col-6"><strong>Trạng thái:</strong> {detail.is_active
                    ? <span style={{ borderRadius: 8, padding: '.2rem .6rem', fontSize: '.75rem', background: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}>Hoạt động</span>
                    : <span style={{ borderRadius: 8, padding: '.2rem .6rem', fontSize: '.75rem', background: '#ffebee', color: '#c62828', fontWeight: 600 }}>Đã khóa</span>}
                  </div>
                  <div className="col-12"><strong>Địa chỉ:</strong> {detail.address || 'Chưa cập nhật'}</div>
                  <div className="col-6"><strong>Số đơn hàng:</strong> {detail.order_count}</div>
                  <div className="col-6"><strong>Tổng đã mua:</strong> <span style={{ color: '#2e7d32', fontWeight: 700 }}>{formatPrice(detail.total_spent)}</span></div>
                  <div className="col-12"><strong>Ngày tạo:</strong> {new Date(detail.created_at).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #eee', padding: '1rem 1.5rem' }}>
                <button className="btn btn-secondary" style={{ borderRadius: 8 }} onClick={() => setDetail(null)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table admin-table table-hover bg-white shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số ĐT</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="fw-bold">{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td><span style={badgeStyle(user.role)}>{user.role === 'admin' ? 'Admin' : 'User'}</span></td>
                <td>{user.is_active
                  ? <span style={{ borderRadius: 8, padding: '.2rem .6rem', fontSize: .75, background: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}>Hoạt động</span>
                  : <span style={{ borderRadius: 8, padding: '.2rem .6rem', fontSize: .75, background: '#ffebee', color: '#c62828', fontWeight: 600 }}>Đã khóa</span>}
                </td>
                <td style={{ fontSize: '.85rem', color: '#666' }}>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button className="btn btn-rounded me-1" style={{ background: '#e3f2fd', color: '#1565c0' }} onClick={() => viewDetail(user.id)}>
                    <FaEye className="me-1" /> Xem
                  </button>
                  <button className="btn btn-rounded" style={{ background: user.is_active ? '#ffebee' : '#e8f5e9', color: user.is_active ? '#c62828' : '#2e7d32' }} onClick={() => toggleStatus(user.id)}>
                    {user.is_active ? <><FaLock className="me-1" /> Khóa</> : <><FaUnlock className="me-1" /> Mở khóa</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
