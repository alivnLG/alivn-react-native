import React, { Component } from "react";
import { View, TextInput, Text, Image, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import { validate, submit, getErrorsInField } from "../Common/validate";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
class Forget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      code: "",
      password: "",
      passwordver: "",
      count: 60,
      codeTxt: "发送验证码",
      secureTextEntry1: true,
      secureTextEntry2: true
    };
  }

  //发送验证码
  timeEr = null;
  _getCode() {
    if (this.state.codeTxt == "发送验证码") {
      Axios.post("/verification/code?type=forgetpwd", {
        email: this.state.email
      }).then(res => {
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
      });
    }
  }

  _postData() {
    Axios.post("/updatePassword", this.state).then(res => {
      Alert.alert({
        icon: "info",
        msg: "密码更新成功，请重新登录！",
        onClose: () => {
          Actions.reset("login");
        }
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  render() {
    return (
      <View style={Common.container}>
        <Nav title="忘记密码" leftType="icon" />
        <View style={Common.fromBox}>
          <TextInput
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            ref="email"
            style={Common.inputStyle}
            onChangeText={email => {
              validate(this, {
                value: email,
                name: "email"
              });
            }}
            placeholder="请输入邮箱地址"
          />
          <Text style={Common.errMsg}>{getErrorsInField("email")}</Text>
          <View style={Common.itemBox}>
            <Text
              onPress={() => {
                const verData = validate(this, {
                  value: this.state.email,
                  name: "email"
                });
                if (verData) {
                  this._getCode();
                }
              }}
              style={Common.sendCode}
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
                  value: code,
                  name: "code"
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
              secureTextEntry={this.state.secureTextEntry1}
              onChangeText={password => {
                validate(this, {
                  value: password,
                  name: "password"
                });
              }}
              placeholder="请设置新密码"
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
              secureTextEntry={this.state.secureTextEntry2}
              ref="passwordver"
              style={Common.inputStyle}
              onChangeText={passwordver => {
                validate(this, {
                  value: passwordver,
                  name: "passwordver",
                  equalName: "password"
                });
              }}
              placeholder="请确认新密码"
            />
          </View>
          <Text style={Common.errMsg}>
            {getErrorsInField("passwordver")}
          </Text>
          <TouchableOpacity
            underlayColor="#18a304"
            onPress={() => {
              const verData = submit(this);
              if (verData) {
                this._postData();
              }
            }}
            style={Common.buttonStyle}
          >
            <Text style={Common.buttonTextStyle}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
module.exports = Forget;
