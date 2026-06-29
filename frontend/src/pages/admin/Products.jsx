import { useState, useEffect } from 'react'
import { adminAPI, productAPI } from '../../services/api'

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

  useEffect(() => {
    load()
  }, [search])

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
      if (edit) {
        await adminAPI.updateProduct(edit.id, data)
      } else {
        await adminAPI.createProduct(data)
      }
      setShowModal(false)
      load()
    } catch { }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return
    try {
      await adminAPI.deleteProduct(id)
      load()
    } catch { }
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Quản lý sản phẩm</h2>
        <div className="d-flex gap-2">
          <input className="form-control" placeholder="Tìm kiếm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 250 }} />
          <button className="btn btn-primary" onClick={openAdd}>+ Thêm sản phẩm</button>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{edit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tên sản phẩm</label>
                      <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Danh mục</label>
                      <select className="form-select" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required>
                        <option value="">Chọn danh mục</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea className="form-control" rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Giá (VNĐ)</label>
                      <input type="number" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Số lượng</label>
                      <input type="number" className="form-control" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Trạng thái</label>
                      <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option value="active">Đang bán</option>
                        <option value="inactive">Ngừng bán</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">URL hình ảnh</label>
                    <input className="form-control" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
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

      <div className="table-responsive">
        <table className="table table-hover">
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
                <td>{p.id}</td>
                <td><img src={p.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} /></td>
                <td>{p.name}</td>
                <td>{p.Category?.name}</td>
                <td className="fw-bold">{formatPrice(p.price)}</td>
                <td>
                  <span className={p.quantity < 5 ? 'text-danger fw-bold' : ''}>{p.quantity}</span>
                </td>
                <td><span className={`badge ${p.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{p.status === 'active' ? 'Đang bán' : 'Ngừng bán'}</span></td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => openEdit(p)}>Sửa</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
