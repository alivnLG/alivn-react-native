import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { Actions } from "react-native-router-flux";
import Common from "../styles/Common";
import BigNumber from "bignumber.js";

class LockLog extends Component {
  constructor(props) {
    super(props);
    this.startDate = "";
    this.endDate = "";
    const myDate = new Date();
    this.FullYear = myDate.getFullYear();
    this.Month = myDate.getMonth() + 1;
    this.state = {
      title: "全部"
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
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
              <TouchableOpacity
                onPress={() => {
                  Actions.pop();
                  Picker.hide();
                }}
              >
                <Image
                  style={styles.back}
                  source={require("../Resources/images/back1.png")}
                />
              </TouchableOpacity>
              <Text style={styles.titleM}>锁仓记录</Text>
              <Text style={styles.titleR} />
            </View>

            <TouchableOpacity
              style={styles.dateChoose}
            >
              <Text style={styles.dateShow}>{this.state.title}</Text>
              <Image
                style={styles.arrow}
                source={require("../Resources/images/arrowd.png")}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <ScrollView>
          <View style={styles.loglist}>
            <View style={styles.lineCom}>
              <Text style={styles.txtName}>锁仓时间：</Text>
              <Text style={styles.txtInfo}>2018-12-25</Text>
            </View>
            <View style={styles.lineCom}>
              <Text style={styles.txtName}>锁仓类型：</Text>
              <Text style={styles.txtInfo}>用户锁仓</Text>
            </View>
            <View style={styles.lineCom}>
              <Text style={styles.txtName}>锁仓数量：</Text>
              <Text style={[styles.txtInfo]}>
                {new BigNumber(10000).toFormat()} BGAA
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  dateChoose: {
    marginTop: isIphoneX() ? Fit(45) : Fit(60),
    paddingLeft: Fit(30),
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  dateShow: {
    color: "#ACFFD2",
    fontSize: Fit(26)
  },
  arrow: {
    width: Fit(29),
    height: Fit(16),
    marginLeft: Fit(15)
  },
  loglist: {
    paddingTop: Fit(15),
    paddingBottom: Fit(15),
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    backgroundColor: "#fff",
    marginBottom: Fit(20)
  },
  lineCom: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: Fit(5),
    marginTop: Fit(10)
  },
  txtName: {
    color: "#333",
    fontSize: Fit(24)
  },
  txtInfo: {
    width: Fit(540),
    color: "#999",
    fontSize: Fit(24),
    marginLeft: Fit(10)
  },
  space: {
    width: Fit(180),
    height: Fit(2)
  },
  lineState: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    borderTopColor: "#EDEDED",
    borderTopWidth: 1,
    paddingTop: Fit(20),
    marginTop: Fit(20)
  },
  txtNum: {
    color: "#FFC000"
  },
  success: {
    fontSize: Fit(24),
    color: "#37BB1C"
  },
  ing: {
    fontSize: Fit(24),
    color: "#666"
  },
  fail: {
    fontSize: Fit(24),
    color: "#FF6600"
  }
});

module.exports = LockLog;
