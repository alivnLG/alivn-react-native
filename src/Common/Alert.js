import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Fit } from "./Fit";
import * as Animatable from "react-native-animatable";
let self = null;
class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationMask: "fadeIn",
      animation: "fadeIn",
      icon: "",
      msg: "",
      zIndex: -1
    };
    self = this;
  }
  Icon = {
    fail: require("../Resources/images/fail.png"),
    success: require("../Resources/images/success.png"),
    info: require("../Resources/images/info.png")
  };
  //提示弹窗
  static alert(opt) {
    self.setState({
      animationMask: "fadeIn",
      animation: "fadeIn",
      icon: opt.icon,
      msg: opt.msg,
      zIndex: 6
    });
    self._onClose = opt.onClose;
  }
  //弹窗动画完成
  _onAnimationEnd() {
    if (this.state.animation == "fadeIn") {
      setTimeout(() => {
        this.setState({
          animationMask: "fadeOut",
          animation: "fadeOut"
        });
      }, 1500);
    } else {
      if (this._onClose) {
        this._onClose();
      }
      this.setState({
        animationMask: "fadeOut",
        animation: "fadeOut",
        icon: "",
        msg: "",
        zIndex: -1
      });
    }
  }
  render() {
    return (
      <Animatable.View
        style={[styles.mask, { zIndex: this.state.zIndex }]}
        animation={this.state.animationMask}
      >
        <Animatable.View
          style={[styles.showView, { zIndex: this.state.zIndex }]}
          animation={this.state.animation}
          onAnimationEnd={this._onAnimationEnd.bind(this)}
        >
          <Image style={styles.iconImg} source={this.Icon[this.state.icon]} />
          <Text style={styles.alertMsg}>{this.state.msg}</Text>
        </Animatable.View>
      </Animatable.View>
    );
  }
}
const styles = StyleSheet.create({
  mask: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  showView: {
    paddingTop: Fit(20),
    paddingBottom: Fit(20),
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    borderRadius: 4,
    backgroundColor: "#25c063",

    justifyContent: "center",
    alignItems: "center"
  },
  iconImg: {
    width: Fit(42),
    height: Fit(42)
  },
  alertMsg: {
    color: "#fff"
  }
});
module.exports = Alert;
