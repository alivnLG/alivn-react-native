import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Actions } from "react-native-router-flux";
class Trade extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={[styles.container, { backgroundColor: "#f5f5f5" }]}>
        <Text>交易</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    position: "relative",
    flex: 1
  }
});
module.exports = Trade;
