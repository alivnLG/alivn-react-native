import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Actions } from "react-native-router-flux";
import { validate, submit, getErrorsInField } from "../Common/validate";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import BigNumber from "bignumber.js";

class SellWarrant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      configs: {},
      quantity: 0,
      quantityX: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentDidMount() {
    this._getInfo();
    this._getconfigs();
  }

  _getInfo() {
    Axios.get("/activitys/" + this.props.activitysId).then(res => {
      this.setState({ data: res.data });
    });
  }

  _getconfigs() {
    Axios.get("/configs").then(res => {
      this.setState({ configs: res.data });
    });
  }

  _postSellWarrant() {
    Axios.post("/activitys/" + this.props.id + "/sale", {
      quantity: this.state.quantityX,
      tradePassword: this.tradePassword
    }).then(res => {
      Alert.alert({
        icon: "success",
        msg: "提交成功！",
        onClose: () => {
          Actions.pop();
        }
      });
    });
  }

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav leftType="icon" title="出售权证" />
        <View style={styles.main}>
          <View style={styles.itemList}>
            <View style={styles.itemData}>
              <View style={styles.itemDataInfo}>
                <Text style={styles.itemTxt1}>名称：</Text>
                <Text style={styles.itemTxt2}>{this.state.data.name}</Text>
              </View>
              <View style={styles.itemDataInfo}>
                <Text style={styles.itemTxt1}>价值：</Text>
                <Text style={[styles.itemTxt2, { color: "#FFC000" }]}>
                  {new BigNumber(this.state.data.price).toFormat()}
                </Text>
              </View>
              <View style={styles.itemDataInfo}>
                <Text style={styles.itemTxt1}>可得锁仓量：</Text>
                <Text style={[styles.itemTxt2]}>
                  {new BigNumber(this.state.data.frozen).toFormat()}BGAA
                </Text>
              </View>
              <View style={styles.itemDataInfo}>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.inputStyle}
                  placeholder="请输入出售价格"
                  ref="quantityX"
                  onChangeText={quantity => {
                    validate(this, {
                      value: quantity,
                      name: "quantityX"
                    });
                  }}
                />
              </View>
              <Text style={Common.errMsg}>{getErrorsInField("quantityX")}</Text>
            </View>
            <Image
              style={styles.itemimg}
              source={require("../Resources/images/itemimg.png")}
            />
          </View>
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
                  icon:"info",
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
                  msg: `权证出售成交时会扣除${this.state.configs.tradeCodeRate *
                    100}%手续费`,
                  onOk: res => {
                    self.tradePassword = res;
                    self._postSellWarrant();
                  }
                });
              }
            }
          }}
        >
          <Text style={styles.buttonTextStyle}>立即出售</Text>
        </TouchableOpacity>
        <View style={styles.notice}>
          <Text style={styles.txt}>
            说明：权证出售成交时会扣除{this.state.configs.tradeCodeRate * 100}
            %手续费
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notice: {
    marginLeft: Fit(30),
    marginRight: Fit(30),
    paddingTop: Fit(25),
    paddingBottom: Fit(50)
  },
  txt: {
    fontSize: Fit(22),
    color: "#9b9b9b",
    marginTop: Fit(8)
  },
  main: {
    marginTop: Fit(20),
    backgroundColor: "#fff"
  },
  itemList: {
    position: "relative",
    backgroundColor: "#fff",
    marginTop: Fit(20)
  },
  itemData: {
    marginTop: Fit(25),
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    paddingBottom: Fit(15)
  },
  itemDataInfo: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: Fit(10)
  },
  itemTxt1: {
    color: "#333",
    fontSize: Fit(26)
  },
  itemTxt2: {
    color: "#6F7A89",
    fontSize: Fit(26)
  },
  itemimg: {
    width: Fit(750),
    height: Fit(50)
  },
  inputStyle: {
    height: Fit(80),
    width: Fit(690),
    fontSize: Fit(26),
    paddingVertical: 0,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED"
  },
  buttonStyle: {
    marginTop: Fit(40),
    marginBottom: Fit(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#30B91B",
    height: Fit(82),
    borderRadius: Fit(80),
    marginLeft: Fit(30),
    marginRight: Fit(30)
  },
  buttonTextStyle: {
    color: "#fff",
    fontSize: Fit(30),
    letterSpacing: Fit(5)
  }
});
module.exports = SellWarrant;
