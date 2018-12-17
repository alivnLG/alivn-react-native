import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import BigNumber from "bignumber.js";
import RefreshListView, { RefreshState } from "react-native-refresh-list-view";
class TransferBgaaLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      refreshState: RefreshState.Idle
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
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
    let res = await Axios.get("/wallet/transferLog?page=0&size=10");
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
      "/wallet/transferLog?page=" + this.page + "&size=10"
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

  renderCell = data => {
    return (
      <View style={styles.loglist}>
        <View style={styles.lineLeft}>
          <View style={styles.avatar}>
            <Image
              style={styles.avatarpic}
              source={require("../Resources/images/userAvatar.png")}
            />
          </View>
          <View styles={styles.info}>
            <Text style={styles.txt1}>
              转账-
              {data.item.userName}
            </Text>
            <Text style={styles.txt2}>{data.item.createTime}</Text>
          </View>
        </View>
        <View style={styles.lineRight}>
          <Text style={data.item.type == "-" ? styles.txt3n : styles.txt3y}>
            {data.item.type}
            {new BigNumber(data.item.quantity).toFormat()}
          </Text>
          <Text style={styles.txt4}>交易成功</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav leftType="icon" title="转账记录" />
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
  loglist: {
    paddingTop: Fit(15),
    paddingBottom: Fit(15),
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    backgroundColor: "#fff",
    marginTop: Fit(10),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  lineLeft: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  lineRight: {
    textAlign: "right"
  },
  avatar: {
    width: Fit(113),
    height: Fit(113),
    borderRadius: Fit(113)
  },
  avatarpic: {
    width: Fit(113),
    height: Fit(113),
    borderRadius: Fit(113)
  },
  info: {
    marginLeft: Fit(25)
  },
  txt1: {
    color: "#8F8F8F",
    fontSize: Fit(26)
  },
  txt2: {
    color: "#8F8F8F",
    fontSize: Fit(20)
  },
  txt3n: {
    color: "#8B8B8B",
    fontSize: Fit(30),
    textAlign: "right"
  },
  txt3y: {
    color: "#5BEBB0",
    fontSize: Fit(30),
    textAlign: "right"
  },
  txt4: {
    color: "#8F8F8F",
    fontSize: Fit(20),
    textAlign: "right"
  }
});
module.exports = TransferBgaaLog;
