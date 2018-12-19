import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image
} from "react-native";
import { Actions } from "react-native-router-flux";
import RefreshListView, { RefreshState } from "react-native-refresh-list-view";
import Common from "../styles/Common";
import BigNumber from "bignumber.js";
class TradeWarrant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      refreshState: RefreshState.Idle
    };
  }

  componentDidMount() {
    this.onHeaderRefresh();
  }

  async sleep(duration) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, duration);
    });
  }
  //下拉刷新
  async onHeaderRefresh() {
    this.setState({ refreshState: RefreshState.HeaderRefreshing });
    //获取数据
    let res = await Axios.get("/activitys/sales?page=0&size=10");
    await this.sleep(1000);
    let dataList = res.data.content;
    this.setState({
      dataList: dataList,
      refreshState:
        dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
    });
  }
  //滑动加载更多
  page = 1;
  async onFooterRefresh() {
    this.setState({ refreshState: RefreshState.FooterRefreshing });
    //获取测试数据
    let res = await Axios.get(
      "/activitys/sales?page=" + this.page + "&size=10"
    );
    await this.sleep(1000);
    let dataList = this.state.dataList.concat(res.data.content);
    this.setState({
      dataList: dataList,
      refreshState:
        dataList.length == res.data.totalElement
          ? RefreshState.NoMoreData
          : RefreshState.Idle
    });
    this.page++;
  }

  async _buyPost(data) {
    Axios.get("/switchs/tradeCode").then(res => {
      if (!res.data.status) {
        Confirm.confirm({
          icon: "info",
          msg: res.data.msg,
          cancelTxt: "返回"
        });
      } else {
        const self = this;
        Confirm.confirm({
          icon:"info",
          msg: "确定要购买当前权证吗？",
          onOk: () => {
            const userinfo = Store.getItem("userinfo");
            if (!userinfo.hasTradePwd) {
              Confirm.confirm({
                icon:"info",
                msg: "未设置资金密码，点击确认前往设置！",
                cancelTxt: "取消",
                okTxt: "确认",
                onOk() {
                  Actions.capitalPwd();
                }
              });
            } else {
              TradePannel.tradePannel({
                title: "请输入资金密码",
                msg: `提交前请确认交易信息`,
                onOk: res => {
                  self.tradePassword = res;
                  Axios.post(`/activitys/${data.id}/trade`, {
                    tradePassword: self.tradePassword
                  }).then(res => {
                    Alert.alert({
                      icon: "success",
                      msg: "购买成功",
                      onClose:()=> {
                        self.onHeaderRefresh();
                      }
                    });
                  });
                }
              });
            }
          }
        });
      }
    });
  }

  renderCell = data => {
    return (
      <View style={styles.itemList}>
        <View style={styles.itemData}>
          <Image
            style={styles.itembg}
            source={require("../Resources/images/TradeWarrantBg.jpg")}
          />
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>名称：</Text>
            <Text style={styles.itemTxt2}>{data.item.name}</Text>
          </View>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>价格：</Text>
            <Text style={[styles.itemTxt2, { color: "#FF6F06" }]}>
              {new BigNumber(data.item.price).toFormat()}
            </Text>
          </View>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>支付方式：</Text>
            <Text style={styles.itemTxt2}>可用BGAA</Text>
          </View>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>可得锁仓量：</Text>
            <Text style={styles.itemTxt2}>{data.item.frozen}BGAA</Text>
          </View>
        </View>
        <View style={styles.itemOper}>
          <TouchableOpacity
            onPress={() => {
              this._buyPost(data.item);
            }}
            style={[styles.operBtn, { backgroundColor: "#30B91B" }]}
          >
            <Text style={styles.operTxt}>购买权证</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <ImageBackground
          style={styles.headerBox}
          source={require("../Resources/images/tradebg.jpg")}
        >
          <Text style={styles.nav}>交易</Text>
          <View style={styles.itemTab}>
            <Image
              style={styles.headerLine}
              source={require("../Resources/images/line2.png")}
            />
            <Text onPress={() => Actions.trade()} style={[styles.tabTxt]}>
              BGAA交易
            </Text>
            <Text style={[styles.tabTxt, styles.active]}>权证交易</Text>
          </View>
        </ImageBackground>

        <RefreshListView
          data={this.state.dataList}
          renderItem={this.renderCell}
          refreshState={this.state.refreshState}
          onHeaderRefresh={() => {
            this.onHeaderRefresh();
          }}
          onFooterRefresh={() => {
            this.onFooterRefresh();
          }}
          // 可选
          footerRefreshingText="玩命加载中 >.<"
          footerFailureText="我擦嘞，居然失败了 =.=!"
          footerNoMoreDataText="-我是有底线的-"
          footerEmptyDataText="-好像什么东西都没有-"
        />

        <TouchableOpacity
          style={styles.sellBtn}
          onPress={() => {
            Actions.warrantNotLog();
          }}
        >
          <Image
            style={styles.sellEnter}
            source={require("../Resources/images/sellEnter.png")}
          />
          <Text style={styles.sellTxt}>出售</Text>
          <Text style={styles.sellTxt}>权证</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  headerBox: {
    height: Fit(294),
    width: Fit(750)
  },
  nav: {
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 20,
    textAlign: "center",
    fontSize: 18,
    color: "#FFF"
  },
  itemTab: {
    marginTop: isIphoneX() ? Fit(40) : Fit(50),
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    position: "relative"
  },
  headerLine: {
    position: "absolute",
    right: "50%",
    top: "50%",
    width: Fit(1),
    height: Fit(60),
    marginTop: -Fit(30),
    marginRight: Fit(30)
  },
  tabTxt: {
    color: "#ACFFD2",
    paddingBottom: Fit(5),
    fontSize: Fit(28)
  },
  active: {
    color: "#fff",
    borderBottomColor: "#fff",
    borderBottomWidth: 1
  },
  buy: {
    position: "absolute",
    bottom: Fit(60),
    right: Fit(30),
    zIndex: 3
  },
  buyImg: {
    width: Fit(80),
    height: Fit(80)
  },
  itemList: {
    backgroundColor: "#fff",
    marginTop: Fit(20)
  },
  itembg: {
    position: "absolute",
    bottom: -Fit(30),
    left: 0,
    width: Fit(750),
    height: Fit(55)
  },
  itemStatus: {
    fontSize: Fit(28),
    paddingTop: Fit(15),
    paddingBottom: Fit(15),
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    color: "#333",
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1,
    textAlign: "right"
  },
  itemData: {
    position: "relative",
    marginTop: Fit(25),
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    paddingBottom: Fit(25)
  },
  itemDataInfo: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: Fit(10)
  },
  itemTxt1: {
    marginLeft: Fit(10),
    color: "#333",
    fontSize: Fit(26)
  },
  itemTxt2: {
    color: "#6F7A89",
    fontSize: Fit(26)
  },
  barOuter: {
    overflow: "hidden",
    height: Fit(32),
    backgroundColor: "#F3F3F3",
    borderRadius: Fit(32),
    marginLeft: Fit(30),
    marginRight: Fit(30),
    position: "relative"
  },
  barLine: {
    position: "absolute",
    left: 0,
    top: 0,
    height: Fit(32),
    borderRadius: Fit(32)
  },
  itemOper: {
    borderTopColor: "#F0F0F0",
    borderTopWidth: 1,
    marginTop: Fit(30),
    paddingTop: Fit(15),
    paddingBottom: Fit(15),
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    justifyContent: "flex-end",
    flexDirection: "row"
  },
  operBtn: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    height: Fit(46),
    width: Fit(162),
    borderRadius: Fit(46),
    marginLeft: Fit(30)
  },
  operTxt: {
    color: "#fff",
    fontSize: Fit(24)
  },
  sellBtn: {
    position: "absolute",
    bottom: Fit(30),
    right: Fit(30),
    width: Fit(102),
    height: Fit(102),
    justifyContent: "center",
    alignItems: "center"
  },
  sellEnter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Fit(102),
    height: Fit(102)
  },
  sellTxt: {
    color: "#fff",
    fontSize: Fit(20)
  }
});
module.exports = TradeWarrant;
