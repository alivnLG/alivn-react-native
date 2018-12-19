import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  ImageBackground
} from "react-native";
import Common from "../styles/Common";
import QRCode from "react-native-qrcode";
import Nav from "../Component/Nav";

class MyCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitation: ""
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", payload => {
      this._getInfo();
    });
  }

  _getInfo() {
    Axios.get("/users/invitation").then(res => {
      this.setState({ invitation: res.data.invitation });
    });
  }

  copy() {
    Clipboard.setString(this.state.invitation);
    Alert.alert({
      icon: "success",
      msg: "复制成功"
    });
  }

  render() {
    return (
      <View style={Common.container}>
        <Nav leftType="icon" title="我的推广码" />
        <View style={styles.content}>
          <Text style={styles.invitation}>{this.state.invitation}</Text>
          <ImageBackground
            style={styles.QRCode}
            source={require("../Resources/images/speedqr.png")}
          >
            <Text style={{ fontSize: Fit(30), marginBottom: Fit(30) }}>
              面对面扫一扫
            </Text>
            <QRCode
              value={this.state.invitation}
              size={Fit(240)}
              bgColor="#000"
              fgColor="white"
            />
            <View style={styles.QRButtonBox}>
              <TouchableOpacity
                style={[styles.QRButton]}
                onPress={this.copy.bind(this)}
              >
                <Text style={{ fontSize: Fit(26), color: "#f60" }}>
                  复制推广码
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    margin: Fit(20),
    backgroundColor: "#fff",
    paddingBottom: Fit(60),
    borderRadius: Fit(8)
  },
  title: {
    textAlign: "center",
    height: Fit(80),
    lineHeight: Fit(80),
    color: "#333",
    fontSize: Fit(35),
    marginLeft: Fit(20),
    marginRight: Fit(20),
    borderBottomWidth: Fit(1),
    borderColor: "#DFDFDF",
    borderStyle: "dotted"
  },
  invitation: {
    marginTop: Fit(40),
    color: "#39BD1C",
    textAlign: "center",
    fontSize: Fit(34)
  },
  QRCode: {
    width: Fit(642),
    height: Fit(449),
    marginTop: Fit(40),
    marginLeft: Fit(44),
    alignItems: "center"
  },
  QRButtonBox: {
    marginTop: Fit(79),
    flexDirection: "row"
  },
  QRButton: {
    height: Fit(56),
    width: Fit(194),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: Fit(28),
    elevation: Fit(4),
    shadowColor: "#B6B8B5",
    shadowOpacity: 0.5,
    shadowRadius: Fit(4)
  }
});

module.exports = MyCode;
