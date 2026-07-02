import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { FaPlus, FaEdit, FaTrash, FaTag } from 'react-icons/fa'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    const res = await adminAPI.getCategories()
    setCategories(res.data)
  }

  const openAdd = () => {
    setEdit(null)
    setForm({ name: '', description: '' })
    setError(null)
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEdit(cat)
    setForm({ name: cat.name, description: cat.description || '' })
    setError(null)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      if (edit) await adminAPI.updateCategory(edit.id, form)
      else await adminAPI.createCategory(form)
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi không xác định')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return
    try { await adminAPI.deleteCategory(id); load() } catch { }
  }

  return (
    <div className="container-fluid py-4">
      <style>{`
        .admin-table { border-radius: 12px; overflow: hidden; }
        .admin-table thead th { background: #f5f5f5; color: #37474f; font-weight: 600; font-size: .85rem; border-bottom: none; padding: .75rem 1rem; }
        .admin-table tbody td { padding: .75rem 1rem; vertical-align: middle; }
        .btn-rounded { border-radius: 8px; font-size: .8rem; padding: .3rem .8rem; font-weight: 500; }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#1a237e' }}><FaTag className="me-2" />Quản lý danh mục</h2>
        <button className="btn" style={{ borderRadius: 10, background: '#00695c', color: '#fff', fontWeight: 600 }} onClick={openAdd}>
          <FaPlus className="me-1" /> Thêm danh mục
        </button>
      </div>

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderRadius: 16, border: 'none' }}>
              <div className="modal-header" style={{ borderRadius: '16px 16px 0 0', background: '#f5f5f5' }}>
                <h5 className="fw-bold" style={{ color: '#1a237e' }}>{edit ? 'Sửa danh mục' : 'Thêm danh mục'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-1" style={{ borderRadius: 8 }}>{error}</div>}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Tên danh mục</label>
                    <input className="form-control" style={{ borderRadius: 8 }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Mô tả</label>
                    <textarea className="form-control" rows="2" style={{ borderRadius: 8 }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid #eee' }}>
                  <button type="button" className="btn btn-secondary" style={{ borderRadius: 8 }} onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn" style={{ borderRadius: 8, background: '#00695c', color: '#fff' }}>{edit ? 'Cập nhật' : 'Thêm'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table admin-table table-hover bg-white shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td className="fw-bold">{cat.id}</td>
                <td>{cat.name}</td>
                <td style={{ color: '#666' }}>{cat.description}</td>
                <td>
                  <button className="btn btn-rounded me-1" style={{ background: '#fff3e0', color: '#e65100' }} onClick={() => openEdit(cat)}>
                    <FaEdit className="me-1" /> Sửa
                  </button>
                  <button className="btn btn-rounded" style={{ background: '#ffebee', color: '#c62828' }} onClick={() => handleDelete(cat.id)}>
                    <FaTrash className="me-1" /> Xóa
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
