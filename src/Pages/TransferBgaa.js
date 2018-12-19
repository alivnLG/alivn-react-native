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
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import BigNumber from "bignumber.js";
import { validate, submit, getErrorsInField } from "../Common/validate";
class TransferBgaa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: {},
      transferout: 0,
      quantity: "",
      transferRate: ""
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }
  componentDidMount() {
    this._getUserInfo();
    this._getAccounts();
    this._getconfigs();
  }
  _getconfigs() {
    Axios.get("/configs").then(res => {
      this.setState({ transferRate: res.data.transferRate });
    });
  }
  _getUserInfo() {
    Axios.get("/users/" + this.props.username.substr(2, 40)).then(res => {
      this.setState({ accounts: res.data });
    });
  }
  _getAccounts() {
    Axios.get("/accounts").then(res => {
      this.setState({
        transferout: res.data[0].available + res.data[0].transfer
      });
    });
  }
  _postData() {
    Axios.post("/wallet/transfer", {
      username: this.state.accounts.username,
      quantity: this.state.quantity,
      tradePassword: this.tradePassword
    }).then(res => {
      Confirm.confirm({
        icon: "success",
        msg: "转账成功！",
        cancelTxt: "返回",
        okTxt: "立即查看",
        onCancel: () => {
          Actions.pop();
        },
        onOk: () => {
          Actions.transferBgaaLog();
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
        <Nav
          title="转账BGAA"
          rightType="txt"
          rightTxt="转账记录"
          onRight={() => {
            Actions.transferlog();
          }}
        />
        <View style={styles.userInfo}>
          <Image
            style={styles.useravatar}
            source={require("../Resources/images/userAvatar.png")}
          />
          <Text style={styles.username}>{this.state.accounts.nickname}</Text>
        </View>
        <View style={styles.itemBox}>
          <Text style={styles.txtBt}>转账数量</Text>
          <View style={styles.inputOuter}>
            <TextInput
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              style={styles.inputStyle}
              placeholderTextColor="#25C063"
              placeholder="请输入转账数量"
              ref="quantity"
              onChangeText={quantity => {
                validate(this, {
                  value: quantity,
                  name: "quantity"
                });
              }}
            />
            <Text style={[Common.errMsg, { textAlign: "center" }]}>
              {getErrorsInField("quantity")}
            </Text>
            <View style={styles.allBgaa}>
              <Text style={styles.txtTs}>
                BGAA可转出余额
                {new BigNumber(this.state.transferout).toFormat()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            underlayColor="#18a304"
            style={Common.buttonStyle}
            onPress={() => {
              const self = this;
              const verData = submit(this);
              if (verData) {
                const userinfo = Store.getItem("userinfo");
                if (!userinfo.hasTradePwd) {
                  Confirm.confirm({
                    msg: "未设置资金密码，点击确认前往设置！",
                    cancelMsg: "取消",
                    okMsg: "确认",
                    onOk:()=> {
                      Actions.capitalPwd();
                    }
                  });
                } else {
                  TradePannel.tradePannel({
                    title: "请输入资金密码",
                    msg: `额外扣除${(
                      this.state.transferRate * this.state.quantity
                    ).toFixed(8)}BGAA的手续费`,
                    onOk: res => {
                      self.tradePassword = res;
                      self._postData();
                    }
                  });
                }
              }
            }}
          >
            <Text style={Common.buttonTextStyle}>确认转账</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userInfo: {
    paddingTop: Fit(40),
    paddingBottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  useravatar: {
    width: Fit(131),
    height: Fit(131),
    borderRadius: Fit(131)
  },
  username: {
    color: "#373737",
    fontSize: Fit(30),
    marginTop: Fit(10)
  },
  itemBox: {
    marginTop: Fit(20),
    paddingLeft: Fit(40),
    paddingRight: Fit(40)
  },
  inputOuter: {
    paddingTop: Fit(45),
    backgroundColor: "#FCFEFD",
    borderWidth: 1,
    borderColor: "#EDEDED",
    marginTop: Fit(20)
  },
  txtBt: {
    fontSize: Fit(28),
    color: "#828D87"
  },
  inputStyle: {
    fontSize: Fit(42),
    color: "#25C063",
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    textAlign: "center"
  },
  buttonStyle: {
    marginTop: Fit(40),
    marginBottom: Fit(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#30B91B",
    height: Fit(82),
    borderRadius: Fit(80)
  },
  buttonTextStyle: {
    color: "#fff",
    fontSize: Fit(30),
    letterSpacing: Fit(5)
  },
  allBgaa: {
    marginTop: Fit(45),
    paddingTop: Fit(15),
    paddingBottom: Fit(15),
    paddingLeft: Fit(20),
    paddingRight: Fit(20),
    borderTopColor: "#ededed",
    borderTopWidth: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  txtTs: {
    fontSize: Fit(26),
    color: "#A5A5A5"
  },
  allOut: {
    fontSize: Fit(26),
    color: "#30B91B"
  }
});

module.exports = TransferBgaa;
