import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Actions } from "react-native-router-flux";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import RefreshListView, { RefreshState } from "react-native-refresh-list-view";
import BigNumber from "bignumber.js";
class WarrantNotLog extends Component {
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
    let res = await Axios.get("/activitys/codes?page=0&size=10");
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
      "/activitys/codes?page=" + this.page + "&size=10"
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
      <View style={styles.itemList}>
        {data.item.status == "INSALE" ? (
          <Image
            style={styles.insale}
            source={require("../Resources/images/insale.png")}
          />
        ) : null}
        <View style={styles.itemData}>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>名称：</Text>
            <Text style={styles.itemTxt2}>{data.item.name}</Text>
          </View>
          {data.item.status == "INSALE" ? (
            <View style={styles.itemDataInfo}>
              <Text style={styles.itemTxt1}>价格：</Text>
              <Text style={styles.itemTxt2}>{data.item.price}</Text>
            </View>
          ) : null}
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>可得锁仓量：</Text>
            <Text style={styles.itemTxt2}>
              {new BigNumber(data.item.frozen).toFormat()}
            </Text>
          </View>
          {data.item.fromNickName ? (
            <View style={styles.itemDataInfo}>
              <Text style={styles.itemTxt1}>来源：</Text>
              <Text style={styles.itemTxt2}>{data.item.fromNickName}</Text>
            </View>
          ) : null}
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>时间：</Text>
            <Text style={styles.itemTxt2}>{data.item.updateTime}</Text>
          </View>
        </View>
        <View style={styles.line} />
        {data.item.status == "INSALE" ? (
          <View style={styles.buttonBox}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#B3B3B3" }]}
              onPress={() => {
                const self = this;
                Confirm.confirm({
                  icon: "info",
                  msg: `您确定要取消出售`,
                  onOk: () => {
                    Axios.post(`/activitys/${data.item.id}/cancel`).then(
                      res => {
                        Alert.alert({
                          icon: "success",
                          msg: "取消成功",
                          onClose: function() {
                            self.onHeaderRefresh();
                          }
                        });
                      }
                    );
                  }
                });
              }}
            >
              <Text style={{ color: "#fff" }}>取消</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonBox}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ffc000" }]}
              onPress={() => {
                Actions.sellWarrant({
                  activitysId: data.item.activityId,
                  id: data.item.id
                });
              }}
            >
              <Text style={{ color: "#fff" }}>出售</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => {
                Actions.transferWarrant({
                  activitysId: data.item.activityId,
                  id: data.item.id
                });
              }}
            >
              <Text style={{ color: "#fff" }}>转让</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#FF6F06" }]}
              onPress={() => {
                const self = this;
                Confirm.confirm({
                  icon: "info",
                  msg: `您确定要使用权证，使用后会得到${
                    data.item.frozen
                  }BGAA锁仓`,
                  onOk: () => {
                    Axios.post(`/activitys/${data.item.id}/use`).then(res => {
                      Alert.alert({
                        icon: "success",
                        msg: "使用成功",
                        onClose: () => {
                          self.onHeaderRefresh();
                        }
                      });
                    });
                  }
                });
              }}
            >
              <Text style={{ color: "#fff" }}>立即使用</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav leftType="icon" title="权证记录" />
        <View style={styles.nav}>
          <View style={styles.navItem}>
            <Text style={[styles.navText, { color: "#3CD168" }]}>未使用</Text>
            <View style={styles.navLine} />
          </View>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              Actions.warrantLog();
            }}
          >
            <Text style={[styles.navText, { color: "#666" }]}>已使用</Text>
          </TouchableOpacity>
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
  insale: {
    position: "absolute",
    right: Fit(30),
    top: 0,
    zIndex: 2,
    width: Fit(160),
    height: Fit(120)
  },
  itemList: {
    position: "relative",
    backgroundColor: "#fff",
    marginTop: Fit(20),
    zIndex: 1
  },
  itemData: {
    position: "relative",
    zIndex: 3,
    marginTop: Fit(25),
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    paddingBottom: Fit(15)
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
  buttonBox: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    height: Fit(80),
    paddingLeft: Fit(30),
    paddingRight: Fit(30)
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: Fit(160),
    height: Fit(60),
    borderRadius: Fit(80),
    marginLeft: Fit(30),
    backgroundColor: "#30B91B"
  }
});
module.exports = WarrantNotLog;
