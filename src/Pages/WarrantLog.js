import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import RefreshListView, { RefreshState } from "react-native-refresh-list-view";
import BigNumber from "bignumber.js";
class WarrantLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalY: 0,
      dataList: [],
      refreshState: RefreshState.Idle
    };
  }

  type = {
    USED: (
      <Image
        style={styles.typeImage}
        source={require("../Resources/images/USEDWarrant.png")}
      />
    ),
    TRANSFER: (
      <Image
        style={styles.typeImage}
        source={require("../Resources/images/TRANSFERWarrant.png")}
      />
    ),
    TRADE: (
      <Image
        style={styles.typeImage}
        source={require("../Resources/images/TRADEWarrant.png")}
      />
    )
  };
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
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
    let res = await Axios.get("/activitys/logs?page=0&size=10");
    await this.sleep(1000);
    let dataList = res.data.content;
    this.setState({
      totalY: res.data.totalElement,
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
    let res = await Axios.get("/activitys/logs?page=" + this.page + "&size=10");
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
        <View style={styles.itemData}>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>名称：</Text>
            <Text style={styles.itemTxt2}>{data.item.name}</Text>
          </View>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>可得锁仓量：</Text>
            <Text style={styles.itemTxt2}>
              {new BigNumber(data.item.frozen).toFormat()}
            </Text>
          </View>
          {data.item.type == "USED" ? null : (
            <View style={styles.itemDataInfo}>
              <Text style={styles.itemTxt1}>对方昵称：</Text>
              <Text style={styles.itemTxt2}>{data.item.toNickName}</Text>
            </View>
          )}
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>时间：</Text>
            <Text style={styles.itemTxt2}>{data.item.createTime}</Text>
          </View>
          {this.type[data.item.type]}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav leftType="icon" title="权证记录" />
        <View style={styles.nav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              Actions.warrantNotLog();
            }}
          >
            <Text style={[styles.navText, { color: "#666" }]}>
              未使用（{this.props.total}）
            </Text>
          </TouchableOpacity>
          <View style={styles.navItem}>
            <Text style={[styles.navText, { color: "#3CD168" }]}>
              已使用（{this.state.totalY}）
            </Text>
            <View style={styles.navLine} />
          </View>
        </View>
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
  nav: {
    marginTop: 1,
    height: Fit(100),
    flexDirection: "row"
  },
  navItem: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    height: Fit(100),
    flex: 1,
    marginRight: 1,
    position: "relative"
  },
  navLine: {
    width: "36%",
    height: 2,
    backgroundColor: "#3CD168",
    position: "absolute",
    bottom: 0
  },
  itemData: {
    marginTop: Fit(25),
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    paddingBottom: Fit(15),
    backgroundColor: "#fff",
    position: "relative"
  },
  itemDataInfo: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: Fit(20)
  },
  itemTxt1: {
    color: "#333",
    fontSize: Fit(26)
  },
  itemTxt2: {
    color: "#6F7A89",
    fontSize: Fit(26)
  },
  line: {
    height: 1,
    backgroundColor: "#F0F0F0"
  },
  typeImage: {
    position: "absolute",
    right: Fit(30),
    width: Fit(120),
    height: Fit(120),
    top: Fit(60),
    transform: [{ translateY: -Fit(30) }]
  }
});
module.exports = WarrantLog;
