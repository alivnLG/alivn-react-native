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
    txt: <Text style={styles.lTxt}>{this.props.leftTxt}</Text>,
    icon: <Image style={Common.leftIcon} source={this.props.leftIcon} />
  };
  rightType = {
    txt: <Text style={styles.rTxt}>{this.props.rightTxt}</Text>,
    icon: <Image style={Common.rightIcon} source={this.props.rightIcon} />
  };
  render() {
    return (
      <View style={Common.navBar}>
        <TouchableOpacity style={Common.leftButton}>
          {this.leftType[this.props.leftType]}
        </TouchableOpacity>
        <Text style={Common.title}>{this.props.title}</Text>
        <TouchableOpacity style={Common.rightButton}>
          {this.rightType[this.props.rightType]}
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({});
module.exports = Nav;
