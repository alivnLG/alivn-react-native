import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import Axios from "axios";
import { validate, submit, getErrorsInField } from "../Common/validate";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: "",
      email: "",
      code: "",
      password: "",
      passwordver: "",
      refUser: "",
      secureTextEntry1: true,
      secureTextEntry2: true,
      codeTxt: "发送验证码",
      count: 60
    };
  }

  //接收扫描到的数据
  componentWillReceiveProps(nextProps) {
    if (nextProps.scanData) {
      this.setState({
        refUser: nextProps.scanData
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }
  //发送验证码
  timeEr = null;
  _getCode() {
    if (this.state.codeTxt == "发送验证码") {
      Axios.post("/verification/code", { email: this.state.email }).then(
        res => {
          this.timeEr = setInterval(() => {
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
              clearInterval(this.timeEr);
            }
          }, 1000);
        }
      );
    }
  }
  //注册
  _postData() {
    Axios.post("/register", this.state).then(res => {
      Alert.alert({
        icon: "success",
        msg: "注册成功！",
        onClose: () => {
          Store.setItem("userinfo", res.data);
          Actions.replace("home");
        }
      });
    });
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
            onChangeText={nickname => {
              validate(this, {
                name: "nickname",
                value: nickname
              });
            }}
            placeholder="请输入昵称"
          />
          <Text style={Common.errMsg}>{getErrorsInField("nickname")}</Text>
          <TextInput
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            ref="email"
            onChangeText={email => {
              validate(this, {
                name: "email",
                value: email
              });
            }}
            style={Common.inputStyle}
            placeholder="请输入邮箱地址"
          />
          <Text style={Common.errMsg}>{getErrorsInField("email")}</Text>
          <View style={Common.itemBox}>
            <Text
              style={Common.sendCode}
              onPress={() => {
                const verData = validate(this, {
                  name: "email",
                  value: this.state.email
                });
                if (verData) {
                  this._getCode();
                }
              }}
            >
              {this.state.codeTxt}
            </Text>
            <TextInput
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              ref="code"
              style={Common.inputStyle}
              onChangeText={code => {
                validate(this, {
                  name: "code",
                  value: code
                });
              }}
              placeholder="请输入验证码"
            />
            <Text style={Common.errMsg}>{getErrorsInField("code")}</Text>
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
              onChangeText={password => {
                validate(this, {
                  name: "password",
                  value: password
                });
              }}
              placeholder="请设置密码"
            />
            <Text style={Common.errMsg}>{getErrorsInField("password")}</Text>
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
              onChangeText={passwordver => {
                validate(this, {
                  value: passwordver,
                  name: "passwordver",
                  equalName: "password"
                });
              }}
              placeholder="请再次输入密码"
            />
            <Text style={Common.errMsg}>{getErrorsInField("passwordver")}</Text>
          </View>
          <View style={Common.itemBox}>
            <TextInput
              underlineColorAndroid="transparent"
              ref="refUser"
              defaultValue={this.state.refUser}
              style={[Common.inputStyle, { paddingRight: Fit(60) }]}
              onChangeText={refUser => {
                validate(this, {
                  value: refUser,
                  name: "refUser"
                });
              }}
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
            <Text style={Common.errMsg}>{getErrorsInField("refUser")}</Text>
          </View>
          <TouchableOpacity
            underlayColor="#18a304"
            style={Common.buttonStyle}
            onPress={() => {
              const verData = submit(this);
              if (verData) {
                this._postData();
              }
            }}
          >
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
