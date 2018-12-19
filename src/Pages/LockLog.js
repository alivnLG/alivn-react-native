import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import Common from "../styles/Common";
import BigNumber from "bignumber.js";
import RefreshListView, { RefreshState } from "react-native-refresh-list-view";
import Picker from "react-native-picker";
class LockLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "全部",
      dataList: [],
      refreshState: RefreshState.Idle,
      startDate: "",
      endDate: ""
    };
  }
  type = {
    USER: "用户锁仓",
    V2: "系统锁仓V2",
    V3: "系统锁仓V3",
    ACTIVITY: "权证锁仓"
  };

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }
  
  componentDidMount() {
    this.props.navigation.addListener("willFocus", payload => {
      this.onHeaderRefresh();
    });
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
      "/accounts/frozen?page=0&size=10&startDate=" +
        this.state.startDate +
        "&endDate=" +
        this.state.endDate
    );
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
      "/accounts/frozen?page=" +
        this.page +
        "&size=10&startDate=" +
        this.state.startDate +
        "&endDate=" +
        this.state.endDate
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
        <View style={styles.lineCom}>
          <Text style={styles.txtName}>锁仓时间：</Text>
          <Text style={styles.txtInfo}>{data.item.createTime}</Text>
        </View>
        <View style={styles.lineCom}>
          <Text style={styles.txtName}>锁仓类型：</Text>
          <Text style={styles.txtInfo}>{this.type[data.item.type]}</Text>
        </View>
        <View style={styles.lineCom}>
          <Text style={styles.txtName}>锁仓数量：</Text>
          <Text style={[styles.txtInfo]}>
            {new BigNumber(data.item.quantity).toFormat()} BGAA
          </Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <View style={styles.top}>
          <ImageBackground
            style={styles.itemBox}
            source={require("../Resources/images/chargelogbg.png")}
          >
            <View style={styles.nav}>
              <TouchableOpacity
                onPress={() => {
                  Actions.pop();
                  Picker.hide();
                }}
              >
                <Image
                  style={styles.back}
                  source={require("../Resources/images/back1.png")}
                />
              </TouchableOpacity>
              <Text style={styles.titleM}>锁仓记录</Text>
              <Text style={styles.titleR} />
            </View>
            <TouchableOpacity
              style={styles.dateChoose}
              onPress={() => {
                this._showTimePicker();
              }}
            >
              <Text style={styles.dateShow}>{this.state.title}</Text>
              <Image
                style={styles.arrow}
                source={require("../Resources/images/arrowd.png")}
              />
            </TouchableOpacity>
          </ImageBackground>
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
  itemBox: {
    width: Fit(750),
    height: Fit(237)
  },
  nav: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    paddingTop: STATUSBAR_HEIGHT + Fit(10)
  },
  titleM: {
    fontSize: Fit(36),
    color: "#fff"
  },
  back: {
    width: Fit(56),
    height: Fit(56)
  },
  dateChoose: {
    marginTop: isIphoneX() ? Fit(45) : Fit(60),
    paddingLeft: Fit(30),
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  dateShow: {
    color: "#ACFFD2",
    fontSize: Fit(26)
  },
  arrow: {
    width: Fit(29),
    height: Fit(16),
    marginLeft: Fit(15)
  },
  loglist: {
    paddingTop: Fit(15),
    paddingBottom: Fit(15),
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    backgroundColor: "#fff",
    marginBottom: Fit(20)
  },
  lineCom: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: Fit(5),
    marginTop: Fit(10)
  },
  txtName: {
    color: "#333",
    fontSize: Fit(24)
  },
  txtInfo: {
    width: Fit(540),
    color: "#999",
    fontSize: Fit(24),
    marginLeft: Fit(10)
  },
  space: {
    width: Fit(180),
    height: Fit(2)
  },
  lineState: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    borderTopColor: "#EDEDED",
    borderTopWidth: 1,
    paddingTop: Fit(20),
    marginTop: Fit(20)
  },
  txtNum: {
    color: "#FFC000"
  },
  success: {
    fontSize: Fit(24),
    color: "#37BB1C"
  },
  ing: {
    fontSize: Fit(24),
    color: "#666"
  },
  fail: {
    fontSize: Fit(24),
    color: "#FF6600"
  }
});

module.exports = LockLog;
