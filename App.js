import React, { Component } from "react";
import { Platform, StyleSheet, Text, StatusBar, View } from "react-native";
import Router from "./src/Router";

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0,0,0,0)"
          barStyle="dark-content"
        />
        <Alert />
        <Confirm />
        <Router />
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
