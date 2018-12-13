import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import { Actions } from "react-native-router-flux";
import Common from "../styles/Common";
class Nav extends Component {
  constructor(props) {
    super(props);
  }
  leftType = {
    txt: (
      <Text style={[styles.lTxt, { color: this.props.leftTxtColor }]}>
        {this.props.leftTxt}
      </Text>
    ),
    icon: <Image style={Common.leftIcon} source={this.props.leftIcon?this.props.leftIcon:require("../Resources/images/back.png")} />
  };
  rightType = {
    txt: (
      <Text style={[styles.rTxt, { color: this.props.rightTxtColor }]}>
        {this.props.rightTxt}
      </Text>
    ),
    icon: <Image style={Common.rightIcon} source={this.props.rightIcon} />
  };
  render() {
    return (
      <View style={Common.navBar}>
        <TouchableOpacity
          style={Common.leftButton}
          onPress={() => {
            this.props.onLeft ? this.props.onLeft() : Actions.pop();
          }}
        >
          {this.leftType[this.props.leftType]}
        </TouchableOpacity>
        <Text style={[Common.title, { color: this.props.titleColor }]}>
          {this.props.title}
        </Text>
        <TouchableOpacity
          style={Common.rightButton}
          onPress={() => {
            this.props.onRight ? this.props.onRight() : Actions.pop();
          }}
        >
          {this.rightType[this.props.rightType]}
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({});
module.exports = Nav;
