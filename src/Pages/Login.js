import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Actions } from "react-native-router-flux";
import Common from "../styles/Common";
import Axios from "axios";
import { validate, submit, getErrorsInField } from "../Common/validate";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      secureTextEntry: true
    };
  }
  componentDidMount() {
    Store.setItem("userinfo", {});
  }
  _postData() {
    Store.setItem("userinfo", {});
    Axios.post("/login", this.state).then(function(res) {
      Store.setItem("userinfo", res.data);
      Actions.reset("tabbar");
    });
  }
  render() {
    return (
      <View style={Common.container}>
        <View style={styles.logoBox}>
          <Image
            style={styles.logo}
            source={require("../Resources/images/logo.png")}
          />
        </View>
        <View style={Common.fromBox}>
          <TextInput
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            style={Common.inputStyle}
            ref="email"
            onChangeText={email => {
              validate(this, {
                name: "email",
                value: email
              });
            }}
            placeholder="请输入正确的邮箱地址"
          />
          <Text style={Common.errMsg}>{getErrorsInField("email")}</Text>
          <View style={Common.itemBox}>
            <TouchableOpacity
              style={Common.eye}
              onPress={() => {
                this.setState({
                  secureTextEntry: !this.state.secureTextEntry
                });
              }}
            >
              <Image
                style={Common.eyeImg}
                source={
                  this.state.secureTextEntry
                    ? require("../Resources/images/eye-n.png")
                    : require("../Resources/images/eye-y.png")
                }
              />
            </TouchableOpacity>
            <TextInput
              secureTextEntry={this.state.secureTextEntry}
              underlineColorAndroid="transparent"
              style={Common.inputStyle}
              ref="password"
              onChangeText={password => {
                validate(this, {
                  name: "password",
                  value: password
                });
              }}
              placeholder="请输入密码"
            />
            <Text style={Common.errMsg}>{getErrorsInField("password")}</Text>
          </View>
          <View style={Common.flexContent}>
            <Text onPress={Actions.forget} style={Common.rightText}>
              忘记密码
            </Text>
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
            <Text style={Common.buttonTextStyle}>登录</Text>
          </TouchableOpacity>
          <View style={[Common.flexContent]}>
            <Text onPress={Actions.register} style={Common.rightText}>
              新用户？去注册
            </Text>
          </View>
        </View>
        <Image
          style={styles.footer}
          source={require("../Resources/images/footer.png")}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  logo: {
    width: Fit(335),
    height: Fit(130)
  },
  logoBox: {
    justifyContent: "center",
    alignItems: "center",
    height: Fit(416)
  },
  footer: {
    position: "absolute",
    top: SCREEN_HEIGHT - Fit(134),
    width: Fit(750),
    height: Fit(134)
  }
});
module.exports = Login;
