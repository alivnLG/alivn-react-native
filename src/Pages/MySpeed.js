import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from "react-native";
import { Actions } from "react-native-router-flux";
import Common from "../styles/Common";
import BigNumber from "bignumber.js";
import RefreshListView, { RefreshState } from "react-native-refresh-list-view";

class MySpeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: {},
      node: [],
      type: "SPEED",
      dataList: [],
      refreshState: RefreshState.Idle
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }
  componentDidMount() {
    this._getInfo();
  }

  changType(type) {
    this.setState({
      type: type
    });
    if (type == "SPEED") {
      this._getInfo();
    } else {
      this.onHeaderRefresh();
    }
  }

  _getInfo() {
    Axios.get("/users/speedup").then(res => {
      this.setState({ speed: res.data });
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
    let res = await Axios.get("/users/nodeSpeedup");
    await this.sleep(1000);
    let dataList = res.data;
    this.setState({
      dataList: dataList,
      refreshState:
        dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
    });
  }
  //滑动加载更多
  async onFooterRefresh() {}
  renderCell(data) {
    return (
      <View style={styles.nitem}>
        <View style={[styles.xleft, { marginBottom: Fit(10) }]}>
          <Text style={styles.ntxt1}>
            节点
            {data.index + 1}
          </Text>
          {data.item.valid ? null : (
            <Image
              style={styles.nodewarn}
              source={require("../Resources/images/warning.png")}
            />
          )}
        </View>
        <View style={styles.nleft}>
          <Text style={styles.ntxtn}>当日加速：</Text>
          <View style={styles.ntxtOuter}>
            <Text style={styles.ntxt2}>
              {new BigNumber(data.item.dayLink).toFormat()}
            </Text>
          </View>
        </View>
        <View style={styles.nleft}>
          <Text style={styles.ntxtn}>历史加速：</Text>
          <View style={styles.ntxtOuter}>
            <Text style={styles.ntxt2}>
              {new BigNumber(data.item.teamTotal).toFormat()}
            </Text>
          </View>
        </View>
        <Image
          style={styles.nodeimg}
          source={require("../Resources/images/nodebg.png")}
        />
      </View>
    );
  }
  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <ImageBackground
          style={styles.headerBox}
          source={require("../Resources/images/speedbg.png")}
        >
          <View style={styles.nav}>
            <TouchableOpacity onPress={Actions.pop}>
              <Image
                style={styles.back}
                source={require("../Resources/images/back1.png")}
              />
            </TouchableOpacity>
            <Text style={styles.titleM}>我的加速</Text>
            <Text
              style={styles.titleR}
              onPress={() => {
                Actions.speedLog();
              }}
            >
              加速记录
            </Text>
          </View>
          <View style={styles.itemTab}>
            <Text
              onPress={() => this.changType("SPEED")}
              style={[
                styles.tabTxt,
                this.state.type == "SPEED" ? styles.active : null
              ]}
            >
              加速数据
            </Text>
            <Text
              onPress={() => this.changType("NODE")}
              style={[
                styles.tabTxt,
                this.state.type == "NODE" ? styles.active : null
              ]}
            >
              节点数据
            </Text>
          </View>
        </ImageBackground>
        {this.state.type == "SPEED" ? (
          <ScrollView style={styles.content}>
            <View style={styles.sitem}>
              <View style={styles.sleft}>
                <Text style={styles.stxt1}>V2.0链接算力待加速</Text>
                <Text style={styles.stxt2}>
                  {new BigNumber(this.state.speed.frozen).toFormat()}
                </Text>
              </View>
              <Image
                style={styles.simg}
                source={require("../Resources/images/simg1.png")}
              />
            </View>
            <View style={styles.sitem}>
              <View style={styles.sleft}>
                <Text style={styles.stxt1}>V3.0全员公排待加速</Text>
                <Text style={styles.stxt2}>
                  {new BigNumber(this.state.speed.qqFrozen).toFormat()}
                </Text>
              </View>
              <Image
                style={styles.simg}
                source={require("../Resources/images/simg2.png")}
              />
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.content}>
            <RefreshListView
              style={styles.listHeight}
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
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  titleR: {
    fontSize: Fit(30),
    color: "#fff"
  },
  back: {
    width: Fit(56),
    height: Fit(56)
  },
  header: {
    paddingTop: Fit(55),
    paddingBottom: Fit(65),
    flexDirection: "row"
  },
  headerBox: {
    height: Fit(294),
    width: Fit(750)
  },
  itemTab: {
    marginTop: isIphoneX() ? Fit(40) : Fit(50),
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
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
  content: {
    marginLeft: Fit(40),
    marginRight: Fit(40),
    marginBottom: Fit(60),
    marginTop: -Fit(60),
    backgroundColor: "#f5f5f5"
  },
  sitem: {
    height: Fit(200),
    marginBottom: Fit(30),
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingLeft: Fit(60),
    position: "relative"
  },
  simg: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: Fit(248),
    height: Fit(200),
    zIndex: -1
  },
  nitem: {
    marginBottom: Fit(30),
    paddingTop: Fit(30),
    paddingBottom: Fit(30),
    paddingLeft: Fit(40),
    paddingRight: Fit(40),
    backgroundColor: "#fff"
  },
  nleft: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    zIndex: 2
  },
  xleft: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    zIndex: 2
  },
  ntxtOuter: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center"
  },
  nodewarn: {
    marginLeft: Fit(10),
    width: Fit(30),
    height: Fit(30)
  },
  nodeimg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: Fit(670),
    height: Fit(88),
    zIndex: 1
  },
  ntxt1: {
    fontSize: Fit(28),
    color: "#333"
  },
  ntxt1: {
    fontSize: Fit(26),
    color: "#666"
  },
  ntxt2: {
    fontSize: Fit(30),
    color: "#FFC000"
  },
  stxt1: {
    fontSize: Fit(28),
    color: "#333"
  },
  stxt2: {
    marginTop: Fit(20),
    fontSize: Fit(38),
    color: "#FFC000"
  },
  listHeight: {
    minHeight: Fit(400)
  }
});

module.exports = MySpeed;
