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
class GetWarrant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      refreshState: RefreshState.Idle
    };
  }
  payType = {
    RMB: {
      payTxt: "积分"
    },
    AVAILABLE: {
      payTxt: "可用BGAA"
    },
    TRANSFER: {
      payTxt: "消费BGAA"
    },
    QQFROZEN: {
      payTxt: "锁仓BGAA"
    },
    ETH: {
      payTxt: "ETH余额"
    },
    WARRANT: {
      payTxt: "权证BGAA"
    },
    RMB_WARRANT: {
      payTxt: "积分+权证BGAA"
    }
  };
  type = {
    QQQUOTA: {
      name: "锁仓标准参与类"
    },
    QQFROZEN: {
      name: "锁仓余量参与类"
    },
    ETH: {
      name: "ETH总量参与类"
    },
    RMB: {
      name: "积分总量参与类"
    }
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
    let res = await Axios.get("/activitys?page=0&size=10");
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
    let res = await Axios.get("/activitys?page=" + this.page + "&size=10");
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
        {data.item.status == "ACTIVE" ? null : (
          <Image
            style={styles.endimg}
            source={require("../Resources/images/endimg.png")}
          />
        )}
        <View style={styles.itemData}>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>名称：</Text>
            <Text style={styles.itemTxt2}>{data.item.name}</Text>
          </View>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>总数：</Text>
            <Text style={styles.itemTxt2}>
              {new BigNumber(data.item.total).toFormat()}
            </Text>
          </View>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>剩余：</Text>
            <Text style={[styles.itemTxt2, { color: "#FFC000" }]}>
              {new BigNumber(data.item.remain).toFormat()}
            </Text>
          </View>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>单价：</Text>
            <Text style={[styles.itemTxt2, { color: "#FFC000" }]}>
              {new BigNumber(data.item.price).toFormat()}{" "}
            </Text>
          </View>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>参与类型：</Text>
            <Text style={styles.itemTxt2}>
              {this.type[data.item.type].name}
            </Text>
          </View>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>支付方式：</Text>
            <Text style={styles.itemTxt2}>
              {this.payType[data.item.payType].payTxt}
            </Text>
          </View>
          <View style={styles.itemDataInfo}>
            <Text style={styles.itemTxt1}>说明：</Text>
            <Text style={[styles.itemTxt2, { color: "#333" }]}>
              可得{data.item.frozen}BGAA锁仓
            </Text>
          </View>
        </View>
        {data.item.status == "ACTIVE" ? (
          <View style={styles.itemOper}>
            <Text style={styles.itemTime1}>
              开始时间：{data.item.startTime}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Actions.buyWarrant({ id: data.item.id });
              }}
              style={[styles.operBtn, { backgroundColor: "#30B91B" }]}
            >
              <Text style={styles.operTxt}>立即抢购</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.itemOper2}>
            <View style={styles.itemDataInfo}>
              <Text style={styles.itemTxt1}>开始时间：</Text>
              <Text style={styles.itemTxt2}>{data.item.startTime}</Text>
            </View>
            <View style={styles.itemDataInfo}>
              <Text style={styles.itemTxt1}>结束时间：</Text>
              <Text style={styles.itemTxt2}>{data.item.endTime}</Text>
            </View>
          </View>
        )}
        <Image
          style={styles.itemimg}
          source={require("../Resources/images/itemimg.png")}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav
          leftType="icon"
          title="权证抢购"
          rightType="txt"
          rightTxt="权证记录"
          onRight={() => {
            Actions.warrantNotLog();
          }}
        />
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
  endimg: {
    width: Fit(161),
    height: Fit(142),
    position: "absolute",
    right: 0,
    top: 0
  },
  itemList: {
    position: "relative",
    backgroundColor: "#fff",
    marginTop: Fit(20),
    marginLeft: Fit(20),
    marginRight: Fit(20)
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
    paddingBottom: Fit(15)
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
    marginLeft: Fit(30),
    marginRight: Fit(30),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  itemOper2: {
    borderTopColor: "#F0F0F0",
    borderTopWidth: 1,
    marginTop: Fit(30),
    paddingTop: Fit(15),
    paddingBottom: Fit(15),
    marginLeft: Fit(30),
    marginRight: Fit(30)
  },
  itemTime1: {
    color: "#3BD168",
    fontSize: Fit(24)
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
  itemimg: {
    width: Fit(710),
    height: Fit(47)
  }
});
module.exports = GetWarrant;
