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
class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationMask: "fadeIn",
      animation: "fadeInUp",
      icon: "",
      msg: "",
      cancelTxt: "取消",
      okTxt: "确认",
      zIndex: -1
    };
    self = this;
  }
  Icon = {
    fail: require("../Resources/images/fail.png"),
    success: require("../Resources/images/success.png"),
    info: require("../Resources/images/info.png"),
    logout: require("../Resources/images/logout.png")
  };
  //询问弹窗
  static confirm(opt) {
    self.setState({
      animationMask: "fadeIn",
      animation: "fadeInUp",
      icon: opt.icon,
      msg: opt.msg,
      cancelTxt: opt.cancelTxt ? opt.cancelTxt : "取消",
      okTxt: opt.okTxt ? opt.okTxt : "确定",
      zIndex: 6
    });
    self._onCancel = opt.onCancel;
    self._onOk = opt.onOk;
  }
  //隐藏弹窗，层级还在
  _hide() {
    this.setState({
      animationMask: "fadeOut",
      animation: "fadeOutDown"
    });
  }
  //真实隐藏弹窗，层级最低
  _hideTrue() {
    this.setState({
      animationMask: "fadeOut",
      animation: "fadeOutDown",
      icon: "",
      msg: "",
      zIndex: -1
    });
  }

  //弹窗动画完成
  _onAnimationEnd() {
    if (this.state.animation == "fadeOutDown") {
      this._hideTrue();
    }
  }

  //点击取消按钮
  _cancelConfirm() {
    if (this._onCancel) {
      this._hideTrue();
      this._onCancel();
    } else {
      this._hide();
    }
  }
  //点击确定
  _okConfirm() {
    if (this._onOk) {
      this._hideTrue();
      this._onOk();
    } else {
      this._hide();
    }
  }

  render() {
    return (
      <View style={[styles.confirmView, { zIndex: this.state.zIndex }]}>
        <Animatable.View
          style={[styles.mask, { zIndex: this.state.zIndex }]}
          animation={this.state.animationMask}
        />
        <Animatable.View
          style={[styles.showView, { zIndex: this.state.zIndex }]}
          animation={this.state.animation}
          onAnimationEnd={this._onAnimationEnd.bind(this)}
        >
          <View style={styles.top}>
            <Image style={styles.iconImg} source={this.Icon[this.state.icon]} />
            <View style={styles.confirmMsg}>
              <Text style={styles.alertMsg}>{this.state.msg}</Text>
            </View>
          </View>

          <View style={styles.confirmBtn}>
            <TouchableOpacity
              style={[styles.btnStyle, styles.cancelBtn]}
              onPress={() => {
                this._cancelConfirm();
              }}
            >
              <Text style={styles.btnTxt}>{this.state.cancelTxt}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnStyle, styles.okBtn]}
              onPress={() => {
                this._okConfirm();
              }}
            >
              <Text style={styles.btnTxt}>{this.state.okTxt}</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  confirmView: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  mask: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  showView: {
    backgroundColor: "#fff",
    width: Fit(400),
    borderRadius: 6,
    overflow: "hidden"
  },
  top: {
    backgroundColor: "#25c063",
    padding: Fit(30),
    justifyContent: "center",
    alignItems: "center"
  },
  iconImg: {
    width: Fit(42),
    height: Fit(42)
  },
  alertMsg: {
    color: "#fff"
  },
  confirmMsg: {
    marginTop: Fit(10)
  },
  confirmBtn: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: Fit(20),
    paddingBottom: Fit(20)
  },
  btnStyle: {
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    height: Fit(48),
    borderRadius: Fit(20),
    justifyContent: "center",
    alignItems: "center"
  },
  cancelBtn: {
    backgroundColor: "#C8C8C8"
  },
  okBtn: {
    backgroundColor: "#25c063"
  },
  btnTxt: {
    color: "#fff"
  }
});
module.exports = Confirm;
