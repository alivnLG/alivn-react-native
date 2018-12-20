import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  ScrollView
} from "react-native";
import Common from "../styles/Common";
class My extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userinfo: {}
    };
  }

  //控制是否渲染刷新
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.state) != JSON.stringify(nextState);
  }

  //组件渲染完成
  componentDidMount() {
    this.props.navigation.addListener("willFocus", payload => {
      this._getData();
    });
  }

  _getData() {
    Axios.get("/users/info").then(res => {
      this.setState({
        userinfo: res.data
      });
    });
  }
  _contactUs() {
    Confirm.confirm({
      icon: "info",
      msg:
        "如有问题或建议反馈给我们，这将帮助我们持续改进。邮箱:contactus@bgaa.vip"
    });
  }
  _logOut() {
    Confirm.confirm({
      icon: "info",
      msg: "退出后不会删除任何历史数据，下次登录依然可以使用本账号。",
      onOk: () => {
        Store.setItem("userinfo", {});
        Actions.reset("login");
      }
    });
  }

  render() {
    return (
      <ScrollView style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <View style={styles.header}>
          <Text style={styles.title}>个人中心</Text>
          <View style={styles.headerBox}>
            <TouchableOpacity>
              <Image
                style={styles.face}
                source={require("../Resources/images/userAvatar.png")}
              />
            </TouchableOpacity>
            <View style={styles.headerTextBox}>
              <Text onPress={Actions.updatename} style={styles.headerTextStyle}>
                {this.state.userinfo.nickname}
              </Text>
              <Text style={[styles.headerTextStyle, { fontSize: Fit(28) }]}>
                {this.state.userinfo.email}
              </Text>
            </View>
            <TouchableOpacity
              onPress={Actions.myCode}
              style={styles.rightButton}
            >
              <Image
                style={styles.rightButtonIcon}
                source={require("../Resources/images/qricon.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ backgroundColor: "#FFF" }}>
          <TouchableOpacity style={styles.linkItem} onPress={Actions.ethLog}>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/ethicon.png")}
            />
            <Text style={styles.linkItemText}>ETH记录</Text>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/right.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={Actions.bgaaLog}>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/bgaaicon.png")}
            />
            <Text style={styles.linkItemText}>BGAA记录</Text>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/right.png")}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={Actions.warrantNotLog}
          >
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/qzlog.png")}
            />
            <Text style={styles.linkItemText}>权证记录</Text>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/right.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => {
              const userinfo = Store.getItem("userinfo");
              if (!userinfo.hasTradePwd) {
                Actions.capitalPwd();
              } else {
                Actions.updateCapitalPwd();
              }
            }}
          >
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/zjicon.png")}
            />
            <Text style={styles.linkItemText}>资金密码</Text>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/right.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={Actions.noticeList}
          >
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/Notice.png")}
            />
            <Text style={styles.linkItemText}>公告</Text>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/right.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => {
              this._contactUs();
            }}
          >
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/contact.png")}
            />
            <Text style={styles.linkItemText}>联系我们</Text>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/right.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/update.png")}
            />
            <Text style={styles.linkItemText}>检查更新</Text>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/right.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={Actions.imageShow}>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/update.png")}
            />
            <Text style={styles.linkItemText}>图片浏览</Text>
            <Image
              style={styles.linkItemIcon}
              source={require("../Resources/images/right.png")}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.logOut}
          onPress={() => {
            this._logOut();
          }}
        >
          <Text style={styles.logOutText}>安全退出</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F9"
  },
  header: {
    height: Fit(329),
    backgroundColor: "#2DCD66",
    justifyContent: "center"
  },
  title: {
    textAlign: "center",
    color: "#FFF",
    fontSize: Fit(33),
    marginTop: Fit(80),
    marginBottom: Fit(37)
  },
  headerBox: {
    flexDirection: "row",
    height: Fit(113),
    width: Fit(750),
    position: "relative"
  },
  face: {
    height: Fit(113),
    width: Fit(113),
    marginLeft: Fit(40),
    borderRadius: Fit(56.5)
  },
  headerTextStyle: {
    color: "#fff",
    fontSize: Fit(33)
  },
  headerTextBox: {
    justifyContent: "center",
    marginLeft: Fit(10)
  },
  rightButton: {
    position: "absolute",
    backgroundColor: "#FFF",
    width: Fit(150),
    height: Fit(74),
    borderRadius: Fit(74),
    right: -Fit(37),
    top: "50%",
    marginTop: -Fit(37),
    overflow: "hidden"
  },
  rightButtonIcon: {
    width: Fit(47),
    height: Fit(47),
    marginTop: Fit(15),
    marginLeft: Fit(17)
  },
  linkItem: {
    height: Fit(100),
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#DFDFDF",
    paddingLeft: Fit(38),
    paddingRight: Fit(38),
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  linkItemText: {
    flex: 1,
    color: "#010101",
    fontSize: Fit(28),
    paddingLeft: Fit(16)
  },
  linkItemIcon: {
    height: Fit(43),
    width: Fit(43)
  },
  logOut: {
    marginTop: Fit(40),
    marginBottom: Fit(80),
    justifyContent: "center",
    alignItems: "center",
    height: Fit(100),
    backgroundColor: "#FFF"
  },
  logOutText: {
    color: "#0DE28B",
    fontSize: Fit(28)
  }
});

module.exports = My;
