import { useState, useEffect } from 'react'
import { settingsAPI } from '../../services/api'
import { FaCog, FaSave } from 'react-icons/fa'

export default function Settings() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    settingsAPI.getAdmin().then(res => {
      setForm(res.data)
      setLoading(false)
    })
  }, [])

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      await settingsAPI.update(form)
      setMsg('Cập nhật thành công')
    } catch {
      setMsg('Lỗi khi cập nhật')
    }
    setSaving(false)
  }

  if (loading) return <div className="text-center p-5">Đang tải...</div>

  const fields = [
    { key: 'site_name', label: 'Tên website', type: 'text' },
    { key: 'site_address', label: 'Địa chỉ', type: 'text' },
    { key: 'site_phone', label: 'Điện thoại', type: 'text' },
    { key: 'site_email', label: 'Email', type: 'email' },
    { key: 'site_url', label: 'URL website', type: 'url' },
    { key: 'copyright_text', label: 'Văn bản bản quyền', type: 'text' },
    { key: 'social_facebook', label: 'Link Facebook', type: 'url' },
    { key: 'social_twitter', label: 'Link Twitter', type: 'url' },
    { key: 'social_youtube', label: 'Link YouTube', type: 'url' },
    { key: 'social_instagram', label: 'Link Instagram', type: 'url' },
  ]

  return (
    <div>
      <h2 className="fw-bold mb-4" style={{ color: '#1a237e' }}><FaCog className="me-2" />Cài đặt website</h2>

      {msg && (
        <div className={`alert ${msg.includes('thành công') ? 'alert-success' : 'alert-danger'} py-2 small`} style={{ borderRadius: 10 }}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-body p-4">
            <div className="row g-3">
              {fields.map(({ key, label, type }) => (
                <div className="col-md-6" key={key}>
                  <label className="form-label fw-semibold small">{label}</label>
                  <input
                    type={type}
                    className="form-control"
                    style={{ borderRadius: 8 }}
                    value={form[key] || ''}
                    onChange={e => handleChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="card-footer bg-white border-0 px-4 pb-4" style={{ borderRadius: '0 0 16px 16px' }}>
            <button type="submit" className="btn d-inline-flex align-items-center gap-2" style={{ borderRadius: 8, background: '#1565c0', color: '#fff' }} disabled={saving}>
              <FaSave /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
