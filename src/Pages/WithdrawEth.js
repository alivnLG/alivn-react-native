import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import { validate, submit, getErrorsInField } from "../Common/validate";
import Common from "../styles/Common";
import BigNumber from "bignumber.js";

class WithdrawEth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configs: {},
      accounts: {},
      address: "",
      buyETHNumber: "",
      logList: [],
      isLoading: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", payload => {
      this._getAccounts();
      this._getconfigs();
      this.getList();
    });
  }

  getList() {
    this.setState({
      isLoading: true
    });
    Axios.get("/wallet/withdraws", {
      params: {
        page: 0,
        size: 4
      }
    }).then(res => {
      this.setState({
        logList: res.data.content
      });
      setTimeout(() => {
        this.setState({
          isLoading: false
        });
      }, 1000);
    });
  }

  _getconfigs() {
    Axios.get("/configs").then(res => {
      this.setState({ configs: res.data });
    });
  }

  _getAccounts() {
    Axios.get("/accounts").then(res => {
      this.setState({ accounts: res.data[0] });
    });
  }

  submit() {
    Axios.post("/wallet/withdraws", {
      address: this.state.address,
      quantity: this.state.buyETHNumber,
      tradePassword: this.tradePassword
    }).then(res => {
      Actions.replace("withdrawinfo", res.data);
    });
  }

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <View style={styles.top}>
          <ImageBackground
            style={styles.itemBox}
            source={require("../Resources/images/chargelogbg.png")}
          >
            <View style={styles.nav}>
              <TouchableOpacity onPress={Actions.pop}>
                <Image
                  style={styles.back}
                  source={require("../Resources/images/back1.png")}
                />
              </TouchableOpacity>
              <Text style={styles.titleM}>提现ETH</Text>
              <Text onPress={Actions.withdrawEthLog} style={styles.titleR}>
                提现记录
              </Text>
            </View>
            <Text style={styles.txt1}>
              可提现ETH ：{new BigNumber(this.state.accounts.eth).toFormat()}
            </Text>
          </ImageBackground>
        </View>
        <ScrollView style={styles.txteth}>
          <View style={styles.itemTx}>
            <View style={styles.item1}>
              <Text style={styles.txtLeft}>发送地址：</Text>
              <TextInput
                underlineColorAndroid="transparent"
                defaultValue={this.state.address}
                style={styles.inputStyle}
                placeholder="请输入ETH地址"
                ref="address"
                onFocus={() => {
                  this.refs.address.focus();
                }}
                onChangeText={address => {
                  validate(this, {
                    value: address,
                    name: "address"
                  });
                }}
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
            </View>
            <Text style={styles.fromError}>{getErrorsInField("address")}</Text>
            <View style={styles.item2}>
              <Text style={styles.txtLeft}>ETH数量：</Text>
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#FFC000"
                keyboardType="numeric"
                style={styles.inputStyle}
                placeholder="请输入ETH数量"
                ref="buyETHNumber"
                onFocus={() => {
                  this.refs.buyETHNumber.focus();
                }}
                onChangeText={buyETHNumber => {
                  validate(this, {
                    value: buyETHNumber,
                    name: "buyETHNumber"
                  });
                }}
              />
            </View>
            <Text style={styles.fromError}>
              {getErrorsInField("buyETHNumber")}
            </Text>
          </View>
          <View style={styles.notice}>
            <Text style={styles.txtBt}>注意事项：</Text>
            <Text style={styles.txtNr}>
              ETH钱包只能向ETH地址发送资产，如果向非ETH地址发送资产将不可找回。ETH提现手续费为
              {this.state.configs.withdrawRate * 100}
              %，最低转出金额为
              {this.state.configs.lowWithdraw}
              ETH
            </Text>
            <Text style={styles.txtNrr}>
              温馨提示：ETH到账速度快慢由以太坊网络决定，通常需要5分钟以上，如您尚未查看到到账，请不要着急，请耐心等待网络确认。如确实未查询到，请联系客服邮箱，邮箱地址可在“我的”—“联系我们”查看。
            </Text>
          </View>
          <TouchableOpacity
            underlayColor="#18a304"
            style={styles.buttonStyle}
            onPress={() => {
              const self = this;
              const verData = submit(this);
              if (verData) {
                const userinfo = Store.getItem("userinfo");
                if (!userinfo.hasTradePwd) {
                  Confirm.confirm({
                    icon: "info",
                    msg: "未设置资金密码，点击确认前往设置！",
                    cancelTxt: "取消",
                    okTxt: "确认",
                    onOk: () => {
                      Actions.capitalPwd();
                    }
                  });
                } else {
                  TradePannel.tradePannel({
                    title: "请输入资金密码",
                    msg: `额外扣除${(
                      this.state.configs.withdrawRate * this.state.buyETHNumber
                    ).toFixed(8)}ETH的手续费`,
                    onOk: res => {
                      self.tradePassword = res;
                      self.submit();
                    }
                  });
                }
              }
            }}
          >
            <Text style={styles.buttonTextStyle}>确认转出</Text>
          </TouchableOpacity>
          <View style={styles.log}>
            <View style={styles.nameOuter}>
              <Text style={styles.txtLeft}>最近提现记录:</Text>
              <TouchableOpacity
                style={styles.refresh}
                onPress={() => {
                  this.getList();
                }}
              >
                <Image
                  style={styles.sx}
                  source={require("../Resources/images/sx.png")}
                />
              </TouchableOpacity>
            </View>

            {this.state.isLoading ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: Fit(60)
                }}
              >
                <ActivityIndicator />
                <Text style={{ fontSize: Fit(24), marginLeft: Fit(8) }}>
                  刷新中
                </Text>
              </View>
            ) : null}
            {this.state.logList.map(item => {
              return (
                <View style={styles.loglist}>
                  <View style={styles.line1}>
                    <Text style={styles.txtDate}>{item.createTime}</Text>
                    <Text style={styles.txtNum}>
                      {new BigNumber(item.outQuantity).toFormat()}
                      {item.itemType}
                    </Text>
                  </View>
                  <Text style={styles.line2}>{item.address}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  top: {
    width: Fit(750),
    height: Fit(237)
  },
  itemBox: {
    width: Fit(750),
    height: Fit(237)
  },
  nav: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    marginTop: STATUSBAR_HEIGHT + Fit(10)
  },
  titleM: {
    fontSize: Fit(36),
    color: "#fff"
  },
  titleR: {
    fontSize: Fit(28),
    color: "#fff"
  },
  back: {
    width: Fit(56),
    height: Fit(56)
  },
  txt1: {
    marginTop: isIphoneX() ? Fit(45) : Fit(60),
    fontSize: Fit(26),
    color: "#ACFFD2",
    paddingLeft: Fit(30)
  },
  txt2: {
    fontSize: Fit(24),
    color: "#ACFFD2",
    paddingLeft: Fit(30),
    marginTop: Fit(5)
  },
  itemTx: {
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    paddingTop: Fit(15),
    paddingBottom: Fit(30),
    backgroundColor: "#fff"
  },
  item1: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
    borderBottomColor: "#EDEDED",
    borderBottomWidth: 1,
    paddingBottom: Fit(10)
  },
  item2: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
    borderBottomColor: "#EDEDED",
    borderBottomWidth: 1,
    paddingBottom: Fit(10)
  },
  txtLeft: {
    fontSize: Fit(24),
    color: "#333",
    height: Fit(50),
    lineHeight: Fit(50)
  },
  scan: {
    justifyContent: "center",
    alignItems: "center",
    width: Fit(56),
    height: Fit(56)
  },
  scanImg: {
    width: Fit(30),
    height: Fit(30)
  },
  inputStyle: {
    height: Fit(80),
    width: Fit(510),
    fontSize: Fit(24),
    paddingVertical: 0,
    color: "#333",
    borderBottomWidth: 0
  },
  notice: {
    marginTop: Fit(30)
  },
  txtBt: {
    color: "#333",
    fontSize: Fit(24),
    paddingLeft: Fit(30)
  },
  txtNr: {
    marginTop: Fit(30),
    color: "#999",
    fontSize: Fit(22),
    paddingLeft: Fit(30),
    backgroundColor: "#fff",
    paddingTop: Fit(20),
    paddingBottom: Fit(10),
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    lineHeight: Fit(36)
  },
  txtNrr: {
    marginTop: 0,
    color: "#999",
    fontSize: Fit(22),
    paddingLeft: Fit(30),
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingBottom: Fit(20),
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    lineHeight: Fit(36)
  },
  buttonStyle: {
    marginTop: Fit(40),
    marginBottom: Fit(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#30B91B",
    height: Fit(82),
    borderRadius: Fit(80),
    marginLeft: Fit(45),
    marginRight: Fit(45)
  },
  buttonTextStyle: {
    color: "#fff",
    fontSize: Fit(30),
    letterSpacing: Fit(5)
  },

  nameOuter: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    marginTop: Fit(40),
    marginTop: Fit(25)
  },
  txtLeft: {
    fontSize: Fit(24),
    color: "#333"
  },
  sx: {
    width: Fit(28),
    height: Fit(28)
  },
  loglist: {
    paddingTop: Fit(15),
    paddingBottom: Fit(15),
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    backgroundColor: "#fff",
    marginBottom: Fit(20)
  },
  line1: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  txtDate: {
    fontSize: Fit(24),
    color: "#666"
  },
  txtNum: {
    color: "#FFC000",
    fontSize: Fit(24)
  },
  line2: {
    marginTop: Fit(10),
    fontSize: Fit(24),
    color: "#999"
  },
  fromError: {
    marginTop: Fit(4),
    fontSize: Fit(22),
    color: "#f00"
  },
  refresh: {
    padding: Fit(30)
  }
});

module.exports = WithdrawEth;
