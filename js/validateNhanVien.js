// validateNhanVien.js

import Validation from "./validation.js";
const validation = new Validation();

export default function validateNhanVien(
  taiKhoan,
  hoTen,
  email,
  matKhau,
  ngayLam,
  luongCoBan,
  chucVu,
  gioLam,
  danhSachNV = []
) {
  let isValid = true;

  // Tài khoản
  isValid &=
    validation.checkEmpty(taiKhoan, "tbTKNV", "(*) Vui lòng nhập tài khoản") &&
    validation.checkLength(taiKhoan, "tbTKNV", "(*) Tài khoản phải từ 4 đến 6 ký số", 4, 6);
 
  // Họ tên
  isValid &=
    validation.checkEmpty(hoTen, "tbTen", "(*) Vui lòng nhập họ tên") &&
    validation.checkString(hoTen, "tbTen", "(*) Họ tên phải là chữ");

  // Email
  isValid &=
    validation.checkEmpty(email, "tbEmail", "(*) Vui lòng nhập email") &&
    validation.checkEmail(email, "tbEmail", "(*) Email không đúng định dạng");

  // Mật khẩu
  isValid &=
    validation.checkEmpty(matKhau, "tbMatKhau", "(*) Vui lòng nhập mật khẩu") &&
    validation.checkPassword(
      matKhau,
      "tbMatKhau",
      "(*) Mật khẩu 6–10 ký tự, có số, hoa, ký tự đặc biệt"
    );

  // Ngày làm
  isValid &=
    validation.checkEmpty(ngayLam, "tbNgay", "(*) Vui lòng nhập ngày làm") &&
    validation.checkDate(ngayLam, "tbNgay", "(*) Định dạng ngày không hợp lệ");

  // Lương cơ bản
  isValid &=
    validation.checkEmpty(luongCoBan, "tbLuongCB", "(*) Vui lòng nhập lương cơ bản") &&
    validation.checkSalary(luongCoBan, "tbLuongCB", "(*) Lương phải từ 1tr - 20tr");

  // Chức vụ
  isValid &= validation.checkSelectOption("chucvu", "tbChucVu", "(*) Vui lòng chọn chức vụ");

  // Giờ làm
  isValid &=
    validation.checkEmpty(gioLam, "tbGiolam", "(*) Vui lòng nhập số giờ làm") &&
    validation.checkWorkingHours(gioLam, "tbGiolam", "(*) Giờ làm từ 80–200 giờ");

  return Boolean(isValid);
}
