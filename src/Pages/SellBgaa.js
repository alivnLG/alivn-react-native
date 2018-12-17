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
import { Actions } from "react-native-router-flux";
import { validate, submit, getErrorsInField } from "../Common/validate";
import Common from "../styles/Common";
import BigNumber from "bignumber.js";

class Sellbgaa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: {},
      configs: {},
      quantity: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentDidMount() {
    this._getAccounts();
    this._getconfigs();
  }

  _getAccounts() {
    Axios.get("/accounts").then(res => {
      this.setState({ accounts: res.data[0] });
    });
  }

  _getconfigs() {
    Axios.get("/configs").then(res => {
      this.setState({ configs: res.data });
    });
  }

  _Sellbgaa() {
    Axios.post("/cabinets/" + this.props.id + "/asks", {
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
              <Text style={styles.titleM}>出售BGAA</Text>
              <Text style={styles.titleR} />
            </View>

            <Text style={styles.mdsNum}>
              可出售量：
              {new BigNumber(this.props.zssNum).toFormat()} BGAA
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
                placeholder="请输入出售数量"
              />
              <Text style={[Common.errMsg]}>
                {getErrorsInField("quantity")}
              </Text>
            </View>
            <Text style={styles.txtfee}>
              出售手续费
              {this.state.configs.orderRate * 100}%
            </Text>
            <Text style={styles.txtye}>
              可用BGAA：
              {new BigNumber(this.state.accounts.available).toFormat()}
            </Text>
            <View style={Common.buttonOuter}>
              <TouchableOpacity
                underlayColor="#18a304"
                onPress={() => {
                  const verData = submit(this);
                  if (verData) {
                    this._Sellbgaa();
                  }
                }}
                style={Common.buttonStyle}
              >
                <Text style={Common.buttonTextStyle}>出售</Text>
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
  txtfee: {
    textAlign: "right",
    fontSize: Fit(22),
    color: "#FF6600",
    marginTop: Fit(10)
  },
  txtye: {
    textAlign: "right",
    fontSize: Fit(22),
    color: "#41C01E",
    marginTop: Fit(10)
  },
  buttonOuter: {
    marginTop: Fit(20)
  },
  notice: {
    marginLeft: Fit(20),
    marginRight: Fit(20),
    paddingTop: Fit(25),
    paddingRight: Fit(25),
    paddingLeft: Fit(25),
    paddingBottom: Fit(50)
  },
  txt: {
    fontSize: Fit(26),
    color: "#9b9b9b",
    marginTop: Fit(8)
  }
});
module.exports = Sellbgaa;
