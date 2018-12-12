"use strict";

// Custom default rules to validate form fields
const Rules = {
  numbers: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
  email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
  int: /^\d+$/,
  twoint:/^[1-9][0-9]{0,4}$/,
  bit: /^[1-9]{1}\d*(.\d{1,8})?$|^0.\d{1,8}$/,
  rmb: /^[1-9]{1}\d*(.\d{1,2})?$|^0.\d{1,2}$/,
  required(type, value) {
    if (type) {
      value = !!value ? value : "";
      return value !== "";
    }
  },
  minlength(length, value) {
    value = !!value ? value : "";
    value = value.replace(/[^\x00-\xff]/g, "01");
    if (length === void 0) {
      throw "ERROR: It is not a valid length, checkout your minlength settings.";
    } else if (value.length >= length) {
      return true;
    }
    return false;
  },
  maxlength(length, value) {
    value = !!value ? value : "";
    value = value.replace(/[^\x00-\xff]/g, "01");
    if (length === void 0) {
      throw "ERROR: It is not a valid length, checkout your maxlength settings.";
    } else if (value.length > length) {
      return false;
    }
    return true;
  },
  compare(type, value, pwd) {
    if (type) {
      return value === pwd;
    }
  },
  floatNum(type, value) {
    if (type) {
      let isNumber = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/;
      if (value.substr(value.length - 1, 1) == "." || isNumber.test(value)) {
        return true;
      }
      return false;
    }
  },
  address: /^0x([0-9a-zA-z]{40})$/
};

export default Rules;
