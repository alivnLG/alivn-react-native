import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import BigNumber from "bignumber.js";

class WithdrawInfo extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState){
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }
  render() {
    return (
      <View style={Common.container}>
        <Nav leftType="icon" title="提现详情" />
        <View style={styles.main}>
          <View style={styles.leftJd}>
            <View style={styles.pointy} />
            <View style={styles.sliney} />
            <Image
              style={styles.pointi}
              source={require("../Resources/images/pointi.png")}
            />
            <View style={styles.slinen} />
            <View style={styles.pointn} />
          </View>
          <View style={styles.jdInfo}>
            <View style={styles.step1}>
              <Text style={styles.infoCom}>提现申请已提交，等待系统审核</Text>
              <Text style={styles.infoCom}>
                提现地址：
                {this.props.to}
              </Text>
              <Text style={styles.info1}>
                {new BigNumber(this.props.quantity).toFormat()} ETH
              </Text>
            </View>
            <View style={styles.step2}>
              <Text style={styles.infoCom}>系统审核中</Text>
            </View>
            <View style={styles.step3}>
              <Text style={styles.infoCom}>我们将在48小时内进行处理</Text>
            </View>
          </View>
        </View>
        <View style={styles.otherInfo}>
          <View style={styles.line}>
            <Text style={styles.lineLeft}>提现数量</Text>
            <Text style={styles.lineRight}>
              {new BigNumber(this.props.quantity).toFormat()} ETH
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.lineLeft}>手续费</Text>
            <Text style={styles.lineRight}>
              {new BigNumber(this.props.fee).toFormat()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          underlayColor="#18a304"
          style={styles.buttonStyle}
          onPress={() => {
            Actions.replace("withdrawEth");
          }}
        >
          <Text style={styles.buttonTextStyle}>完成</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    borderTopColor: "#ededed",
    borderTopWidth: 1,
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    paddingTop: Fit(40),
    justifyContent: "flex-start",
    flexDirection: "row"
  },
  leftJd: {
    width: Fit(41),
    height: Fit(363),
    justifyContent: "center",
    alignItems: "center"
  },
  pointy: {
    width: Fit(17),
    height: Fit(17),
    backgroundColor: "#25c063",
    borderRadius: Fit(17)
  },
  pointn: {
    width: Fit(17),
    height: Fit(17),
    backgroundColor: "#e5e5e5",
    borderRadius: Fit(17)
  },
  sliney: {
    width: Fit(2),
    height: Fit(142),
    backgroundColor: "#25c063"
  },
  slinen: {
    width: Fit(2),
    height: Fit(142),
    backgroundColor: "#e5e5e5"
  },
  pointi: {
    width: Fit(41),
    height: Fit(45)
  },
  step1: {
    height: Fit(165)
  },
  jdInfo: {
    paddingRight: Fit(40),
    marginLeft: Fit(40)
  },
  step2: {
    height: Fit(170)
  },
  step3: {},
  infoCom: {
    fontSize: Fit(28),
    color: "#828D87"
  },
  info1: {
    color: "#25C063",
    fontSize: Fit(28),
    fontWeight: "bold",
    marginTop: Fit(5)
  },
  otherInfo: {
    marginLeft: Fit(40),
    marginRight: Fit(40),
    marginTop: Fit(80),
    borderTopColor: "#EDEDED",
    borderTopWidth: 1,
    paddingTop: Fit(15)
  },
  line: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: Fit(15)
  },
  lineLeft: {
    fontSize: Fit(24),
    color: "#828D87"
  },
  lineRight: {
    fontSize: Fit(24),
    color: "#828D87"
  },
  buttonStyle: {
    marginTop: Fit(80),
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
  }
});

module.exports = WithdrawInfo;
