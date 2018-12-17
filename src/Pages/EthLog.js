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
import Common from "../styles/Common";
import Nav from "../Component/Nav";

class EthLog extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav leftType="icon" title="ETH记录" />
        <View style={{ backgroundColor: "#FFF", marginTop: Fit(20) }}>
          <TouchableOpacity style={styles.linkItem} onPress={Actions.chargeEthLog}>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/eth1.png")}
            />
            <Text style={styles.linkItemText}>ETH充值记录</Text>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/right.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={Actions.withdrawEthLog}
          >
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/eth2.png")}
            />
            <Text style={styles.linkItemText}>ETH提现记录</Text>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/right.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  linkItem: {
    height: Fit(100),
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#DFDFDF",
    paddingLeft: Fit(38),
    paddingRight: Fit(38),
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  linkItemText: {
    flex: 1,
    color: "#010101",
    fontSize: Fit(28),
    paddingLeft: Fit(16)
  },
  linkItemIcon: {
    height: Fit(43),
    width: Fit(43)
  }
});
module.exports = EthLog;
