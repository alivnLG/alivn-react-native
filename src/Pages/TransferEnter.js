import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Clipboard
} from "react-native";
import { Actions } from "react-native-router-flux";
import QRCode from "react-native-qrcode";
import Common from "../styles/Common";
import { validate, getErrorsInField, submit } from "../Common/validate";
class TransferEnter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      isShow: true,
      zcbgaa: "0x" + Store.getItem("userinfo").username
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  //接收扫描到的数据
  componentWillReceiveProps(nextProps) {
    if (nextProps.scanData) {
      this.setState({
        address: nextProps.scanData
      });
    }
  }
  _isShow(type) {
    this.setState({ isShow: type });
  }
  _copy() {
    Clipboard.setString(this.state.zcbgaa);
    Alert.alert({
      icon: "success",
      msg: "复制成功"
    });
  }
  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <View style={styles.top}>
          <ImageBackground
            style={styles.itemBox}
            source={require("../Resources/images/transfer.png")}
          >
            <View style={styles.nav}>
              <TouchableOpacity
                onPress={() => {
                  Actions.pop();
                }}
              >
                <Image
                  style={styles.back}
                  source={require("../Resources/images/back1.png")}
                />
              </TouchableOpacity>
              <Text style={styles.titleM}>转账</Text>
              <Text style={styles.titleR} />
            </View>
            <View style={styles.header}>
              <View style={styles.headerItem}>
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => {
                    this._isShow(true);
                  }}
                >
                  <Image
                    style={styles.icon}
                    source={require("../Resources/images/sr.png")}
                  />
                  <Text style={styles.txt}>收入</Text>
                </TouchableOpacity>
                <Image
                  style={styles.headerLine}
                  source={require("../Resources/images/line2.png")}
                />
              </View>
              <View style={styles.headerItem}>
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => {
                    this._isShow(false);
                  }}
                >
                  <Image
                    style={styles.icon}
                    source={require("../Resources/images/zc.png")}
                  />
                  <Text style={styles.txt}>支出</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.showCon}>
          {this.state.isShow ? (
            <ImageBackground
              style={styles.showBox}
              source={require("../Resources/images/showbg.png")}
            >
              <Text style={styles.title}>扫二维码向我付款</Text>
              <QRCode
                value={this.state.zcbgaa}
                size={Fit(350)}
                bgColor="#000"
                fgColor="white"
              />
              <TouchableOpacity
                style={[styles.QRButton]}
                onPress={this._copy.bind(this)}
              >
                <Text style={{ fontSize: Fit(26), color: "#f60" }}>
                  复制收款码地址
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          ) : (
            <View style={styles.showZc}>
              <View style={styles.inputOuter}>
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
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.inputStyle}
                  multiline={true}
                  defaultValue={this.state.address}
                  ref="address"
                  onChangeText={address => {
                    validate(this, {
                      value: address,
                      name: "address"
                    });
                  }}
                  placeholder="请输入钱包地址"
                />
              </View>
              <Text style={styles.fromError}>
                {getErrorsInField("address")}
              </Text>
              <View style={styles.buttonOuter}>
                <TouchableOpacity
                  underlayColor="#18a304"
                  style={styles.buttonStyle}
                  onPress={() => {
                    const verData = submit(this);
                    if (verData) {
                      Actions.transfer({ username: this.state.address });
                    }
                  }}
                >
                  <Text style={styles.buttonTextStyle}>下一步</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemBox: {
    width: Fit(750),
    height: Fit(329)
  },
  nav: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    paddingTop: STATUSBAR_HEIGHT + Fit(10)
  },
  titleM: {
    fontSize: Fit(36),
    color: "#fff"
  },
  back: {
    width: Fit(56),
    height: Fit(56)
  },
  header: {
    marginTop: isIphoneX ? Fit(30) : Fit(60),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  headerItem: {
    width: Fit(375),
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  headerLine: {
    position: "absolute",
    right: 0,
    top: "50%",
    width: Fit(2),
    height: Fit(117),
    marginTop: -Fit(58)
  },
  icon: {
    width: Fit(82),
    height: Fit(80)
  },
  txt: {
    color: "#fff",
    fontSize: Fit(28),
    marginTop: Fit(10)
  },
  showCon: {
    margin: Fit(40)
  },
  showBox: {
    width: Fit(672),
    height: Fit(600),
    alignItems: "center",
    paddingTop: Fit(40),
    paddingBottom: Fit(30)
  },
  title: {
    color: "#828D87",
    fontSize: Fit(28),
    marginBottom: Fit(30)
  },
  download: {
    marginTop: Fit(20),
    fontSize: Fit(28),
    color: "#828D87"
  },
  tab: {
    justifyContent: "center",
    alignItems: "center"
  },
  showZc: {
    paddingBottom: Fit(20),
    paddingLeft: Fit(20),
    paddingRight: Fit(20),
    backgroundColor: "#fff"
  },
  inputOuter: {
    position: "relative",
    marginTop: Fit(15),
    height: Fit(80)
  },
  inputStyle: {
    height: Fit(80),
    fontSize: Fit(30),
    color: "#474747",
    borderBottomWidth: Fit(2),
    borderBottomColor: "#EDEDED",
    paddingRight: Fit(90),
    paddingVertical: 0,
    paddingBottom: Fit(20)
  },
  scan: {
    position: "absolute",
    right: 0,
    bottom: Fit(30),
    width: Fit(56),
    height: Fit(56),
    zIndex: Fit(2)
  },
  scanImg: {
    position: "absolute",
    bottom: 0,
    left: Fit(13),
    width: Fit(30),
    height: Fit(30)
  },
  QRButton: {
    marginTop: Fit(30),
    height: Fit(56),
    width: Fit(260),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: Fit(28),
    elevation: Fit(4),
    shadowColor: "#B6B8B5",
    shadowOpacity: 0.5,
    shadowRadius: Fit(4)
  },
  buttonOuter: {
    paddingLeft: Fit(40),
    paddingRight: Fit(40)
  },
  buttonStyle: {
    marginTop: Fit(50),
    marginBottom: Fit(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#30B91B",
    height: Fit(77),
    borderRadius: Fit(77)
  },
  buttonTextStyle: {
    color: "#fff",
    fontSize: Fit(30),
    letterSpacing: Fit(10)
  },
  fromError: {
    marginTop: Fit(4),
    fontSize: Fit(22),
    color: "#f00"
  }
});
module.exports = TransferEnter;
