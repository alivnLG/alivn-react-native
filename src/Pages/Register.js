import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import { Actions } from "react-native-router-flux";
import Common from "../styles/Common";
import Nav from "../Common/Nav";
class Register extends Component {
  constructor(props) {
    super(props);
  }
  _postData() {
    axios.post("/register", this.state).then(res => {
      alert({
        title: "消息",
        msg: "注册成功！",
        onClose: function() {
          Store.setItem("userinfo", res.data);
          Actions.replace("home");
        }
      });
    });
  }
  _sendCode() {
    if (this.state.codeText == "获取验证码") {
      axios
        .post("/verification/code", {
          email: this.state.email
        })
        .then(res => {
          this.setState({
            codeText: this.time + "s"
          });
          this.timer = setInterval(() => {
            this.time;
            if (this.time >= 0) {
              this.setState({
                codeText: this.time-- + "s"
              });
            } else {
              this.setState({
                codeText: "获取验证码"
              });
              clearInterval(this.time);
            }
          }, 1000);
        })
        .catch(err => {
          this.time = 60;
          this.setState({
            codeText: "获取验证码"
          });
          this.setState({
            codeText: "获取验证码"
          });
          clearInterval(this.time);
        });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  render() {
    return (
      <View style={Common.container}>
        <Nav title="邮箱注册" />
        <View style={Common.fromBox}>
          <TextInput
            underlineColorAndroid="transparent"
            style={Common.inputStyle}
            ref="nickname"
            placeholder="请输入昵称"
          />
          <TextInput
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            ref="email"
            style={Common.inputStyle}
            placeholder="请输入邮箱地址"
          />
          <View style={Common.itemBox}>
            <Text style={Common.sendCode}>发送验证码</Text>
            <TextInput
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              ref="code"
              style={Common.inputStyle}
              placeholder="请输入验证码"
            />
          </View>
          <View style={Common.itemBox}>
            <TouchableOpacity style={Common.eye}>
              <Image
                style={Common.eyeImg}
                source={require("../Resources/images/eye-y.png")}
              />
            </TouchableOpacity>
            <TextInput
              underlineColorAndroid="transparent"
              ref="password"
              style={Common.inputStyle}
              secureTextEntry={true}
              placeholder="请设置密码"
            />
          </View>
          <View style={Common.itemBox}>
            <TouchableOpacity style={Common.eye}>
              <Image
                style={Common.eyeImg}
                source={require("../Resources/images/eye-y.png")}
              />
            </TouchableOpacity>
            <TextInput
              underlineColorAndroid="transparent"
              ref="passwordver"
              style={Common.inputStyle}
              secureTextEntry={true}
              placeholder="请再次输入密码"
            />
          </View>
          <View style={Common.itemBox}>
            <TextInput
              underlineColorAndroid="transparent"
              ref="refUser"
              style={Common.inputStyle}
              placeholder="请输入邀请码"
            />

            <TouchableOpacity style={styles.scan}>
              <Image
                style={styles.scanImg}
                source={require("../Resources/images/scan.png")}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity underlayColor="#18a304" style={Common.buttonStyle}>
            <Text style={Common.buttonTextStyle}>注册</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scan: {
    position: "absolute",
    right: -Fit(10),
    top: Fit(35),
    width: Fit(56),
    height: Fit(56),
    zIndex: Fit(2)
  },
  scanImg: {
    width: Fit(30),
    height: Fit(30)
  }
});

module.exports = Register;
