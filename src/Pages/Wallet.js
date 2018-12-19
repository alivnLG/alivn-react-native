import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from "react-native";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import BigNumber from "bignumber.js";

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = { accounts: {} };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", payload => {
      this._getAccounts();
    });
  }

  _getAccounts() {
    Axios.get("/accounts").then(res => {
      this.setState({ accounts: res.data[0] });
    });
  }

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav title="钱包" isBack={true} />
        <ScrollView>
          <View style={styles.main}>
            <ImageBackground
              style={styles.itemBox}
              source={require("../Resources/images/wtype.png")}
            >
              <Text style={styles.txt1}>ETH</Text>
              <Text style={styles.txt2}>
                可用:
                {new BigNumber(this.state.accounts.eth).toFormat()}
              </Text>
              <View style={styles.operBtn1}>
                <TouchableOpacity
                  onPress={Actions.chargeEth}
                  style={[styles.comBtn]}
                >
                  <Text style={[styles.buttonTextStyle, styles.leftBtn]}>
                    充值
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={Actions.withdrawEth}
                  style={[styles.comBtn]}
                >
                  <Text style={[styles.buttonTextStyle, styles.rightBtn]}>
                    提现
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
            <ImageBackground
              style={[styles.itemBox, { paddingTop: Fit(45) }]}
              source={require("../Resources/images/wtype.png")}
            >
              <Text style={styles.txt1}>BGAA</Text>
              <Text style={styles.txt2}>
                可用:
                {new BigNumber(this.state.accounts.available).toFormat()}
              </Text>
              <Text style={styles.txt3}>
                锁仓:
                {new BigNumber(this.state.accounts.frozen).toFormat()}
              </Text>
              <Text style={styles.txt3}>
                消费钱包:
                {new BigNumber(this.state.accounts.transfer).toFormat()}
              </Text>
              <View style={styles.operBtn2}>
                <TouchableOpacity
                  onPress={Actions.transferEnter}
                  style={[styles.comBtn]}
                >
                  <Text style={[styles.buttonTextStyle, styles.leftBtn]}>
                    转账
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.comBtn]}
                  onPress={Actions.lock}
                >
                  <Text style={[styles.buttonTextStyle, styles.rightBtn]}>
                    锁仓
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    marginLeft: Fit(20),
    marginRight: Fit(20)
  },
  itemBox: {
    width: Fit(710),
    height: Fit(453),
    paddingLeft: Fit(50),
    paddingTop: Fit(92),
    marginBottom: Fit(20)
  },
  txt1: {
    fontSize: Fit(42),
    color: "#55B326",
    fontWeight: "bold"
  },
  txt2: {
    fontSize: Fit(30),
    color: "#666666",
    marginTop: Fit(45)
  },
  txt3: {
    fontSize: Fit(30),
    color: "#666666",
    marginTop: Fit(10)
  },
  operBtn1: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    marginTop: Fit(80)
  },
  operBtn2: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    marginTop: Fit(40)
  },
  comBtn: {
    width: Fit(180),
    height: Fit(60),
    borderRadius: Fit(60),
    elevation: Fit(5),
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "rgb(182,184,181)",
    shadowOpacity: 0.24,
    shadowRadius: Fit(5),
    marginLeft: Fit(10),
    marginRight: Fit(10),
    backgroundColor: "#fff",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Fit(60)
  },
  buttonTextStyle: {
    fontSize: Fit(28)
  },
  leftBtn: {
    color: "#FF6600"
  },
  rightBtn: {
    color: "#666"
  }
});

module.exports = Wallet;
