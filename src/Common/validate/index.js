"use strict";

import Rules from "./Rules";
import nameOpt from "./nameOpt";

import { Keyboard } from "react-native";

let errors = {};
let errorsData = {};

import TextInputState from "react-native/lib/TextInputState";

let currentlyFocusedID = null;

let isSubmit = false;


const validate = (self, opt) => {
  //opt.nameOpt = Object.assign(nameOpt, opt.nameOpt || {});

  if (TextInputState._currentlyFocusedID) {
    currentlyFocusedID = null;
  }

  for (let key in self.refs) {
    const item = self.refs[key];
    if (key != opt.name) item.blur();
  }

  const valOpt = Object.assign(nameOpt[opt.name] || {}, opt.nameOpt || {});

  opt.Rules = Object.assign(Rules, opt.Rules || {});
  if (opt.name == "" || !opt.name) {
    throw new Error("验证主键不存在。。。。。");
  }

  self.state[opt.name] = opt.value;

  //self.setState( self.state);
  if (!valOpt) {
    throw new Error("验证条件不存在。。。。。");
  }

  for (let key in valOpt) {
    if (key != "messages") {
      const isRuleFn = typeof opt.Rules[key] == "function";
      const isRegExp = opt.Rules[key] instanceof RegExp;
      const equalValue = self.state[opt.equalName] || "";
      const errMsg =
        key == "required" ? valOpt.messages.required : valOpt.messages.format;
      if (
        (isRuleFn && !Rules[key](valOpt[key], opt.value, equalValue)) ||
        (isRegExp && !opt.Rules[key].test(opt.value))
      ) {
        errors[opt.name] = errMsg;       
        break;
      } else {
        delete errors[opt.name];
      }
    }
  }

  if(errors[opt.name] !== errorsData[opt.name]){   
    let errMsgData = {}
    errMsgData[`${opt.name}ErrMsg`] = errors[opt.name];
    errMsgData[opt.name] = opt.value;
    self.setState(errMsgData);
    errorsData[opt.name] = errors[opt.name];
  }

  return isSubmit ? false : !errors[opt.name];
};

const submit = self => {
  try {
    Keyboard.dismiss();
    TextInputState.focusTextInput(currentlyFocusedID);
    TextInputState.blurTextInput(currentlyFocusedID);
  } catch (error) { }

  isSubmit = true;
  errors = {};
  for (let key in self.refs) {
    const item = self.refs[key];
    if (typeof item.props.onChangeText == "function")
      item.props.onChangeText.call(self, self.state[key] || "");
  }
  isSubmit = false;
  return Object.keys(errors).length === 0;
};

const getErrorsInField = fieldName => {

  return errors[fieldName];
};

export { validate, submit, getErrorsInField };
