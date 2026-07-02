import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { FaEye, FaLock, FaUnlock, FaSearch, FaTimes } from 'react-icons/fa'

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

  return (
    <div className="container-fluid py-4" style={{ background: '#121212', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        .admin-table { border-radius: 12px; overflow: hidden; }
        .admin-table thead th { background: #1e1e1e; color: #ccc; font-weight: 600; font-size: .85rem; border-bottom: 1px solid #333; padding: .75rem 1rem; }
        .admin-table tbody td { padding: .75rem 1rem; vertical-align: middle; background: #1a1a1a; color: #ddd; border-bottom: 1px solid #2a2a2a; }
        .admin-table tbody tr:hover td { background: #252525; }
        .btn-rounded { border-radius: 8px; font-size: .8rem; padding: .3rem .8rem; font-weight: 500; }
        .form-control-dark { background: #2a2a2a; border: 1px solid #444; color: #fff; border-radius: 10px; }
        .form-control-dark:focus { background: #333; border-color: #666; color: #fff; box-shadow: none; }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#fff' }}>Quản lý người dùng</h2>
        <div className="position-relative" style={{ width: 260 }}>
          <FaSearch className="position-absolute" style={{ top: 10, left: 12, color: '#888' }} />
          <input className="form-control form-control-dark" placeholder="Tìm kiếm người dùng..."
            style={{ paddingLeft: 36, fontSize: '.9rem' }}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {detail && (
        <div className="modal d-block bg-dark bg-opacity-75">
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderRadius: 16, border: 'none', background: '#1e1e1e' }}>
              <div className="modal-header" style={{ borderRadius: '16px 16px 0 0', background: '#2a2a2a', borderBottom: '1px solid #444' }}>
                <h5 className="fw-bold" style={{ color: '#fff' }}>Chi tiết người dùng</h5>
                <button className="btn-close btn-close-white" onClick={() => setDetail(null)}></button>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 56, height: 56, background: '#333', color: '#fff', fontSize: '1.3rem', fontWeight: 700 }}>
                    {detail.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '1.1rem', color: '#fff' }}>{detail.name}</div>
                    <div className="small" style={{ color: '#999' }}>{detail.email}</div>
                  </div>
                </div>
                <div className="row g-2 small" style={{ color: '#ccc' }}>
                  <div className="col-6"><strong>ID:</strong> {detail.id}</div>
                  <div className="col-6">
                    <strong>Vai trò:</strong>{' '}
                    <span style={{ borderRadius: 8, padding: '.2rem .6rem', background: '#333', color: '#fff', fontWeight: 600 }}>
                      {detail.role === 'admin' ? 'Admin' : 'Người dùng'}
                    </span>
                  </div>
                  <div className="col-6"><strong>Số điện thoại:</strong> {detail.phone || 'Chưa cập nhật'}</div>
                  <div className="col-6">
                    <strong>Trạng thái:</strong>{' '}
                    {detail.is_active
                      ? <span style={{ borderRadius: 8, padding: '.2rem .6rem', background: '#1b5e20', color: '#a5d6a7', fontWeight: 600 }}>Hoạt động</span>
                      : <span style={{ borderRadius: 8, padding: '.2rem .6rem', background: '#b71c1c', color: '#ef9a9a', fontWeight: 600 }}>Đã khóa</span>}
                  </div>
                  <div className="col-12"><strong>Địa chỉ:</strong> {detail.address || 'Chưa cập nhật'}</div>
                  <div className="col-6"><strong>Số đơn hàng:</strong> {detail.order_count}</div>
                  <div className="col-6"><strong>Tổng đã mua:</strong> <span style={{ color: '#a5d6a7', fontWeight: 700 }}>{formatPrice(detail.total_spent)}</span></div>
                  <div className="col-12"><strong>Ngày tạo:</strong> {new Date(detail.created_at).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #333', padding: '1rem 1.5rem' }}>
                <button className="btn btn-secondary" style={{ borderRadius: 8, background: '#444', border: 'none' }} onClick={() => setDetail(null)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table admin-table shadow-sm">
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
                <td style={{ color: '#999' }}>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span style={{ borderRadius: 8, padding: '.2rem .6rem', background: '#333', color: '#fff', fontWeight: 600, fontSize: '.8rem' }}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td>{user.is_active
                  ? <span style={{ borderRadius: 8, padding: '.2rem .6rem', background: '#1b5e20', color: '#a5d6a7', fontWeight: 600, fontSize: '.8rem' }}>Hoạt động</span>
                  : <span style={{ borderRadius: 8, padding: '.2rem .6rem', background: '#b71c1c', color: '#ef9a9a', fontWeight: 600, fontSize: '.8rem' }}>Đã khóa</span>}
                </td>
                <td style={{ fontSize: '.85rem', color: '#888' }}>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button className="btn btn-rounded me-1" style={{ background: '#333', color: '#fff', border: '1px solid #555' }} onClick={() => viewDetail(user.id)}>
                    <FaEye className="me-1" /> Xem
                  </button>
                  <button className="btn btn-rounded" style={{ background: user.is_active ? '#4a1515' : '#1b5e20', color: '#fff', border: 'none' }} onClick={() => toggleStatus(user.id)}>
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
