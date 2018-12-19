import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Clipboard,
  ScrollView,
  ActivityIndicator
} from "react-native";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import QRCode from "react-native-qrcode";
import BigNumber from "bignumber.js";

class ChargeEth extends Component {
  constructor(props) {
    super(props);
    let userinfo = Store.getItem("userinfo");
    this.state = {
      address: `0x${userinfo.username}`,
      logList: [],
      isLoading: false
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", payload => {
      this.getList();
    });
  }

  getList() {
    this.setState({
      isLoading: true
    });
    Axios.get("/wallet/deposits", {
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

  copy() {
    Clipboard.setString(this.state.address);
    Alert.alert({
      icon: "success",
      msg: "复制成功"
    });
  }

  render() {
    return (
      <ScrollView style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav
          leftType="icon"
          title="ETH充值"
          rightType="txt"
          rightTxt="充值记录"
          onRight={() => {
            Actions.chargeEthLog();
          }}
        />
        <View style={styles.main}>
          <ImageBackground
            style={styles.itemBox}
            source={require("../Resources/images/chargebg.png")}
          >
            <QRCode
              style={styles.code}
              value={this.state.address}
              size={Fit(240)}
              bgColor="#000"
              fgColor="white"
            />
            <Text style={styles.txt1}>向如下地址汇入ETH完成记录</Text>
            <Text style={styles.txt2} onPress={this.copy.bind(this)}>
              {this.state.address}
            </Text>
            <View style={styles.QRButtonBox}>
              <TouchableOpacity
                style={[styles.QRButton]}
                onPress={this.copy.bind(this)}
              >
                <Text style={{ fontSize: Fit(26), color: "#f60" }}>
                  复制地址
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.notice}>
          <Text style={styles.name}>注意事项:</Text>
          <View style={styles.info}>
            <Text style={styles.infotxt}>
              ETH地址只能充值ETH资产，任何充入ETH地址的非ETH资产将不可找回，充值上述地址需要12个（以太坊主链节点确认）才能到账，最低存入数量为0.01ETH
            </Text>
          </View>
        </View>
        <View style={styles.log}>
          <View style={styles.nameOuter}>
            <Text style={styles.txtLeft}>最近交易记录:</Text>
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
                height: 60
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
                    {new BigNumber(item.eth).toFormat()}
                    ETH
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    marginTop: Fit(20),
    marginLeft: Fit(20),
    marginRight: Fit(20)
  },
  itemBox: {
    width: Fit(710),
    height: Fit(540),
    paddingTop: Fit(50),
    alignItems: "center"
  },
  code: {
    marginTop: Fit(25)
  },
  txt1: {
    fontSize: Fit(30),
    color: "#666",
    marginTop: Fit(45)
  },
  txt2: {
    fontSize: Fit(26),
    color: "#33CC33",
    marginTop: Fit(10),
    fontWeight: "bold"
  },
  notice: {
    marginTop: Fit(25)
  },
  name: {
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    fontSize: Fit(24),
    color: "#333"
  },
  info: {
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    paddingTop: Fit(15),
    paddingBottom: Fit(15),
    backgroundColor: "#fff",
    marginTop: Fit(20)
  },
  infotxt: {
    color: "#999",
    fontSize: Fit(22),
    lineHeight: Fit(40)
  },
  nameOuter: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    marginTop: Fit(25),
    marginBottom: Fit(25)
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
  QRButtonBox: {
    marginTop: Fit(10),
    flexDirection: "row"
  },
  QRButton: {
    height: Fit(56),
    width: Fit(194),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: Fit(28),
    elevation: Fit(4),
    shadowColor: "#B6B8B5",
    shadowOpacity: 0.5,
    shadowRadius: Fit(4)
  }
});

module.exports = ChargeEth;
