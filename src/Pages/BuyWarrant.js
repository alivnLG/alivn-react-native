import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from "react-native";
import { Actions } from "react-native-router-flux";
import { validate, submit, getErrorsInField } from "../Common/validate";
import Common from "../styles/Common";
import BigNumber from "bignumber.js";
class BuyWarrant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        payType: "payType",
        type: "type"
      },
      quantity: 0,
      quantityZ: 0,
      kc: 0
    };
  }

  payType = {
    payType: {},
    RMB: {
      name: "积分",
      payTxt: "积分",
      txt: "积分"
    },
    AVAILABLE: {
      name: "BGAA",
      payTxt: "可用BGAA",
      txt: "可用余额"
    },
    TRANSFER: {
      name: "BGAA",
      payTxt: "消费BGAA",
      txt: "消费钱包"
    },
    QQFROZEN: {
      name: "BGAA",
      payTxt: "锁仓BGAA",
      txt: "锁仓余额"
    },
    ETH: {
      name: "ETH",
      payTxt: "ETH余额",
      txt: "ETH余额"
    },
    WARRANT: {
      name: "BGAA",
      payTxt: "权证BGAA",
      txt: "权证余额"
    }
  };
  type = {
    type: {},
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

  componentDidMount() {
    this._getInfo();
  }

  _getInfo() {
    Axios.get("/activitys/" + this.props.id).then(res => {
      this.setState({ data: res.data });
    });
  }

  _postBuyWarrant() {
    Axios.post("/activitys/" + this.props.id + "/codes", {
      quantity: this.state.quantityZ
    }).then(res => {
      Alert.alert({
        icon: "success",
        msg: "抢购成功！",
        onClose: function() {
          Actions.pop();
        }
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  render() {
    return (
      <View style={[Common.container]}>
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
            <Text style={styles.titleM}>权证抢购</Text>
            <Text style={styles.titleR} />
          </View>
        </ImageBackground>
        <ScrollView style={styles.content}>
          <View style={styles.itemData}>
            <View style={styles.itemLine}>
              <Text style={styles.itemName}>名称：</Text>
              <Text style={styles.itemValue}>{this.state.data.name}</Text>
            </View>
            <View style={styles.itemLine}>
              <Text style={styles.itemName}>剩余：</Text>
              <Text style={styles.itemValue}>{this.state.data.remain}</Text>
            </View>
            <View style={styles.itemLine}>
              <Text style={styles.itemName}>单价：</Text>
              <Text style={styles.itemValue}>{this.state.data.price}</Text>
            </View>
            <View style={styles.itemLine}>
              <Text style={styles.itemName}>可抢：</Text>
              <Text style={styles.itemValue}>
                {this.state.data.allowedLimit - this.state.data.buiedCount < 0
                  ? 0
                  : this.state.data.allowedLimit - this.state.data.buiedCount}
              </Text>
            </View>
            <View style={styles.itemLine}>
              <Text style={styles.itemName}>参与类型：</Text>
              <Text style={styles.itemValue}>
                {this.type[this.state.data.type].name}
              </Text>
            </View>
            <View style={styles.itemLine}>
              <Text style={styles.itemName}>支付方式：</Text>
              <Text style={styles.itemValue}>
                {this.payType[this.state.data.payType].payTxt}
              </Text>
            </View>
            <View
              style={[
                styles.itemLine,
                {
                  marginTop: Fit(20),
                  marginLeft: Fit(30),
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginRight: Fit(30),
                  paddingTop: Fit(20),
                  borderTopWidth: 1,
                  borderTopColor: "#F0F0F0"
                }
              ]}
            >
              <Text
                style={[
                  styles.itemName,
                  { color: "#3BD168", fontSize: Fit(24) }
                ]}
              >
                说明：可得{this.state.data.frozen}BGAA锁仓
              </Text>
            </View>
            <Image
              style={styles.itemimg}
              source={require("../Resources/images/itemimg.png")}
            />
          </View>
          <View
            style={[
              Common.fromBox,
              { paddingLeft: 0, paddingRight: 0, marginTop: Fit(20) }
            ]}
          >
            <TextInput
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              style={Common.inputStyle}
              ref="quantityZ"
              onChangeText={quantity => {
                const verData = validate(this, {
                  value: quantity,
                  name: "quantityZ"
                });
                if (verData) {
                  this.setState({
                    kc: this.state.data.price * this.state.quantityZ
                  });
                }
              }}
              placeholder="请输入抢购数量"
            />
            <Text style={Common.errMsg}>{getErrorsInField("quantityZ")}</Text>
            <View style={Common.itemBox}>
              <Text style={styles.txtRight}>
                {this.payType[this.state.data.payType].name}
              </Text>
              <TextInput
                keyboardType="numeric"
                underlineColorAndroid="transparent"
                style={[Common.inputStyle, { color: "#FFC000" }]}
                editable={false}
                value={"扣除" + new BigNumber(this.state.kc).toFormat()}
              />
            </View>
            <Text style={styles.txtye}>
              {this.payType[this.state.data.payType].txt}：
              {new BigNumber(this.state.data.available).toFormat()}
              {this.payType[this.state.data.payType].name}
            </Text>
            <View style={styles.buttonOuter}>
              {this.state.data.allowedLimit == 0 ? (
                <TouchableOpacity
                  style={[Common.buttonStyle, Common.buttonDisable]}
                >
                  <Text style={Common.buttonTextStyle}>确定</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  underlayColor="#18a304"
                  onPress={() => {
                    const verData = submit(this);
                    if (verData) {
                      this._postBuyWarrant();
                    }
                  }}
                  style={Common.buttonStyle}
                >
                  <Text style={Common.buttonTextStyle}>确定</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
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
  content: {
    marginLeft: Fit(40),
    marginRight: Fit(40),
    marginTop: -Fit(100),
    backgroundColor: "#fff"
  },
  itemData: {
    paddingTop: Fit(25)
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
  itemimg: {
    width: Fit(670),
    height: Fit(47)
  },
  txtye: {
    fontSize: Fit(24),
    color: "#9b9b9b",
    marginTop: Fit(8),
    textAlign: "right",
    color: "#3BD168"
  },
  txtRight: {
    position: "absolute",
    top: Fit(35),
    right: 0,
    fontSize: Fit(26),
    color: "#9B9B9B"
  }
});

module.exports = BuyWarrant;
