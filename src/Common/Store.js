import React, { Component } from "react";
import Realm from "realm";
const storeData = {
  name: "storeData",
  properties: {
    key: "string",
    value: "string"
  }
};
// 根据提供的表初始化 Realm，可同时往数组中放入多个表
let realm = new Realm({ schema: [storeData] });
class localStorage extends Component {
  //存储数据
  static setItem(key, value) {
    try {
      realm.write(() => {
        let findData = realm.objects("storeData").filtered(`key == '${key}'`);
        realm.delete(findData);
        realm.create("storeData", {
          key: key,
          value: JSON.stringify(value)
        });
      });
    } catch (e) {
      console.log("存储失败！");
    }
  }
  //查询数据
  static getItem(key) {
    let findData = realm.objects("storeData").filtered(`key == '${key}'`);
    if (findData.length > 0) {
      return findData[0].value == "{}" ? null : JSON.parse(findData[0].value);
    } else {
      return "未找到数据";
    }
  }
}

module.exports = localStorage;
