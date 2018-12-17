import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { Actions } from "react-native-router-flux";
import Common from "../styles/Common";
import RefreshListView, { RefreshState } from "react-native-refresh-list-view";
import Picker from "react-native-picker";
import BigNumber from "bignumber.js";

class SpeedLog extends Component {
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
      "/accounts/release?page=0&size=10&startDate=" +
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
      "/accounts/release?page=" +
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
        <View style={styles.lineState}>
          <Text style={styles.txtState}>{data.item.recordDate}</Text>
        </View>
        <View style={styles.lineCom}>
          <Text
            style={[styles.txtName, { fontSize: Fit(26), fontWeight: "bold" }]}
          >
            当日释放总量:
          </Text>
          <Text
            style={[
              styles.txtInfo,
              styles.txtNum,
              { fontSize: Fit(26), fontWeight: "bold" }
            ]}
          >
            {new BigNumber(data.item.realRelease).toFormat()}
          </Text>
        </View>
        <Text style={styles.itemType}>V2.0链接算力</Text>
        <View style={styles.lineCom}>
          <Text style={styles.txtName}>日算力释放量:</Text>
          <Text style={styles.txtInfo}>
            {new BigNumber(data.item.dayRelease).toFormat()}
          </Text>
        </View>
        <Text style={styles.itemType}>V3.0全球公排</Text>
        <View style={styles.lineCom}>
          <Text style={styles.txtName}>日算力释放量:</Text>
          <Text style={styles.txtInfo}>
            {new BigNumber(data.item.qqDayRelease).toFormat()}
          </Text>
        </View>
        {data.item.isWeekend ? null : (
          <View>
            <View style={styles.lineCom}>
              <Text style={styles.txtName}>节点加速释放量:</Text>
              <Text style={[styles.txtInfo, styles.txtNum]}>
                {new BigNumber(data.item.directLinkRelease).toFormat()}
              </Text>
            </View>
            <View style={styles.lineCom}>
              <Text style={styles.txtName}>链接算力加速释放量:</Text>
              <Text style={styles.txtInfo}>
                {new BigNumber(data.item.linkRelease).toFormat()}
              </Text>
              {parseFloat(data.item.linkRelease) >
              parseFloat(data.item.upLinkRelease) ? (
                <TouchableOpacity
                  style={styles.tsbtn}
                  onPress={() => {
                    this._tsInfo();
                  }}
                >
                  <Image
                    style={styles.tsicon}
                    source={require("../Resources/images/tsicon.png")}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.lineCom}>
              <Text style={styles.txtName}>链接算力加速封顶值:</Text>
              <Text style={[styles.txtInfo, styles.txtNum]}>
                {new BigNumber(data.item.upLinkRelease).toFormat()}
              </Text>
            </View>

            <View style={styles.lineCom}>
              <Text style={styles.txtName}>小节点链接算力释放量:</Text>
              <Text style={[styles.txtInfo, styles.txtNum]}>
                {new BigNumber(data.item.nodeRelease).toFormat()}
              </Text>
              {parseFloat(data.item.nodeRelease) >
              parseFloat(data.item.upNodeRelease) ? (
                <TouchableOpacity
                  style={styles.tsbtn}
                  onPress={() => {
                    this._tsInfo();
                  }}
                >
                  <Image
                    style={styles.tsicon}
                    source={require("../Resources/images/tsicon.png")}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.lineCom}>
              <Text style={styles.txtName}>小节点链接算力封顶值:</Text>
              <Text style={[styles.txtInfo, styles.txtNum]}>
                {new BigNumber(data.item.upNodeRelease).toFormat()}
              </Text>
            </View>
            <View style={styles.lineCom}>
              <Text style={styles.txtName}>大节点链接算力释放量:</Text>
              <Text style={[styles.txtInfo, styles.txtNum]}>
                {new BigNumber(data.item.maxNodeRelease).toFormat()}
              </Text>
              {parseFloat(data.item.maxNodeRelease) >
              parseFloat(data.item.upMaxNodeRelease) ? (
                <TouchableOpacity
                  style={styles.tsbtn}
                  onPress={() => {
                    this._tsInfo();
                  }}
                >
                  <Image
                    style={styles.tsicon}
                    source={require("../Resources/images/tsicon.png")}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.lineCom}>
              <Text style={styles.txtName}>大节点链接算力封顶值:</Text>
              <Text style={[styles.txtInfo, styles.txtNum]}>
                {new BigNumber(data.item.upMaxNodeRelease).toFormat()}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <View style={styles.top}>
          <ImageBackground
            style={styles.itemBox}
            source={require("../Resources/images/release.png")}
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
              <Text style={styles.titleM}>加速记录</Text>
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
    textAlign: "right",
    color: "#333",
    fontSize: Fit(24)
  },
  txtInfo: {
    color: "#999",
    fontSize: Fit(24),
    marginLeft: Fit(10)
  },
  lineState: {
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: "#EDEDED",
    borderBottomWidth: 1,
    paddingTop: Fit(20),
    paddingBottom: Fit(20),
    marginBottom: Fit(10)
  },
  txtState: {
    fontSize: Fit(24),
    color: "#25C063"
  },
  itemType: {
    fontSize: Fit(26),
    fontWeight: "bold",
    color: "#333",
    marginTop: Fit(30),
    marginBottom: Fit(5)
  },
  tsbtn: {
    marginLeft: Fit(10),
    width: Fit(50),
    height: Fit(30),
    justifyContent: "center",
    alignItems: "center"
  },
  tsicon: {
    width: Fit(25),
    height: Fit(25)
  }
});

module.exports = SpeedLog;
