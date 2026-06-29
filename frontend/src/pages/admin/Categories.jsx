import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'

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
      if (edit) {
        await adminAPI.updateCategory(edit.id, form)
      } else {
        await adminAPI.createCategory(form)
      }
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi không xác định')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return
    try {
      await adminAPI.deleteCategory(id)
      load()
    } catch { }
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Quản lý danh mục</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Thêm danh mục</button>
      </div>

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{edit ? 'Sửa danh mục' : 'Thêm danh mục'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-1">{error}</div>}
                  <div className="mb-3">
                    <label className="form-label">Tên danh mục</label>
                    <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea className="form-control" rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary">{edit ? 'Cập nhật' : 'Thêm'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <table className="table table-hover">
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
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => openEdit(cat)}>Sửa</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
