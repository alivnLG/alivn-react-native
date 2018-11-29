// Fit.js
import React, { Component } from "react";
import { Dimensions, Platform, PixelRatio } from "react-native";
debugger
const deviceWidth = Dimensions.get('window').width;
debugger
const Fit = size => {
  if (PixelRatio.get() >= 3 && Platform.Os === "ios" && size === 1) {
    return size;
  }
  return (deviceWidth / 750) * size;
};
module.exports = Fit;
