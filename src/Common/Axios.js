import axios from "axios";
import { Toast } from "teaset";
//配置
axios.defaults.baseURL = "http://192.168.0.30/team/";
axios.defaults.timeout = 0;
//拦截器
debugger;
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    debugger;
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 添加一个响应拦截器
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axios;
