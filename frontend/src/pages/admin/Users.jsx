import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    adminAPI.getUsers().then(res => setUsers(res.data))
  }, [])

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
    <div className="container-fluid py-4">
      <h2 className="mb-4">Quản lý người dùng</h2>

      {detail && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Chi tiết người dùng</h5>
                <button className="btn-close" onClick={() => setDetail(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID:</strong> {detail.id}</p>
                <p><strong>Họ tên:</strong> {detail.name}</p>
                <p><strong>Email:</strong> {detail.email}</p>
                <p><strong>Số điện thoại:</strong> {detail.phone || 'Chưa cập nhật'}</p>
                <p><strong>Địa chỉ:</strong> {detail.address || 'Chưa cập nhật'}</p>
                <p><strong>Vai trò:</strong> <span className={`badge ${detail.role === 'admin' ? 'bg-warning' : 'bg-secondary'}`}>{detail.role}</span></p>
                <p><strong>Trạng thái:</strong> {detail.is_active ? <span className="badge bg-success">Hoạt động</span> : <span className="badge bg-danger">Đã khóa</span>}</p>
                <p><strong>Số đơn hàng:</strong> {detail.order_count}</p>
                <p><strong>Tổng tiền đã mua:</strong> <span className="text-danger fw-bold">{formatPrice(detail.total_spent)}</span></p>
                <p><strong>Ngày tạo:</strong> {new Date(detail.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDetail(null)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover">
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
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td><span className={`badge ${user.role === 'admin' ? 'bg-warning' : 'bg-secondary'}`}>{user.role}</span></td>
                <td>{user.is_active ? <span className="badge bg-success">Hoạt động</span> : <span className="badge bg-danger">Đã khóa</span>}</td>
                <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button className="btn btn-sm btn-info me-2 text-white" onClick={() => viewDetail(user.id)}>Xem</button>
                  <button className={`btn btn-sm ${user.is_active ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleStatus(user.id)}>
                    {user.is_active ? 'Khóa' : 'Mở khóa'}
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
