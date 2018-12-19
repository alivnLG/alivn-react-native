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
import { validate, submit, getErrorsInField } from "../Common/validate";
import Common from "../styles/Common";
import Nav from "../Component/Nav";

class UpdateCapitalPwd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      capemail: "",
      code: "",
      newpwd: "",
      newpwdver: "",
      codeTxt: "发送验证码",
      secureTextEntry1: true,
      secureTextEntry2: true,
      count: 60
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentDidMount() {
    this._getUserinfo();
  }

  _getUserinfo() {
    Axios.get("/users/info").then(res => {
      this.setState({
        capemail: res.data.email
      });
    });
  }

  //发送验证码
  timeEr = null;
  _getCode() {
    if (this.state.codeTxt == "发送验证码") {
      Axios.post("/verification/code?type=selfevent", {
        type: "email"
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

  _updateCapitalpwd() {
    Axios.post("/updateTradePwd", {
      email: this.state.capemail,
      code: this.state.code,
      newpwd: this.state.newpwd
    }).then(res => {
      Alert.alert({
        icon: "success",
        msg: "密码更新成功！",
        onClose: ()=> {
          Actions.pop();
        }
      });
    });
  }

  render() {
    return (
      <View style={Common.container}>
        <Nav leftType="icon" title="修改资金密码" />
        <View style={Common.fromBox}>
          <Text style={styles.ttxt}>
            您已设置资金密码，如需修改请根据以下提示修改
          </Text>
          <View style={Common.itemBox}>
            <TextInput
              keyboardType="email-address"
              underlineColorAndroid="transparent"
              style={Common.inputStyle}
              editable={false}
              value={this.state.capemail}
            />
          </View>
          <View style={Common.itemBox}>
            <Text
              onPress={() => {
                this._getCode();
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
              ref="newpwd"
              style={Common.inputStyle}
              secureTextEntry={this.state.secureTextEntry1}
              onChangeText={newpwd => {
                validate(this, {
                  value: newpwd,
                  name: "newpwd"
                });
              }}
              placeholder="请设置新密码"
            />
            <Text style={Common.errMsg}>{getErrorsInField("newpwd")}</Text>
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
              ref="newpwdver"
              style={Common.inputStyle}
              onChangeText={newpwdver => {
                validate(this, {
                  value: newpwdver,
                  name: "newpwdver",
                  equalName: "newpwd"
                });
              }}
              placeholder="请确认新密码"
            />
            <Text style={Common.errMsg}>
              {getErrorsInField("newpwdver")}
            </Text>
          </View>
          <TouchableOpacity
            underlayColor="#18a304"
            onPress={() => {
              const verData = submit(this);
              if (verData) {
                this._updateCapitalpwd();
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

const styles = StyleSheet.create({
  ttxt: {
    paddingTop: Fit(20),
    paddingBottom: Fit(30),
    backgroundColor: "#fff",
    color: "#8F8F8F",
    fontSize: Fit(26),
    lineHeight: Fit(36)
  }
});

module.exports = UpdateCapitalPwd;
