import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from "react-native";
import { validate, submit, getErrorsInField } from "../Common/validate";
import Common from "../styles/Common";
import BigNumber from "bignumber.js";

class Buybgaa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: {},
      quantity: 0
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", payload => {
      this._getAccounts();
    });
  }

  _getAccounts() {
    Axios.get("/accounts").then(res => {
      this.setState({ accounts: res.data[0] });
    });
  }

  _Buybgaa() {
    Axios.post("/cabinets/" + this.props.id + "/bids", {
      quantity: this.state.quantity
    }).then(res => {
      Alert.alert({
        icon: "success",
        msg: "提交成功！",
        onClose: () => {
          Actions.pop();
        }
      });
    });
  }

  render() {
    return (
      <ScrollView style={Common.container}>
        <View style={styles.top}>
          <ImageBackground
            style={styles.itemBox}
            source={require("../Resources/images/chargelogbg.png")}
          >
            <View style={styles.nav}>
              <TouchableOpacity
                onPress={() => {
                  Actions.pop();
                }}
              >
                <Image
                  style={styles.back}
                  source={require("../Resources/images/back1.png")}
                />
              </TouchableOpacity>
              <Text style={styles.titleM}>发布购买</Text>
              <Text style={styles.titleR} />
            </View>
            <Text style={styles.mdsNum}>
              买单余量：
              {new BigNumber(this.props.mdsNum).toFormat()} BGAA
            </Text>
          </ImageBackground>
          <View style={Common.fromBox}>
            <View style={Common.itemBox}>
              <Text style={styles.txtRight}>BGAA</Text>
              <TextInput
                keyboardType="numeric"
                underlineColorAndroid="transparent"
                style={[Common.inputStyle, { paddingRight: Fit(80) }]}
                ref="quantity"
                onChangeText={quantity => {
                  validate(this, {
                    value: quantity,
                    name: "quantity"
                  });
                }}
                placeholder="请输入购买数量"
              />
              <Text style={[Common.errMsg]}>
                {getErrorsInField("quantity")}
              </Text>
            </View>
            <Text style={styles.txtye}>
              可用积分：
              {new BigNumber(this.state.accounts.rmb).toFormat()}
            </Text>
            <View style={Common.buttonOuter}>
              <TouchableOpacity
                underlayColor="#18a304"
                onPress={() => {
                  const verData = submit(this);
                  if (verData) {
                    this._Buybgaa();
                  }
                }}
                style={Common.buttonStyle}
              >
                <Text style={Common.buttonTextStyle}>发布</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  mdsNum: {
    marginTop: isIphoneX() ? Fit(30) : Fit(50),
    fontSize: Fit(30),
    color: "#fff",
    textAlign: "center"
  },
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
  txtRight: {
    position: "absolute",
    top: Fit(38),
    right: 0,
    fontSize: Fit(26),
    color: "#9B9B9B"
  },
  txtye: {
    textAlign: "right",
    fontSize: Fit(22),
    color: "#41C01E",
    marginTop: Fit(10)
  },
  buttonOuter: {
    marginTop: Fit(20)
  }
});
module.exports = Buybgaa;
