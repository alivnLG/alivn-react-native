import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image
} from "react-native";
import RefreshListView, { RefreshState } from "react-native-refresh-list-view";
import Common from "../styles/Common";
import BigNumber from "bignumber.js";
class Trade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      refreshState: RefreshState.Idle
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", payload => {
      this.onHeaderRefresh();
    });
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
    let res = await Axios.get("/cabinets?page=0&size=10");
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
    let res = await Axios.get("/cabinets?page=" + this.page + "&size=10");
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

  renderCell = data => {
    return (
      <View style={styles.itemList}>
        <Text
          style={[
            styles.itemStatus,
            data.item.status == "END" ? { color: "#999" } : ""
          ]}
        >
          {data.item.status == "ACTIVE" ? "进行中" : "已完成"}
        </Text>
        <View style={styles.itemData}>
          <View style={styles.itemDataInfo}>
            <View style={[styles.point, { backgroundColor: "#F3F3F3" }]} />
            <Text style={styles.itemTxt1}>交易总额：</Text>
            <Text style={styles.itemTxt2}>
              {new BigNumber(data.item.quantity).toFormat()} BGAA
            </Text>
          </View>
          <View style={styles.itemDataInfo}>
            <View style={[styles.point, { backgroundColor: "#FF9800" }]} />
            <Text style={styles.itemTxt1}>购买总量：</Text>
            <Text style={styles.itemTxt2}>
              {new BigNumber(data.item.bid).toFormat()} BGAA
            </Text>
          </View>
          <View style={styles.itemDataInfo}>
            <View style={[styles.point, { backgroundColor: "#66CE23" }]} />
            <Text style={styles.itemTxt1}>总成交量：</Text>
            <Text style={styles.itemTxt2}>
              {new BigNumber(data.item.ask).toFormat()} BGAA
            </Text>
          </View>
          <View style={styles.itemDataInfo}>
            <View style={[styles.pointS]} />
            <Text style={styles.itemTxt1}>开始时间：</Text>
            <Text style={styles.itemTxt2}>{data.item.startTime}</Text>
          </View>
          {data.item.status == "ACTIVE" ? null : (
            <View style={styles.itemDataInfo}>
              <View style={[styles.pointS]} />
              <Text style={styles.itemTxt1}>结束时间：</Text>
              <Text style={styles.itemTxt2}>{data.item.endTime}</Text>
            </View>
          )}
        </View>
        {data.item.status == "ACTIVE" ? (
          <View>
            <View style={styles.barOuter}>
              <View
                style={[
                  styles.barLine,
                  {
                    backgroundColor: "#FF9800",
                    width: (data.item.bid / data.item.quantity) * 100 + "%",
                    zIndex: 2
                  }
                ]}
              />
              <View
                style={[
                  styles.barLine,
                  {
                    backgroundColor: "#66CE23",
                    width: (data.item.ask / data.item.quantity) * 100 + "%",
                    zIndex: 3
                  }
                ]}
              />
            </View>
            <View style={styles.itemOper}>
              {data.item.quantity > data.item.bid ? (
                <TouchableOpacity
                  onPress={() => {
                    Actions.buyBgaa({
                      mdsNum: new BigNumber(data.item.quantity).minus(
                        data.item.bid
                      ),
                      id: data.item.id
                    });
                  }}
                  style={[styles.operBtn, { backgroundColor: "#FA5F5A" }]}
                >
                  <Text style={styles.operTxt}>发布购买</Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              <TouchableOpacity
                onPress={() => {
                  Actions.sellBgaa({
                    zesNum: data.item.quantity,
                    zssNum: new BigNumber(data.item.bid).minus(data.item.ask),
                    id: data.item.id
                  });
                }}
                style={[styles.operBtn, { backgroundColor: "#30B91B" }]}
              >
                <Text style={styles.operTxt}>出售BGAA</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View />
        )}
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
            <Text style={[styles.tabTxt, styles.active]}>BGAA交易</Text>
            <Text
              onPress={() => Actions.tradeWarrant()}
              style={[styles.tabTxt]}
            >
              权证交易
            </Text>
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
  point: {
    width: Fit(14),
    height: Fit(14),
    borderRadius: Fit(14)
  },
  pointS: {
    width: Fit(14),
    height: Fit(14),
    borderRadius: Fit(14)
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
  }
});
module.exports = Trade;
