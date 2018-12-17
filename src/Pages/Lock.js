import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Actions } from "react-native-router-flux";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import BigNumber from "bignumber.js";

class Lock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quota: {},
      available: "",
      frozen: ""
    };
  }
  componentDidMount() {
    this._getconfigs();
    this._getAccounts();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }
  _getconfigs() {
    Axios.get("/accounts/quota").then(res => {
      this.setState({ quota: res.data });
    });
  }
  _getAccounts() {
    Axios.get("/accounts").then(res => {
      this.setState({
        available: new BigNumber(res.data[0].available)
          .plus(res.data[0].transfer)
          .toFixed()
      });
    });
  }
  _postData() {
    Confirm.confirm({
      icon: "info",
      msg: "确定锁仓？",
      onOk: () => {
        Axios.post(
          "/accounts/frozen",
          { quantity: this.state.frozen },
          false
        ).then(res => {
          Alert.alert({
            icon: "success",
            msg: "锁定成功！",
            onClose: () => {
              Actions.replace("home");
            }
          });
        });
      }
    });
  }
  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav
          leftType="icon"
          title="锁仓BGAA"
          rightType="txt"
          rightTxt="锁仓记录"
          onRight={() => {
            Actions.lockLog();
          }}
        />
        <View style={styles.main}>
          <Text style={[styles.txtName, styles.mgTop]}>锁仓数量</Text>
          <View style={Common.itemBox}>
            <Text style={styles.txtRight}>BGAA</Text>
            <TextInput
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              style={[
                Common.inputStyle,
                { color: "#474747", fontWeight: "bold", borderBottomWidth: 0 }
              ]}
              editable={false}
              value={new BigNumber(this.state.quota.quota).toFormat() + ""}
            />
          </View>
          <Text style={styles.txtye}>
            钱包余额：
            {new BigNumber(this.state.available).toFormat()}
            BGAA
          </Text>
          <View style={styles.buttonOuter}>
            {this.state.quota.quota > this.state.available ? (
              <TouchableOpacity
                style={[Common.buttonStyle, Common.buttonDisable]}
              >
                <Text style={Common.buttonTextStyle}>确定</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                underlayColor="#18a304"
                onPress={() => {
                  this._postData();
                }}
                style={Common.buttonStyle}
              >
                <Text style={Common.buttonTextStyle}>确定</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.notice}>
          <Text style={styles.txt}>BGAA锁仓规则：</Text>
          <Text style={styles.txt}>
            1.锁仓数量不满足
            {new BigNumber(this.state.quota.quota).toFormat()}
            不给予赠送。
          </Text>
          <Text style={styles.txt}>
            2.余额不足{new BigNumber(this.state.quota.quota).toFormat()}
            不能锁仓。
          </Text>
          <Text style={styles.txt}>
            3.待释放数量小于{new BigNumber(this.state.quota.quota).toFormat()}
            才可以再次锁仓。
          </Text>
          <Text style={styles.txt}>
            4.锁仓时先扣除消费钱包中的资金，后扣除可用钱包中的资金
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notice: {
    marginLeft: Fit(20),
    marginRight: Fit(20),
    paddingTop: Fit(25),
    paddingRight: Fit(25),
    paddingLeft: Fit(25),
    paddingBottom: Fit(50)
  },
  txt: {
    fontSize: Fit(22),
    color: "#9b9b9b",
    marginTop: Fit(8)
  },
  txtye: {
    fontSize: Fit(24),
    color: "#9b9b9b",
    marginTop: Fit(8)
  },
  btnCom: {
    width: Fit(250),
    height: Fit(72),
    borderRadius: Fit(72),
    textAlign: "center",
    fontSize: Fit(30),
    color: "#fff",
    lineHeight: Fit(72)
  },
  btnLeft: {
    backgroundColor: "#07B931"
  },
  btnRight: {
    backgroundColor: "#FFC045"
  },
  main: {
    marginLeft: Fit(20),
    marginRight: Fit(20),
    marginTop: Fit(20),
    backgroundColor: "#fff",
    paddingTop: Fit(25),
    paddingRight: Fit(25),
    paddingLeft: Fit(25),
    paddingBottom: Fit(50)
  },
  txtName: {
    color: "#666",
    fontSize: Fit(26),
    marginTop: Fit(10)
  },
  txtRight: {
    position: "absolute",
    top: Fit(30),
    right: 0,
    fontSize: Fit(26),
    color: "#9B9B9B"
  },
  mgTop: {
    marginTop: Fit(40)
  },
  buttonOuter: {}
});
module.exports = Lock;
