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
    <div className="container-fluid py-4" style={{ background: '#121212', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        .admin-table { border-radius: 12px; overflow: hidden; }
        .admin-table thead th { background: #1e1e1e; color: #ccc; font-weight: 600; font-size: .85rem; border-bottom: 1px solid #333; padding: .75rem 1rem; }
        .admin-table tbody td { padding: .75rem 1rem; vertical-align: middle; background: #1a1a1a; color: #ddd; border-bottom: 1px solid #2a2a2a; }
        .admin-table tbody tr:hover td { background: #252525; }
        .btn-rounded { border-radius: 8px; font-size: .8rem; padding: .3rem .8rem; font-weight: 500; }
        .modal-content-dark { background: #1e1e1e; color: #fff; border: none; border-radius: 16px; }
        .modal-content-dark .form-control, .modal-content-dark .form-select { background: #2a2a2a; border: 1px solid #444; color: #fff; border-radius: 8px; }
        .modal-content-dark .form-control:focus { background: #333; border-color: #666; color: #fff; box-shadow: none; }
        .modal-content-dark .form-label { color: #ccc; }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#fff' }}><FaTag className="me-2" />Quản lý danh mục</h2>
        <button className="btn" style={{ borderRadius: 10, background: '#2a2a2a', color: '#fff', fontWeight: 600, border: '1px solid #555' }} onClick={openAdd}>
          <FaPlus className="me-1" /> Thêm danh mục
        </button>
      </div>

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-75">
          <div className="modal-dialog">
            <div className="modal-content modal-content-dark">
              <div className="modal-header" style={{ borderRadius: '16px 16px 0 0', background: '#2a2a2a', borderBottom: '1px solid #444' }}>
                <h5 className="fw-bold">{edit ? 'Sửa danh mục' : 'Thêm danh mục'}</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert" style={{ borderRadius: 8, background: '#4a1515', color: '#ef9a9a', border: 'none', padding: '.5rem 1rem' }}>{error}</div>}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Tên danh mục</label>
                    <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Mô tả</label>
                    <textarea className="form-control" rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid #333' }}>
                  <button type="button" className="btn" style={{ borderRadius: 8, background: '#444', color: '#fff', border: 'none' }} onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn" style={{ borderRadius: 8, background: '#2a2a2a', color: '#fff', border: '1px solid #555' }}>{edit ? 'Cập nhật' : 'Thêm'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table admin-table shadow-sm">
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
                <td style={{ color: '#888' }}>{cat.description}</td>
                <td>
                  <button className="btn btn-rounded me-1" style={{ background: '#333', color: '#fff', border: '1px solid #555' }} onClick={() => openEdit(cat)}>
                    <FaEdit className="me-1" /> Sửa
                  </button>
                  <button className="btn btn-rounded" style={{ background: '#4a1515', color: '#ef9a9a', border: 'none' }} onClick={() => handleDelete(cat.id)}>
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
