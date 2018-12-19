import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import RefreshListView, { RefreshState } from "react-native-refresh-list-view";

class Noticelist extends Component {
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
    let res = await Axios.get("/notices?page=0&size=10");
    await this.sleep(1000);
    let dataList = res.data.content;
    Store.setItem("noticeStoreSize", res.data.totalElement);
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
    let res = await Axios.get("/notices?page=" + this.page + "&size=10");
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
        <TouchableOpacity
          underlayColor="#18a304"
          onPress={() => {
            Actions.noticeinfo({ id: data.item.id });
          }}
        >
          <View style={[styles.lineCom, styles.lineComy]}>
            <Text style={styles.txtName}>{data.item.title}</Text>
          </View>
          <View style={styles.lineCom}>
            <Text style={styles.txtInfo}>
              {data.item.releaseTime.substring(0, 16)}
            </Text>
            <View style={styles.lineRight}>
              <Text style={styles.more}>点击查看</Text>
              <Image
                style={styles.linkItemIcon}
                source={require("../Resources/images/n-arrow.png")}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav leftType="icon" title="公告" />
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
    backgroundColor: "#fff",
    marginTop: Fit(20)
  },
  lineCom: {
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: Fit(5),
    marginTop: Fit(10)
  },
  lineComy: {
    paddingBottom: Fit(15),
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1
  },
  lineRight: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  more: {
    fontSize: Fit(26),
    color: "#FF9900"
  },
  txtName: {
    color: "#333",
    fontSize: Fit(28)
  },
  txtInfo: {
    color: "#999",
    fontSize: Fit(24)
  },
  linkItemIcon: {
    width: Fit(30),
    height: Fit(30),
    marginLeft: Fit(10)
  }
});

module.exports = Noticelist;
