import { useState, useEffect } from 'react'
import { authAPI } from '../../services/api'

export default function Profile() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    authAPI.getProfile().then(res => setForm({ ...res.data, password: '' }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    const data = { name: form.name, phone: form.phone, address: form.address }
    if (form.password) data.password = form.password
    try {
      await authAPI.updateProfile(data)
      setMsg('Cập nhật thành công')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Lỗi')
    }
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="mb-4">Hồ sơ cá nhân</h3>
              {msg && <div className="alert alert-info">{msg}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Họ tên</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={form.email} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Địa chỉ</label>
                  <textarea className="form-control" rows="2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu mới (để trống nếu không đổi)</label>
                  <input type="password" className="form-control" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary w-100">Cập nhật</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
