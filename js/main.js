// js/main.js

import Validation from "../js/validation.js";
import validateNhanVien from "./validateNhanVien.js";

function getEle(id) {
  return document.getElementById(id);
}

// Hàm loại bỏ dấu tiếng Việt, chuyển về chữ thường
function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Mảng lưu trữ danh sách nhân viên (sẽ đẩy vào localStorage)
let danhSachNhanVien = [];

// Lớp tạo đối tượng nhân viên
function TaoNhanVien(
  taiKhoan,
  hoTen,
  email,
  matKhau,
  ngayLam,
  luongCoBan,
  chucVu,
  gioLam
) {
  this.taiKhoan = taiKhoan;
  this.hoTen = hoTen;
  this.email = email;
  this.matKhau = matKhau;
  this.ngayLam = ngayLam;
  this.luongCoBan = Number(luongCoBan);
  this.chucVu = chucVu;
  this.gioLam = Number(gioLam);

  // Tính tổng lương
  this.tinhTongLuong = function () {
    switch (this.chucVu) {
      case "Sếp":
        return this.luongCoBan * 3;
      case "Trưởng phòng":
        return this.luongCoBan * 2;
      default:
        return this.luongCoBan;
    }
  };

  // Xếp loại
  this.xepLoai = function () {
    if (this.gioLam >= 192) return "Xuất sắc";
    if (this.gioLam >= 176) return "Giỏi";
    if (this.gioLam >= 160) return "Khá";
    return "Trung bình";
  };
}

// --------------------
// 1) Hàm reset form (ném hết dữ liệu, mở khóa tknv, ẩn/hiện đúng nút, và XÓA sạch thông báo lỗi)
function resetForm() {
  // a) Reset toàn bộ input/select trong form
  getEle("formQLNV").reset();

  // b) Mở khóa ô tài khoản để nhập mới
  getEle("tknv").disabled = false;

  // c) Ẩn nút Cập nhật, hiển thị nút Thêm nhân viên
  getEle("btnThemNV").style.display = "inline-block";
  getEle("btnCapNhat").style.display = "none";

  // d) XÓA hết nội dung tất cả <span class="sp-thongbao"> (các thông báo lỗi)
  getEle("tbTKNV").innerHTML = "";
  getEle("tbTen").innerHTML = "";
  getEle("tbEmail").innerHTML = "";
  getEle("tbMatKhau").innerHTML = "";
  getEle("tbNgay").innerHTML = "";
  getEle("tbLuongCB").innerHTML = "";
  getEle("tbChucVu").innerHTML = "";
  getEle("tbGiolam").innerHTML = "";
}

// 2) Hàm hiển thị modal “Thêm nhân viên” khi bấm nút btnThem
function setupModalThem() {
  const btnThem = getEle("btnThem");
  if (btnThem) {
    btnThem.addEventListener("click", function () {
      // a) Reset form, xóa sạch dữ liệu + lỗi
      resetForm();

      // b) Đổi tiêu đề modal thành “Thêm nhân viên”
      const modalTitle = getEle("modal-title");
      if (modalTitle) modalTitle.innerText = "Thêm nhân viên";

      // c) Ẩn nút Cập nhật, hiển thị nút Thêm
      getEle("btnCapNhat").style.display = "none";
      getEle("btnThemNV").style.display = "inline-block";
    });
  }
}

// 3) Hàm thêm nhân viên mới từ form
function themNhanVienTuForm() {
  const taiKhoan = getEle("tknv").value.trim();
  const hoTen = getEle("name").value.trim();
  const email = getEle("email").value.trim();
  const matKhau = getEle("password").value.trim();
  const ngayLam = getEle("datepicker").value.trim();
  const luongCoBan = getEle("luongCB").value.trim();
  const chucVu = getEle("chucvu").value;
  const gioLam = getEle("gioLam").value.trim();

  // 3.1) Kiểm tra xem tài khoản có trùng không?  // === MỚI ===
  if (danhSachNhanVien.some((nv) => nv.taiKhoan === taiKhoan)) {
    // Nếu trùng, hiển thị thông báo ngay dưới input hoặc alert
    getEle("tbTKNV").innerHTML = "(*) Tài khoản đã tồn tại";
    return;
  }

  // Gọi validate từ validateNhanVien.js
  const isValid = validateNhanVien(
    taiKhoan,
    hoTen,
    email,
    matKhau,
    ngayLam,
    luongCoBan,
    chucVu,
    gioLam,
    danhSachNhanVien
  );
  if (!isValid) {
    return; // Nếu không hợp lệ, dừng
  }

  // Nếu hợp lệ, tạo đối tượng mới và push vào mảng
  const nv = new TaoNhanVien(
    taiKhoan,
    hoTen,
    email,
    matKhau,
    ngayLam,
    luongCoBan,
    chucVu,
    gioLam
  );
  danhSachNhanVien.push(nv);
  setLocalStorage();
  hienThiDanhSachNhanVien();

  // Sau khi thêm xong, reset form (nếu muốn tự tắt modal, bạn có thể gọi $("#myModal").modal("hide"))
  resetForm();
}

// 4) Gán sự kiện cho nút “Thêm người dùng” (btnThemNV)
function setupBtnThemNV() {
  const btnThemNV = getEle("btnThemNV");
  if (btnThemNV) {
    btnThemNV.onclick = themNhanVienTuForm;
  }
}

// 5) Hàm cập nhật nhân viên
function capNhatNhanVien() {
  const taiKhoan = getEle("tknv").value.trim();
  const hoTen = getEle("name").value.trim();
  const email = getEle("email").value.trim();
  const matKhau = getEle("password").value.trim();
  const ngayLam = getEle("datepicker").value.trim();
  const luongCoBan = getEle("luongCB").value.trim();
  const chucVu = getEle("chucvu").value;
  const gioLam = getEle("gioLam").value.trim();

  // Gọi validate trước khi cập nhật
  const isValid = validateNhanVien(
    taiKhoan,
    hoTen,
    email,
    matKhau,
    ngayLam,
    luongCoBan,
    chucVu,
    gioLam,
    danhSachNhanVien
  );
  if (!isValid) {
    alert("Dữ liệu không hợp lệ!");
    return;
  }

  // Tìm vị trí nhân viên cần cập nhật và gán giá trị mới
  for (let i = 0; i < danhSachNhanVien.length; i++) {
    if (danhSachNhanVien[i].taiKhoan === taiKhoan) {
      danhSachNhanVien[i].hoTen = hoTen;
      danhSachNhanVien[i].email = email;
      danhSachNhanVien[i].matKhau = matKhau;
      danhSachNhanVien[i].ngayLam = ngayLam;
      danhSachNhanVien[i].luongCoBan = Number(luongCoBan);
      danhSachNhanVien[i].chucVu = chucVu;
      danhSachNhanVien[i].gioLam = Number(gioLam);
      break;
    }
  }

  hienThiDanhSachNhanVien();
  setLocalStorage();
  resetForm();
}

// 6) Hàm hiển thị danh sách nhân viên ra table (đã sắp xếp tài khoản tăng dần)  // === MỚI ===
function hienThiDanhSachNhanVien() {
  // 6.1) Sắp xếp danhSachNhanVien theo tài khoản (chuyển thành số) tăng dần
  danhSachNhanVien.sort((a, b) => {
    return Number(a.taiKhoan) - Number(b.taiKhoan);
  });

  // 6.2) Render ra table
  let content = "";
  danhSachNhanVien.forEach((nv) => {
    const tongLuong = nv.tinhTongLuong();
    const xepLoai = nv.xepLoai();
    content += `
      <tr>
        <td>${nv.taiKhoan}</td>
        <td>${nv.hoTen}</td>
        <td>${nv.email}</td>
        <td>${nv.ngayLam}</td>
        <td>${nv.chucVu}</td>
        <td>${tongLuong.toLocaleString()} VND</td>
        <td>${xepLoai}</td>
        <td>
          <button class="btn btn-danger btn-sm mr-1" onclick="xoaNhanVien('${nv.taiKhoan}')">Xóa</button>
          <button class="btn btn-warning btn-sm" onclick="suaNhanVien('${nv.taiKhoan}')">Sửa</button>
        </td>
      </tr>
    `;
  });
  getEle("tableDanhSach").innerHTML = content;
}

// 7) Hàm xóa nhân viên
function xoaNhanVien(taiKhoan) {
  danhSachNhanVien = danhSachNhanVien.filter((nv) => nv.taiKhoan !== taiKhoan);
  setLocalStorage();
  hienThiDanhSachNhanVien();
}

// 8) Hàm sửa nhân viên: điền giá trị cũ vào form, mở modal, chỉnh trạng thái nút
function suaNhanVien(taiKhoan) {
  const nv = danhSachNhanVien.find((item) => item.taiKhoan === taiKhoan);
  if (!nv) return;

  // Điền dữ liệu vào form
  getEle("tknv").value = nv.taiKhoan;
  getEle("name").value = nv.hoTen;
  getEle("email").value = nv.email;
  getEle("password").value = nv.matKhau;
  getEle("datepicker").value = nv.ngayLam;
  getEle("luongCB").value = nv.luongCoBan;
  getEle("chucvu").value = nv.chucVu;
  getEle("gioLam").value = nv.gioLam;

  // Khóa ô tài khoản (không cho sửa)
  getEle("tknv").disabled = true;

  // Hiển thị modal, đổi tiêu đề, ẩn nút Thêm, hiện nút Cập nhật
  $("#myModal").modal("show");
  getEle("modal-title").innerText = "Sửa thông tin nhân viên";
  getEle("btnThemNV").style.display = "none";
  getEle("btnCapNhat").style.display = "inline-block";
}

// Phải expose ra window để HTML inline onclick="..." tìm được
window.suaNhanVien = suaNhanVien;
window.xoaNhanVien = xoaNhanVien;

// 9) Lưu/truy xuất localStorage
function setLocalStorage() {
  localStorage.setItem("DSNV", JSON.stringify(danhSachNhanVien));
}
function getLocalStorage() {
  const data = localStorage.getItem("DSNV");
  if (data) {
    danhSachNhanVien = JSON.parse(data).map(
      (nv) =>
        new TaoNhanVien(
          nv.taiKhoan,
          nv.hoTen,
          nv.email,
          nv.matKhau,
          nv.ngayLam,
          nv.luongCoBan,
          nv.chucVu,
          nv.gioLam
        )
    );
    hienThiDanhSachNhanVien();
  }
}

// -------------------------------------------------------
// 10) CHỨC NĂNG TÌM KIẾM (kết hợp tìm theo xếp loại và tìm theo tên, không phân biệt dấu/không dấu, hoa/thường)
function timKiemNhanVien() {
  // Lấy từ khóa
  let tuKhoa = getEle("searchName").value.trim();
  if (!tuKhoa) {
    // Nếu input rỗng → hiển thị lại toàn bộ danh sách
    hienThiDanhSachNhanVien();
    return;
  }

  // Chuẩn hóa từ khóa: loại bỏ dấu + chuyển về lowercase
  tuKhoa = removeAccents(tuKhoa);

  // Lọc danh sách: thỏa điều kiện họ tên hoặc xếp loại
  const ketQua = danhSachNhanVien.filter((nv) => {
    const hoTenNorm = removeAccents(nv.hoTen);
    const xepLoaiNorm = removeAccents(nv.xepLoai());
    return hoTenNorm.includes(tuKhoa) || xepLoaiNorm.includes(tuKhoa);
  });

  // Hiển thị kết quả (có thể là rỗng)
  let content = "";
  ketQua.forEach((nv) => {
    const tongLuong = nv.tinhTongLuong();
    const xepLoai = nv.xepLoai();
    content += `
      <tr>
        <td>${nv.taiKhoan}</td>
        <td>${nv.hoTen}</td>
        <td>${nv.email}</td>
        <td>${nv.ngayLam}</td>
        <td>${nv.chucVu}</td>
        <td>${tongLuong.toLocaleString()} VND</td>
        <td>${xepLoai}</td>
        <td>
          <button class="btn btn-danger btn-sm mr-1" onclick="xoaNhanVien('${nv.taiKhoan}')">Xóa</button>
          <button class="btn btn-warning btn-sm" onclick="suaNhanVien('${nv.taiKhoan}')">Sửa</button>
        </td>
      </tr>
    `;
  });
  getEle("tableDanhSach").innerHTML = content;
}

// -------------------------------------------------------
// Khi trang load xong, thực hiện khởi tạo
window.onload = function () {
  // a) Đọc dữ liệu từ localStorage (nếu có)
  getLocalStorage();

  // b) Thiết lập modal “Thêm nhân viên”
  setupModalThem();

  // c) Gán sự kiện cho nút “Thêm người dùng”
  setupBtnThemNV();

  // d) Gán sự kiện cho nút “Cập nhật”
  const btnCapNhat = getEle("btnCapNhat");
  if (btnCapNhat) {
    btnCapNhat.addEventListener("click", capNhatNhanVien);
  }

  // e) Gán sự kiện cho icon tìm kiếm (btnTimNV)
  const btnTimNV = getEle("btnTimNV");
  if (btnTimNV) {
    btnTimNV.style.cursor = "pointer";
    btnTimNV.addEventListener("click", timKiemNhanVien);
  }

  // f) Cho phép nhấn Enter trong ô input #searchName để tìm luôn
  const inputSearch = getEle("searchName");
  if (inputSearch) {
    inputSearch.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        timKiemNhanVien();
      }
    });
  }
};
