import { useState, useEffect } from 'react'
import { adminAPI, productAPI } from '../../services/api'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBox } from 'react-icons/fa'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', quantity: '', category_id: '', status: 'active' })

  useEffect(() => {
    productAPI.getCategories().then(res => setCategories(res.data))
  }, [])

  useEffect(() => { load() }, [search])

  const load = async () => {
    const params = search ? { search } : {}
    const res = await adminAPI.getProducts(params)
    setProducts(res.data)
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫'

  const openAdd = () => {
    setEdit(null)
    setForm({ name: '', description: '', price: '', image: '', quantity: '', category_id: '', status: 'active' })
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEdit(p)
    setForm({ name: p.name, description: p.description || '', price: p.price, image: p.image || '', quantity: p.quantity, category_id: p.category_id || '', status: p.status })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) || 0 }
      if (edit) await adminAPI.updateProduct(edit.id, data)
      else await adminAPI.createProduct(data)
      setShowModal(false)
      load()
    } catch { }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return
    try { await adminAPI.deleteProduct(id); load() } catch { }
  }

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
        .modal-content-dark { background: #1e1e1e; color: #fff; border: none; border-radius: 16px; }
        .modal-content-dark .form-control, .modal-content-dark .form-select { background: #2a2a2a; border: 1px solid #444; color: #fff; border-radius: 8px; }
        .modal-content-dark .form-control:focus, .modal-content-dark .form-select:focus { background: #333; border-color: #666; color: #fff; box-shadow: none; }
        .modal-content-dark .form-label { color: #ccc; }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#fff' }}><FaBox className="me-2" />Quản lý sản phẩm</h2>
        <div className="d-flex gap-2 align-items-center">
          <div className="position-relative">
            <FaSearch className="position-absolute" style={{ top: 10, left: 12, color: '#888' }} />
            <input className="form-control form-control-dark" placeholder="Tìm kiếm..."
              style={{ paddingLeft: 36, fontSize: '.9rem', width: 240 }}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn" style={{ borderRadius: 10, background: '#2a2a2a', color: '#fff', fontWeight: 600, border: '1px solid #555' }} onClick={openAdd}>
            <FaPlus className="me-1" /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-75">
          <div className="modal-dialog modal-lg">
            <div className="modal-content modal-content-dark">
              <div className="modal-header" style={{ borderRadius: '16px 16px 0 0', background: '#2a2a2a', borderBottom: '1px solid #444' }}>
                <h5 className="fw-bold">{edit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold small">Tên sản phẩm</label>
                      <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold small">Danh mục</label>
                      <select className="form-select" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required>
                        <option value="" style={{ background: '#2a2a2a' }}>Chọn danh mục</option>
                        {categories.map(c => <option key={c.id} value={c.id} style={{ background: '#2a2a2a' }}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Mô tả</label>
                    <textarea className="form-control" rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold small">Giá (VNĐ)</label>
                      <input type="number" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold small">Số lượng</label>
                      <input type="number" className="form-control" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold small">Trạng thái</label>
                      <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option value="active" style={{ background: '#2a2a2a' }}>Đang bán</option>
                        <option value="inactive" style={{ background: '#2a2a2a' }}>Ngừng bán</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">URL hình ảnh</label>
                    <input className="form-control" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
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
              <th>Hình</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className="fw-bold">{p.id}</td>
                <td><img src={p.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} /></td>
                <td>{p.name}</td>
                <td><span style={{ borderRadius: 8, padding: '.2rem .6rem', background: '#333', color: '#fff', fontWeight: 600, fontSize: '.8rem' }}>{p.Category?.name}</span></td>
                <td className="fw-bold" style={{ color: '#a5d6a7' }}>{formatPrice(p.price)}</td>
                <td>
                  <span style={p.quantity < 5 ? { color: '#ef9a9a', fontWeight: 700 } : {}}>{p.quantity}</span>
                </td>
                <td><span style={{ borderRadius: 8, padding: '.2rem .6rem', background: p.status === 'active' ? '#1b5e20' : '#444', color: p.status === 'active' ? '#a5d6a7' : '#aaa', fontWeight: 600, fontSize: '.8rem' }}>{p.status === 'active' ? 'Đang bán' : 'Ngừng bán'}</span></td>
                <td>
                  <button className="btn btn-rounded me-1" style={{ background: '#333', color: '#fff', border: '1px solid #555' }} onClick={() => openEdit(p)}>
                    <FaEdit className="me-1" /> Sửa
                  </button>
                  <button className="btn btn-rounded" style={{ background: '#4a1515', color: '#ef9a9a', border: 'none' }} onClick={() => handleDelete(p.id)}>
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
