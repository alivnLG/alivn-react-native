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
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry1: true,
      secureTextEntry2: true
    };
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
            <TouchableOpacity
              style={Common.eye}
              onPress={() => {
                this.setState({
                  secureTextEntry1: !this.state.secureTextEntry1
                });
              }}
            >
              {this.state.secureTextEntry1 ? (
                <Image
                  style={Common.eyeImg}
                  source={require("../Resources/images/eye-n.png")}
                />
              ) : (
                <Image
                  style={Common.eyeImg}
                  source={require("../Resources/images/eye-y.png")}
                />
              )}
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
            <TouchableOpacity
              style={Common.eye}
              onPress={() => {
                this.setState({
                  secureTextEntry2: !this.state.secureTextEntry2
                });
              }}
            >
              {this.state.secureTextEntry2 ? (
                <Image
                  style={Common.eyeImg}
                  source={require("../Resources/images/eye-n.png")}
                />
              ) : (
                <Image
                  style={Common.eyeImg}
                  source={require("../Resources/images/eye-y.png")}
                />
              )}
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

            <TouchableOpacity
              style={styles.scan}
              onPress={() => {
                Actions.replace("scan");
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
