function getEle(id) {
  return document.getElementById(id);
}

class Validation {
  checkEmpty(value, idNoti, mess) {
    if (value.trim() === "") {
      getEle(idNoti).innerHTML = mess;
      getEle(idNoti).style.display = "block";
      return false;
    }
    getEle(idNoti).innerHTML = "";
    getEle(idNoti).style.display = "none";
    return true;
  }

  checkLength(value, idNoti, mess, min, max) {
    const length = value.trim().length;
    if (length >= min && length <= max) {
      getEle(idNoti).innerHTML = "";
      getEle(idNoti).style.display = "none";
      return true;
    }
    getEle(idNoti).innerHTML = mess;
    getEle(idNoti).style.display = "block";
    return false;
  }

  checkString(value, idNoti, mess) {
    const pattern = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (pattern.test(value.trim())) {
      getEle(idNoti).innerHTML = "";
      getEle(idNoti).style.display = "none";
      return true;
    }
    getEle(idNoti).innerHTML = mess;
    getEle(idNoti).style.display = "block";
    return false;
  }

  checkEmail(value, idNoti, mess) {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (pattern.test(value.trim())) {
      getEle(idNoti).innerHTML = "";
      getEle(idNoti).style.display = "none";
      return true;
    }
    getEle(idNoti).innerHTML = mess;
    getEle(idNoti).style.display = "block";
    return false;
  }

  checkPassword(value, idNoti, mess) {
    const pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{6,10}$/;
    if (pattern.test(value.trim())) {
      getEle(idNoti).innerHTML = "";
      getEle(idNoti).style.display = "none";
      return true;
    }
    getEle(idNoti).innerHTML = mess;
    getEle(idNoti).style.display = "block";
    return false;
  }

  checkDate(value, idNoti, mess) {
    const pattern = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (pattern.test(value.trim())) {
      getEle(idNoti).innerHTML = "";
      getEle(idNoti).style.display = "none";
      return true;
    }
    getEle(idNoti).innerHTML = mess;
    getEle(idNoti).style.display = "block";
    return false;
  }

  checkSalary(value, idNoti, mess, min = 1000000, max = 20000000) {
    const salary = Number(value);
    if (!isNaN(salary) && salary >= min && salary <= max) {
      getEle(idNoti).innerHTML = "";
      getEle(idNoti).style.display = "none";
      return true;
    }
    getEle(idNoti).innerHTML = mess;
    getEle(idNoti).style.display = "block";
    return false;
  }

  checkWorkingHours(value, idNoti, mess, min = 80, max = 200) {
    const hours = Number(value);
    if (!isNaN(hours) && hours >= min && hours <= max) {
      getEle(idNoti).innerHTML = "";
      getEle(idNoti).style.display = "none";
      return true;
    }
    getEle(idNoti).innerHTML = mess;
    getEle(idNoti).style.display = "block";
    return false;
  }

  checkSelectOption(idSelect, idNoti, mess) {
    if (getEle(idSelect).selectedIndex !== 0) {
      getEle(idNoti).innerHTML = "";
      getEle(idNoti).style.display = "none";
      return true;
    }
    getEle(idNoti).innerHTML = mess;
    getEle(idNoti).style.display = "block";
    return false;
  }
}

export default Validation;
