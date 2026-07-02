import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await authAPI.login(form)
      login(res.data.user, res.data.token)
      if (res.data.user.role === 'admin') navigate('/admin')
      else navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại')
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Đăng nhập</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <input type="password" className="form-control" required value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
              </form>
              <p className="text-center mt-3">
                Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
