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
//配置
axios.defaults.baseURL = "http://192.168.0.30/team/";
axios.defaults.timeout = 0;
//拦截器

axios.interceptors.request.use(
  config => {
    //console.log(config);
    // Do something before request is sent
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
    // Do something with response data
    return response;
  },
  error => {
    if (error.response.status == "403") {
      <Modal type="Alert" msg="权限不足！" />;
    }
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axios;
