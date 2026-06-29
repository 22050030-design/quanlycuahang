export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="fw-bold text-uppercase mb-3">Thông tin đề tài</h6>
            <p className="mb-1">Môn học: Chuyên đề 1</p>
            <p className="mb-1">Lớp: 25TH02</p>
            <p className="mb-0">Đề tài: Website Quản Lý Cửa Hàng Trực Tuyến</p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="fw-bold text-uppercase mb-3">Giảng viên hướng dẫn</h6>
            <p className="mb-0">Giảng viên hướng dẫn: Thầy Dương Anh Tuấn</p>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold text-uppercase mb-3">Sinh viên thực hiện</h6>
            <p className="mb-1 fw-bold">Sinh viên thực hiện: Vy Ngọc Nhân</p>
            <p className="mb-0">MSSV: 22050030</p>
          </div>
        </div>
      </div>
    </footer>
  )
}