import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Keyboard,
  TouchableOpacity
} from "react-native";
import { Fit } from "./Fit";
import * as Animatable from "react-native-animatable";
import { Actions } from "react-native-router-flux";
let self = null;
class TradePannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      animationMask: "fadeIn",
      animation: "fadeInUpBig",
      title: "",
      msg: "",
      zIndex: -1
    };
    self = this;
  }

  data = [];
  //显示弹窗
  static tradePannel(opt) {
    Keyboard.dismiss();
    self.setState({
      animationMask: "fadeIn",
      animation: "fadeInUpBig",
      title: opt.title,
      msg: opt.msg,
      zIndex: 6
    });
    self._onBack = opt.onBack;
    self._onOk = opt.onOk;
  }

  //隐藏弹窗，层级还在
  _hide() {
    this.setState({
      animationMask: "fadeOut",
      animation: "fadeOutDownBig"
    });
  }
  //真实隐藏弹窗，层级最低
  _hideTrue() {
    this.setState({
      animationMask: "fadeOut",
      animation: "fadeOutDownBig",
      icon: "",
      msg: "",
      zIndex: -1
    });
  }

  //弹窗动画完成
  _onAnimationEnd() {
    if (this.state.animation == "fadeOutDownBig") {
      this._hideTrue();
    }
  }
  //返回
  _Back() {
    if (this._onBack) {
      this._hideTrue();
      this._onBack();
    } else {
      this._hide();
    }
  }
  //输入完成
  _Ok() {
    if (this._onOk) {
      this._hideTrue();
      this._onOk();
    } else {
      this._hide();
    }
  }

  _InputPwd(item) {
    if (this.state.data.length < 6) {
      this.data.push(item);
    }
    if (this.state.data.length == 6) {
      this._hide();
      this._onOk(this.state.data.join(""));
      this.data = [];
      this.setState({
        data: []
      });
    }
    this.setState({
      data: this.data
    });
  }
  _delPwd() {
    if (this.state.data.length < 6) {
      this.data.pop();
    }
    this.setState({
      data: this.data
    });
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
          <View style={styles.tradePannel}>
            <View style={styles.topNav}>
              <TouchableOpacity
                onPress={() => {
                  this._Back();
                }}
              >
                <Image
                  style={styles.iconImg}
                  source={require("../Resources/images/back.png")}
                />
              </TouchableOpacity>
              <Text style={styles.title}>{this.state.title}</Text>
              <Text style={styles.rightSace} />
            </View>
            <Text style={styles.showMsg}>{this.state.msg}</Text>
            <View style={styles.showPwd}>
              <Text style={styles.itemBox}>
                {this.state.data[0] ? "*" : null}
              </Text>
              <Text style={styles.itemBox}>
                {this.state.data[1] ? "*" : null}
              </Text>
              <Text style={styles.itemBox}>
                {this.state.data[2] ? "*" : null}
              </Text>
              <Text style={styles.itemBox}>
                {this.state.data[3] ? "*" : null}
              </Text>
              <Text style={styles.itemBox}>
                {this.state.data[4] ? "*" : null}
              </Text>
              <Text style={styles.itemBox}>
                {this.state.data[5] ? "*" : null}
              </Text>
            </View>
            <Text style={styles.setPwd} onPress={Actions.updateCapitalPwd}>
              忘记密码？
            </Text>
            <View style={styles.comKeyborad}>
              <View style={styles.itemBtn}>
                <Text
                  style={styles.btnTxt}
                  onPress={() => {
                    this._InputPwd(1);
                  }}
                >
                  1
                </Text>
                <Text
                  style={styles.btnTxt}
                  onPress={() => {
                    this._InputPwd(2);
                  }}
                >
                  2
                </Text>
                <Text
                  style={styles.btnTxt}
                  onPress={() => {
                    this._InputPwd(3);
                  }}
                >
                  3
                </Text>
              </View>
              <View style={styles.itemBtn}>
                <Text
                  style={styles.btnTxt}
                  onPress={() => {
                    this._InputPwd(4);
                  }}
                >
                  4
                </Text>
                <Text
                  style={styles.btnTxt}
                  onPress={() => {
                    this._InputPwd(5);
                  }}
                >
                  5
                </Text>
                <Text
                  style={styles.btnTxt}
                  onPress={() => {
                    this._InputPwd(6);
                  }}
                >
                  6
                </Text>
              </View>
              <View style={styles.itemBtn}>
                <Text
                  style={styles.btnTxt}
                  onPress={() => {
                    this._InputPwd(7);
                  }}
                >
                  7
                </Text>
                <Text
                  style={styles.btnTxt}
                  onPress={() => {
                    this._InputPwd(8);
                  }}
                >
                  8
                </Text>
                <Text
                  style={styles.btnTxt}
                  onPress={() => {
                    this._InputPwd(9);
                  }}
                >
                  9
                </Text>
              </View>
              <View style={styles.itemBtn}>
                <Text
                  style={[styles.btnTxt, { backgroundColor: "transparent" }]}
                />
                <Text
                  style={styles.btnTxt}
                  onPress={() => {
                    this._InputPwd(0);
                  }}
                >
                  0
                </Text>
                <TouchableOpacity
                  style={[styles.btnDel, { backgroundColor: "transparent" }]}
                  onPress={() => {
                    this._delPwd();
                  }}
                >
                  <Image
                    style={styles.del}
                    source={require("../Resources/images/del.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  showView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: Dimensions.get("window").width,
    paddingTop: Fit(20),
    backgroundColor: "#fff"
  },
  topNav: {
    borderBottomColor: "#dee2e6",
    borderBottomWidth: 1,
    paddingBottom: Fit(20),
    paddingLeft: Fit(20),
    paddingRight: Fit(20),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  iconImg: {
    width: Fit(50),
    height: Fit(50)
  },
  title: {
    fontSize: Fit(26),
    color: "#333"
  },
  rightSace: {
    width: Fit(50),
    height: Fit(50)
  },
  showMsg: {
    marginTop: Fit(20),
    color: "#999",
    fontSize: Fit(24),
    textAlign: "center"
  },
  showPwd: {
    marginTop: Fit(30),
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  },
  itemBox: {
    height: Fit(70),
    width: Fit(70),
    borderColor: "#dee2e6",
    borderWidth: 1,
    textAlign: "center",
    lineHeight: Fit(70),
    fontSize: Fit(32),
    fontWeight: "bold"
  },
  setPwd: {
    marginTop: Fit(20),
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    color: "#25c063",
    fontSize: Fit(22),
    textAlign: "right"
  },
  comKeyborad: {
    marginTop: Fit(35),
    paddingTop: Fit(10),
    paddingBottom: Fit(10),
    backgroundColor: "rgb(209, 213, 219)"
  },
  itemBtn: {
    marginTop: Fit(5),
    marginBottom: Fit(5),
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  },
  btnTxt: {
    borderRadius: Fit(10),
    width: Fit(200),
    height: Fit(70),
    fontSize: Fit(28),
    fontWeight: "bold",
    backgroundColor: "#fff",
    lineHeight: Fit(70),
    textAlign: "center"
  },
  btnDel: {
    width: Fit(200),
    height: Fit(70),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  del: {
    width: Fit(44),
    height: Fit(35)
  }
});
module.exports = TradePannel;
