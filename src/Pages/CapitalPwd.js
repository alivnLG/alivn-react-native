import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import { validate, submit, getErrorsInField } from "../Common/validate";
import Common from "../styles/Common";
import Nav from "../Component/Nav";

class CapitalPwd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      capitalpwd: "",
      capitalpwdver: "",
      capitalpwdEntry1: true,
      capitalpwdEntry2: true
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }
  _updatePassword() {
    Axios.post("/tradePwd", {
      newpwd: this.state.capitalpwd
    }).then(res => {
      Alert.alert({
        icon: "success",
        msg: "资金密码设置成功！",
        onClose: () => {
          let userinfo = Store.getItem("userinfo");
          userinfo.hasTradePwd = true;
          Store.setItem("userinfo", userinfo);
          Actions.pop();
        }
      });
    });
  }

  render() {
    return (
      <View style={Common.container}>
        <Nav leftType="icon" title="设置资金密码" />
        <View style={Common.fromBox}>
          <Text style={styles.txtTs}>
            设置资金密码将用于数字资产的提款，保护您的数字资产不被他人轻易盗用。
          </Text>
          <View style={Common.itemBox}>
            <TouchableOpacity
              style={Common.eye}
              onPress={() => {
                this.setState({
                  capitalpwdEntry1: !this.state.capitalpwdEntry1
                });
              }}
            >
              <Image
                style={Common.eyeImg}
                source={
                  this.state.capitalpwdEntry1
                    ? require("../Resources/images/eye-n.png")
                    : require("../Resources/images/eye-y.png")
                }
              />
            </TouchableOpacity>
            <TextInput
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              style={Common.inputStyle}
              placeholder="请输入资金密码"
              ref="capitalpwd"
              style={Common.inputStyle}
              secureTextEntry={this.state.capitalpwdEntry1}
              onChangeText={capitalpwd => {
                validate(this, {
                  value: capitalpwd,
                  name: "capitalpwd"
                });
              }}
            />
            <Text style={Common.errMsg}>{getErrorsInField("capitalpwd")}</Text>
          </View>
          <View style={Common.itemBox}>
            <TouchableOpacity
              style={Common.eye}
              onPress={() => {
                this.setState({
                  capitalpwdEntry2: !this.state.capitalpwdEntry2
                });
              }}
            >
              <Image
                style={Common.eyeImg}
                source={
                  this.state.capitalpwdEntry2
                    ? require("../Resources/images/eye-n.png")
                    : require("../Resources/images/eye-y.png")
                }
              />
            </TouchableOpacity>
            <TextInput
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              style={Common.inputStyle}
              placeholder="请确认资金密码"
              ref="capitalpwdver"
              style={Common.inputStyle}
              secureTextEntry={this.state.capitalpwdEntry2}
              onChangeText={capitalpwdver => {
                validate(this, {
                  value: capitalpwdver,
                  name: "capitalpwdver",
                  equalName: "capitalpwd"
                });
              }}
            />
            <Text style={Common.errMsg}>
              {getErrorsInField("capitalpwdver")}
            </Text>
          </View>

          <TouchableOpacity
            underlayColor="#18a304"
            style={Common.buttonStyle}
            onPress={() => {
              const verData = submit(this);
              if (verData) {
                this._updatePassword();
              }
            }}
          >
            <Text style={Common.buttonTextStyle}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txtTs: {
    paddingTop: Fit(20),
    paddingBottom: Fit(20),
    backgroundColor: "#fff",
    color: "#8F8F8F",
    fontSize: Fit(26),
    lineHeight: Fit(36)
  }
});

module.exports = CapitalPwd;
