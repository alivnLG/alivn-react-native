import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Actions } from "react-native-router-flux";
import { validate, submit, getErrorsInField } from "../Common/validate";
import Common from "../styles/Common";
import Nav from "../Component/Nav";

class TransferWarrant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configs: {},
      data: {}
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }
  componentDidMount() {
    this._getInfo();
    this._getconfigs();
  }

  _getconfigs() {
    Axios.get("/configs").then(res => {
      this.setState({ configs: res.data });
    });
  }

  _getInfo() {
    Axios.get("/activitys/" + this.props.activitysId).then(res => {
      this.setState({ data: res.data });
    });
  }

  _postTransferwarrant() {
    Axios.post("/activitys/" + this.props.id + "/transfer", {
      email: this.state.email,
      tradePassword: this.tradePassword
    }).then(res => {
      Alert.alert({
        icon: "success",
        msg: "转让成功！",
        onClose: () => {
          Actions.pop();
        }
      });
    });
  }

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav leftType="icon" title="权证转让" />
        <ScrollView>
          <View style={styles.itemData}>
            <View style={styles.itemLine}>
              <Text style={styles.itemName}>名称：</Text>
              <Text style={styles.itemValue}>{this.state.data.name}</Text>
            </View>
            <View style={styles.itemLine}>
              <Text style={styles.itemName}>说明：</Text>
              <Text style={styles.itemValue}>
                可得{this.state.data.frozen}BGAA锁仓
              </Text>
            </View>

            <Image
              style={styles.itemimg}
              source={require("../Resources/images/itemimg.png")}
            />
          </View>

          <TextInput
            underlineColorAndroid="transparent"
            style={styles.inputStyle}
            ref="email"
            onChangeText={email => {
              validate(this, {
                value: email,
                name: "email"
              });
            }}
            placeholder="请输入转让账号"
          />
          <Text style={[Common.errMsg, styles.marginLeftRight]}>
            {getErrorsInField("email")}
          </Text>
          <TouchableOpacity
            underlayColor="#18a304"
            onPress={() => {
              const self = this;
              const verData = submit(this);
              if (verData) {
                const userinfo = Store.getItem("userinfo");
                if (!userinfo.hasTradePwd) {
                  Confirm.confirm({
                    icon:"info",
                    msg: "未设置资金密码，点击确认前往设置！",
                    cancelTxt: "取消",
                    okTxt: "确认",
                    onOk: () => {
                      Actions.capitalpwd();
                    }
                  });
                } else {
                  TradePannel.tradePannel({
                    title: "请输入资金密码",
                    msg: `转让将扣除${this.state.configs.transCodeRate *
                      100}%手续费`,
                    onOk: res => {
                      self.tradePassword = res;
                      self._postTransferwarrant();
                    }
                  });
                }
              }
            }}
            style={[Common.buttonStyle, styles.marginLeftRight]}
          >
            <Text style={Common.buttonTextStyle}>转让</Text>
          </TouchableOpacity>
          <Text style={styles.notice}>
            转让将扣除{this.state.configs.transCodeRate * 100}%手续费
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemData: {
    margin: Fit(30),
    backgroundColor: "#fff",
    borderRadius: Fit(8),
    overflow: "hidden",
    paddingTop: Fit(30)
  },
  itemimg: {
    width: Fit(690),
    height: Fit(30)
  },
  itemLine: {
    paddingLeft: Fit(30),
    paddingRight: Fit(30),
    marginBottom: Fit(10),
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  itemName: {
    fontSize: Fit(26),
    color: "#333"
  },
  itemValue: {
    fontSize: Fit(26),
    color: "#666"
  },
  inputStyle: {
    marginLeft: Fit(30),
    marginRight: Fit(30),
    backgroundColor: "#fff",
    height: Fit(80),
    fontSize: Fit(30),
    paddingLeft: Fit(30),
    paddingRight: Fit(30)
  },
  marginLeftRight: {
    marginLeft: Fit(30),
    marginRight: Fit(30)
  },
  notice: {
    marginLeft: Fit(30),
    marginRight: Fit(30),
    marginTop: Fit(5),
    fontSize: Fit(24)
  }
});

module.exports = TransferWarrant;
