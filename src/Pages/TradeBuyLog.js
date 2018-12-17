import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import RefreshListView, { RefreshState } from "react-native-refresh-list-view";
import Picker from "react-native-picker";
import BigNumber from "bignumber.js";

class TradeBuyLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "全部",
      dataList: [],
      refreshState: RefreshState.Idle,
      startDate: "",
      endDate: "",
      total: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentDidMount() {
    this.onHeaderRefresh();
  }

  //选择时间
  _showTimePicker() {
    let years = [],
      months = [];
    for (let i = 1; i < 51; i++) {
      years.push(i + 1980);
    }
    for (let i = 1; i < 13; i++) {
      months.push(i < 10 ? "0" + i : i);
    }
    let pickerData = [years, months];
    let date = new Date();
    let selectedValue = [date.getFullYear(), date.getMonth() + 1];
    Picker.init({
      pickerData,
      selectedValue,
      pickerConfirmBtnText: "确定",
      pickerCancelBtnText: "取消",
      pickerTitleText: "选择时间",
      wheelFlex: [2, 1, 1, 2, 1, 1],
      onPickerConfirm: pickedValue => {
        console.log(pickedValue);
        let startDate = pickedValue[0] + "-" + pickedValue[1] + "-01 00:00:00";
        let endDate =
          pickedValue[0] +
          "-" +
          pickedValue[1] +
          "-" +
          new Date(pickedValue[0], pickedValue[1], 0).getDate() +
          " 23:59:59";
        this.setState({
          startDate: startDate,
          endDate: endDate,
          title: pickedValue[0] + "-" + pickedValue[1]
        });
        this.onHeaderRefresh();
      }
    });
    Picker.show();
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
    let res = await Axios.get(
      "/cabinets/bids?page=0&size=10&startDate=" +
        this.state.startDate +
        "&endDate=" +
        this.state.endDate
    );
    await this.sleep(1000);
    let dataList = res.data.list;
    this.setState({
      total: res.data.total,
      dataList: dataList,
      refreshState:
        dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
    });
  }
  //滑动加载更多
  async onFooterRefresh() {}

  renderCell(data) {
    return (
      <View style={styles.itemList}>
        <View style={styles.itemLine}>
          <View style={styles.itemTxtL}>
            <Text style={[styles.itemTxt, styles.itemTxt1]}>购买数量：</Text>
            <Text style={[styles.itemTxt, styles.itemTxt2]}>
              {new BigNumber(data.item.quantity).toFormat()}
              BGAA
              {data.item.status == "ACTIVE" ? "(在途资金)" : ""}
            </Text>
          </View>
          <View style={styles.itemTxtR}>
            <Text style={[styles.itemTxt, styles.itemTxt3]}>
              {data.item.status == "ACTIVE" ? "进行中" : "交易完成"}
            </Text>
          </View>
        </View>
        <View style={styles.itemLine}>
          <View style={styles.itemTxtL}>
            <Text style={[styles.itemTxt, styles.itemTxt1]}>积分：</Text>
            <Text style={styles.itemTxt}>
              {new BigNumber(data.item.rmb).toFormat()}
            </Text>
          </View>
        </View>
        <View style={styles.itemLine}>
          <View style={styles.itemTxtL}>
            <Text style={[styles.itemTxt, styles.itemTxt1]}>购买时间：</Text>
            <Text style={styles.itemTxt}>{data.item.createTime}</Text>
          </View>
        </View>
        <View style={styles.itemLine}>
          <View style={styles.itemTxtL}>
            <Text style={[styles.itemTxt, styles.itemTxt1]}>订单编号：</Text>
            <Text style={styles.itemTxt}>{data.item.bidNo}</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav leftType="icon" title="交易记录" />
        <View style={styles.tabChoose}>
          <Text
            onPress={() => {
              Actions.tradebuylog();
            }}
            style={[
              styles.itemTab,
              { color: "#41D06A" },
              { borderRightColor: "#EEE", borderRightWidth: 1 }
            ]}
          >
            购买
          </Text>
          <Text
            onPress={() => {
              Actions.tradeSellLog();
            }}
            style={[styles.itemTab]}
          >
            出售
          </Text>
        </View>
        <View style={styles.dateChoose}>
          <View style={styles.lTxt}>
            <Text style={styles.ltxt1}>{this.state.title}</Text>
            <Text style={styles.ltxt2}>
              购买数量总计：
              {new BigNumber(this.state.total).toFormat()}
              BGAA
            </Text>
          </View>
          <TouchableOpacity
            style={styles.dateImg}
            onPress={() => {
              this._showTimePicker();
            }}
          >
            <Image
              style={styles.dateIcon}
              source={require("../Resources/images/dateIcon.png")}
            />
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
  tabChoose: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: Fit(20)
  },
  itemTab: {
    flex: 1,
    textAlign: "center",
    height: Fit(74),
    fontSize: Fit(30),
    color: "#666",
    lineHeight: Fit(74)
  },
  dateChoose: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: Fit(20),
    paddingRight: Fit(20),
    paddingTop: Fit(10),
    paddingBottom: Fit(10)
  },
  ltxt1: {
    color: "#3C3D3C",
    fontSize: Fit(26)
  },
  ltxt2: {
    color: "#999",
    fontSize: Fit(22)
  },
  dateImg: {
    justifyContent: "flex-end",
    alignItems: "center"
  },
  dateIcon: {
    width: Fit(41),
    height: Fit(41)
  },
  itemList: {
    backgroundColor: "#fff",
    paddingTop: Fit(25),
    paddingBottom: Fit(15),
    paddingLeft: Fit(20),
    paddingRight: Fit(20),
    borderBottomColor: "#eee",
    borderBottomWidth: 1
  },
  itemLine: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: Fit(10)
  },
  itemTxtL: {
    justifyContent: "flex-start",
    flexDirection: "row"
  },
  itemTxt: {
    fontSize: Fit(26),
    color: "#999"
  },
  itemTxt1: {
    color: "#333"
  },
  itemTxt2: {
    color: "#FFC000"
  },
  itemTxt3: {
    color: "#FF6600"
  }
});

module.exports = TradeBuyLog;
