const nameOpt = {
  name: {
    required: true,
    minlength: 3,
    maxlength: 7,
    messages: {
      required: "required",
      format: "format"
    }
  },
  email: {
    required: true,
    email: true,
    messages: {
      required: "请输入邮箱",
      format: "请输入正确的邮箱地址"
    }
  },
  password: {
    required: true,
    minlength: 6,
    maxlength: 18,
    messages: {
      required: "请输入密码",
      format: "密码长度为6-18位字符"
    }
  },
  passwordver: {
    required: true,
    compare: true,
    messages: {
      required: "请再次输入密码",
      format: "密码不一致"
    }
  },
  capitalpwd: {
    required: true,
    minlength: 6,
    maxlength: 6,
    int: true,
    messages: {
      required: "请输入资金密码",
      format: "资金密码为6位数字"
    }
  },
  capitalpwdver: {
    required: true,
    compare: true,
    messages: {
      required: "请再次输入密码",
      format: "密码不一致"
    }
  },
  newpwd: {
    required: true,
    minlength: 6,
    maxlength: 6,
    int: true,
    messages: {
      required: "请输入资金密码",
      format: "资金密码不是6位数字"
    }
  },
  newpwdver: {
    required: true,
    compare: true,
    messages: {
      required: "请再次输入密码",
      format: "密码不一致"
    }
  },
  nickname: {
    required: true,
    minlength: 4,
    maxlength: 10,
    messages: {
      required: "请输入昵称",
      format: "昵称长度为4-10位字符"
    }
  },
  code: {
    required: true,
    minlength: 6,
    maxlength: 6,
    int: true,
    messages: {
      required: "请输入验证码",
      format: "验证码为6位数字组成"
    }
  },
  refUser: {
    required: true,
    minlength: 6,
    maxlength: 6,
    messages: {
      required: "请输入邀请码",
      format: "邀请码为6位字符组成"
    }
  },
  frozen: {
    required: true,
    bit: true,
    messages: {
      required: "请输入锁定数量",
      format: "锁定数量格式不正确"
    }
  },
  quantity: {
    required: true,
    bit: true,
    messages: {
      required: "请输入BGAA数量",
      format: "BGAA数量格式不正确"
    }
  },
  buyETHNumber: {
    required: true,
    bit: true,
    messages: {
      required: "请输入ETH数量",
      format: "ETH数量格式不正确"
    }
  },
  unitPrice: {
    required: true,
    rmb: true,
    messages: {
      required: "请输入挂单单价",
      format: "您输入的单价有误，最多输入2位小数"
    }
  },
  unitQuantity: {
    required: true,
    bit: true,
    messages: {
      required: "请输入挂单数量",
      format: "您输入的数量有误，最多输入8位小数"
    }
  },
  purchaseQuantity: {
    required: true,
    bit: true,
    messages: {
      required: "请输入BGAA数量",
      format: "购买数量格式不正确"
    }
  },
  address: {
    required: true,
    address: true,
    messages: {
      required: "请输入钱包地址",
      format: "钱包地址格式不正确"
    }
  },
  quantityT: {
    required: true,
    bit: true,
    messages: {
      required: "请输入转账数量",
      format: "转账数量格式不正确"
    }
  },
  quantityZ: {
    required: true,
    twoint: true,
    messages: {
      required: "请输入数量",
      format: "数量格式不正确且不超过5位数"
    }
  },
  quantityX: {
    required: true,
    bit: true,
    messages: {
      required: "请输入出售价格",
      format: "格式不正确"
    }
  },
};

export default nameOpt;
