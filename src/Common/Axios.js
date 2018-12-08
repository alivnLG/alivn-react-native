import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity
} from "react-native";
import axios from "axios";
import Store from "./Store";
import { Actions } from "react-native-router-flux";
//配置
axios.defaults.baseURL = "http://192.168.0.30/team/";
axios.defaults.timeout = 0;

let userinfo = Store.getItem("userinfo");
let headers = {
  "accept-language": "zh-CN"
};
if (userinfo) {
  headers["X-Auth-User"] = userinfo.username;
  headers["X-Auth-Token"] = userinfo.token;
}

//拦截器
axios.interceptors.request.use(
  config => {
    //console.log(config);
    // Do something before request is sent
    let userinfo = Store.getItem("userinfo");
    let headers = {
      "accept-language": "zh-CN"
    };
    if (userinfo) {
      headers["X-Auth-User"] = userinfo.username;
      headers["X-Auth-Token"] = userinfo.token;
    }
    config.headers = headers;
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 添加一个响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.status.code > 0) {
      Alert.alert({
        icon: "info",
        msg: response.data.status.message
      });
      return Promise.reject();
    } else {
      return response.data;
    }
  },
  error => {
    if (error.response.status == "403") {
      Alert.alert({
        icon: "fail",
        msg: "权限不足！",
        onClose: () => {
          Actions.reset("login");
        }
      });
    } else if (error.response.status == "401") {
      Alert.alert({
        icon: "fail",
        msg: "登录已失效！",
        onClose: () => {
          Actions.reset("login");
        }
      });
    } else if (error.response.status == "500") {
      Alert.alert({
        icon: "fail",
        msg: "网络错误！"
      });
    }
    return Promise.reject(error);
  }
);

export default axios;
