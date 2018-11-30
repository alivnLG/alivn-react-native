import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity
} from "react-native";
class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      msg: this.props.msg
    };
  }
 
  render() {
    return (
      <View style={styles.mask}>
        <View style={styles.alertView}>
          <Text style={styles.alertMsg}>{this.state.msg}</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mask: {
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  alertView: {
    width: 300,
    height: 300,
    backgroundColor: "#000",
    borderRadius: 4,
    opacity:0.4,
    zIndex: 10
  },
  alertMsg:{
      color:"#fff"
  }
});
module.exports = Modal;
