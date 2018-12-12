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
import Nav from "../Component/Nav";
import Axios from "axios";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry1: true,
      secureTextEntry2: true,
      scanData: "",
      codeTxt: "发送验证码",
      count: 60,
      email: ""
    };
  }

  //接收扫描到的数据
  componentWillReceiveProps(nextProps) {
    if (nextProps.scanData) {
      this.setState({
        scanData: nextProps.scanData
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }
  //发送验证码
  _postCode() {
    if (this.state.codeTxt == "发送验证码") {
      Axios.post("/verification/code", { email: this.state.email }).then(
        res => {
          setInterval(() => {
            this.setState({
              codeTxt: this.state.count + " s"
            });
            if (this.state.count > 0) {
              this.state.count--;
            } else if (this.state.count == 0) {
              this.setState({
                codeTxt: "发送验证码",
                count: 60
              });
            }
          }, 1000);
        }
      );
    }
  }

  render() {
    return (
      <View style={Common.container}>
        <Nav title="邮箱注册" leftType="icon" />
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
            onChangeText={email => {
              this.setState({
                email: email
              });
            }}
            style={Common.inputStyle}
            placeholder="请输入邮箱地址"
          />
          <View style={Common.itemBox}>
            <Text
              style={Common.sendCode}
              onPress={() => {
                this._postCode();
              }}
            >
              {this.state.codeTxt}
            </Text>
            <TextInput
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              ref="code"
              style={Common.inputStyle}
              placeholder="请输入验证码"
            />
          </View>
          <View style={Common.itemBox}>
            <TouchableOpacity
              style={Common.eye}
              onPress={() => {
                this.setState({
                  secureTextEntry1: !this.state.secureTextEntry1
                });
              }}
            >
              <Image
                style={Common.eyeImg}
                source={
                  this.state.secureTextEntry1
                    ? require("../Resources/images/eye-n.png")
                    : require("../Resources/images/eye-y.png")
                }
              />
            </TouchableOpacity>
            <TextInput
              underlineColorAndroid="transparent"
              ref="password"
              style={Common.inputStyle}
              secureTextEntry={this.state.secureTextEntry1 ? true : false}
              placeholder="请设置密码"
            />
          </View>
          <View style={Common.itemBox}>
            <TouchableOpacity
              style={Common.eye}
              onPress={() => {
                this.setState({
                  secureTextEntry2: !this.state.secureTextEntry2
                });
              }}
            >
              <Image
                style={Common.eyeImg}
                source={
                  this.state.secureTextEntry2
                    ? require("../Resources/images/eye-n.png")
                    : require("../Resources/images/eye-y.png")
                }
              />
            </TouchableOpacity>
            <TextInput
              underlineColorAndroid="transparent"
              ref="passwordver"
              style={Common.inputStyle}
              secureTextEntry={this.state.secureTextEntry2 ? true : false}
              placeholder="请再次输入密码"
            />
          </View>
          <View style={Common.itemBox}>
            <TextInput
              underlineColorAndroid="transparent"
              ref="refUser"
              value={this.state.scanData}
              style={[Common.inputStyle, { paddingRight: Fit(60) }]}
              placeholder="请输入邀请码"
            />

            <TouchableOpacity
              style={styles.scan}
              onPress={() => {
                Actions.push("scan");
              }}
            >
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
