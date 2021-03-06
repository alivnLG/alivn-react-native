import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import Common from "../styles/Common";
import BigNumber from "bignumber.js";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: {},
      configs: {},
      nickname: Store.getItem("userinfo")
        ? Store.getItem("userinfo").nickname
        : "",
      noticeStoreSize: Store.getItem("noticeStoreSize")
    };
  }
  //控制是否渲染刷新
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.state) != JSON.stringify(nextState);
  }
  //组件渲染完成
  componentDidMount() {
    this.props.navigation.addListener(
      'willFocus',
      payload => {
        this._getData();
        this._getConfigs();
        this._getNoticeSize();
      }
    );
  }
  _getConfigs() {
    Axios.get("/configs").then(res => {
      this.setState({
        configs: res.data
      });
    });
  }
  _getNoticeSize() {
    Axios.get("/notices/size").then(res => {
      this.setState({
        noticeSize: res.data.size
      });
    });
  }
  _getData() {
    Axios.get("/accounts").then(res => {
      this.setState({
        accounts: res.data[0],
        speed: res.data[0].frozen + res.data[0].qqFrozen,
        all:
          res.data[0].available +
          res.data[0].qqFrozen +
          res.data[0].frozen +
          res.data[0].transfer +
          res.data[0].warrant
      });
    });
  }

  render() {
    console.log(111);
    return (
      <ScrollView style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <ImageBackground
          style={styles.header}
          source={require("../Resources/images/iheader.png")}
        >
          <View style={styles.fline}>
            <View style={styles.welcome}>
              <Text style={styles.txt1}>您好，{this.state.nickname}！</Text>
              <Text style={styles.txt2}>这是您的BGAA全部资产</Text>
            </View>
            <TouchableOpacity
              onPress={Actions.noticeList}
              style={styles.newsInfo}
            >
              {this.state.noticeSize > this.state.noticeStoreSize ? (
                <Image
                  style={styles.newsImg}
                  source={require("../Resources/images/newsImg_active.png")}
                />
              ) : (
                <Image
                  style={styles.newsImg}
                  source={require("../Resources/images/newsImg.png")}
                />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.txt3}>
            {new BigNumber(this.state.all).toFormat()}
          </Text>
          <Text style={styles.txt4}>
            注册人数：{new BigNumber(this.state.accounts.nodeSize).toFormat()}
          </Text>
        </ImageBackground>
        <View style={styles.operBtn}>
          <TouchableOpacity onPress={Actions.lock} style={styles.itemBtn}>
            <Image
              style={styles.operBtnImg}
              source={require("../Resources/images/operBtn1.png")}
            />
            <Text style={styles.itemTxt}>锁仓BGAA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={Actions.transferEnter}
            style={styles.itemBtn}
          >
            <Image
              style={styles.operBtnImg}
              source={require("../Resources/images/operBtn2.png")}
            />
            <Text style={styles.itemTxt}>转账BGAA</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={Actions.mySpeed} style={styles.itemBtn}>
            <Image
              style={styles.operBtnImg}
              source={require("../Resources/images/operBtn3.png")}
            />
            <Text style={styles.itemTxt}>我的加速</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={Actions.getWarrant} style={styles.itemBtn}>
            <Image
              style={styles.operBtnImg}
              source={require("../Resources/images/operBtn4.png")}
            />
            <Text style={styles.itemTxt}>权证抢购</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.accountInfo}>
          <View style={styles.itemAccount}>
            <View style={styles.itemAccountName}>
              <Image
                style={styles.itemAccountImg}
                source={require("../Resources/images/accountImg1.png")}
              />
              <Text style={styles.itemNameTxt}>积分</Text>
            </View>
            <View style={styles.itemAccountNum}>
              <Text style={styles.itemNumTxt}>
                {new BigNumber(this.state.accounts.rmb).toFormat()}
              </Text>
            </View>
          </View>
          <View style={styles.itemAccount}>
            <View style={styles.itemAccountName}>
              <Image
                style={styles.itemAccountImg}
                source={require("../Resources/images/accountImg2.png")}
              />
              <Text style={styles.itemNameTxt}>可用BGAA</Text>
            </View>
            <View style={styles.itemAccountNum}>
              <Text style={styles.itemNumTxt}>
                {new BigNumber(this.state.accounts.available).toFormat()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={Actions.mySpeed}
            style={styles.itemAccount}
          >
            <View style={styles.itemAccountName}>
              <Image
                style={styles.itemAccountImg}
                source={require("../Resources/images/accountImg3.png")}
              />
              <Text style={styles.itemNameTxt}>待加速BGAA</Text>
            </View>
            <View style={styles.itemAccountNum}>
              <Text style={styles.itemNumTxt}>
                {new BigNumber(this.state.speed).toFormat()}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.itemAccount}>
            <View style={styles.itemAccountName}>
              <Image
                style={styles.itemAccountImg}
                source={require("../Resources/images/accountImg4.png")}
              />
              <Text style={styles.itemNameTxt}>消费钱包BGAA</Text>
            </View>
            <View style={styles.itemAccountNum}>
              <Text style={styles.itemNumTxt}>
                {new BigNumber(this.state.accounts.transfer).toFormat()}
              </Text>
              <Text style={styles.itemInNumTxt}>
                在途资金：
                {new BigNumber(this.state.accounts.transit).toFormat()}
              </Text>
            </View>
          </View>
          <View style={styles.itemAccount}>
            <View style={styles.itemAccountName}>
              <Image
                style={styles.itemAccountImg}
                source={require("../Resources/images/accountImg5.png")}
              />
              <Text style={styles.itemNameTxt}>权证钱包BGAA</Text>
            </View>
            <View style={styles.itemAccountNum}>
              <Text style={styles.itemNumTxt}>
                {new BigNumber(this.state.accounts.warrant).toFormat()}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.hqInfoName}>实时行情</Text>
        <View style={styles.hqInfo}>
          <View style={styles.itemHq}>
            <Image
              style={styles.itemHqImg}
              source={require("../Resources/images/itemHqImg1.png")}
            />
            <Text style={styles.itemHqTxt1}>BGAA</Text>
            <View style={styles.itemHqNum}>
              <Text style={[styles.HqNumTxt, { color: "#FA6962" }]}>
                ≈ {new BigNumber(this.state.configs.rmbRate).toFormat()}
              </Text>
              <Text style={[styles.HqType, { color: "#FA6962" }]}>CNY</Text>
            </View>
          </View>
          <View style={styles.itemHq}>
            <Image
              style={styles.itemHqImg}
              source={require("../Resources/images/itemHqImg2.png")}
            />
            <Text style={styles.itemHqTxt1}>ETH</Text>
            <View style={styles.itemHqNum}>
              <Text style={[styles.HqNumTxt, { color: "#58B535" }]}>
                ≈ {new BigNumber(this.state.configs.ethRmb).toFormat()}
              </Text>
              <Text style={[styles.HqType, { color: "#58B535" }]}>CNY</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    width: Fit(750),
    height: Fit(350),
    position: "relative"
  },
  fline: {
    paddingTop: Fit(10) + STATUSBAR_HEIGHT,
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    justifyContent: "space-between",
    flexDirection: "row"
  },
  txt1: {
    fontSize: Fit(36),
    color: "#fff"
  },
  txt2: {
    fontSize: Fit(28),
    color: "#D9FFE3",
    marginTop: Fit(5)
  },
  newsInfo: {
    padding: Fit(10)
  },
  newsImg: {
    width: Fit(47),
    height: Fit(54)
  },
  txt3: {
    padding: Fit(30),
    fontSize: Fit(60),
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  txt4: {
    position: "absolute",
    bottom: Fit(15),
    right: 0,
    width: "100%",
    color: "#D9FFE3",
    textAlign: "right",
    fontSize: Fit(26),
    paddingRight: Fit(30)
  },
  operBtn: {
    backgroundColor: "#fff",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: Fit(20),
    paddingRight: Fit(20),
    paddingTop: Fit(25),
    paddingBottom: Fit(15)
  },
  itemBtn: {
    justifyContent: "center",
    alignItems: "center"
  },
  operBtnImg: {
    width: Fit(150),
    height: Fit(150)
  },
  itemTxt: {
    fontSize: Fit(25),
    color: "#656565",
    marginTop: Fit(10)
  },
  accountInfo: {
    marginTop: Fit(20),
    marginLeft: Fit(25),
    marginRight: Fit(25)
  },
  itemAccount: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: Fit(20),
    paddingRight: Fit(20),
    paddingBottom: Fit(35),
    paddingTop: Fit(35),
    marginBottom: Fit(5),
    backgroundColor: "#fff",
    borderRadius: Fit(10)
  },
  itemAccountName: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  itemAccountImg: {
    width: Fit(26),
    height: Fit(26)
  },
  itemNameTxt: {
    fontSize: Fit(28),
    color: "#666",
    fontWeight: "bold",
    marginLeft: Fit(15)
  },
  itemAccountNum: {
    justifyContent: "flex-end"
  },
  itemNumTxt: {
    textAlign: "right",
    fontSize: Fit(30),
    color: "#58B535"
  },
  itemInNumTxt: {
    textAlign: "right",
    fontSize: Fit(26),
    color: "#FF6600"
  },
  hqInfoName: {
    fontSize: Fit(26),
    color: "#797979",
    marginLeft: Fit(25),
    marginRight: Fit(25),
    marginTop: Fit(25)
  },
  hqInfo: {
    marginTop: Fit(20),
    marginLeft: Fit(25),
    marginRight: Fit(25),
    marginBottom: Fit(40),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  itemHq: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: Fit(340),
    height: Fit(159),
    backgroundColor: "#fff",
    borderRadius: Fit(10)
  },
  itemHqImg: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: Fit(170),
    height: Fit(140)
  },
  itemHqTxt1: {
    fontSize: Fit(22),
    color: "#AEADAD"
  },
  itemHqNum: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: Fit(10)
  },
  HqNumTxt: {
    fontSize: Fit(40)
  },
  HqType: {
    fontSize: Fit(22),
    marginTop: -Fit(20),
    marginLeft: Fit(10)
  }
});
module.exports = Home;
