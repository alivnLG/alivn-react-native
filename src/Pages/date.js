import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions
} from "react-native";

import Picker from "react-native-picker";

export default class PickerTest extends Component {
  constructor(props, context) {
    super(props, context);
  }
  
  _showTimePicker() {
    let years = [],
      months = [],
      days = [],
      hours = [],
      minutes = [];
    seconds = [];
    for (let i = 1; i < 51; i++) {
      years.push(i + 1980);
    }
    for (let i = 1; i < 13; i++) {
      months.push(i < 10 ? "0" + i : i);
    }
    for (let i = 1; i < 32; i++) {
      days.push(i < 10 ? "0" + i : i);
    }
    for (let i = 0; i < 24; i++) {
      hours.push(i < 10 ? "0" + i : i);
    }
    for (let i = 0; i < 60; i++) {
      minutes.push(i < 10 ? "0" + i : i);
    }
    for (let i = 0; i < 60; i++) {
      seconds.push(i < 10 ? "0" + i : i);
    }
    let pickerData = [years, months, days, hours, minutes, seconds];
    let date = new Date();
    let selectedValue = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ];
    Picker.init({
      pickerData,
      selectedValue,
      pickerConfirmBtnText: "确定",
      pickerCancelBtnText: "取消",
      pickerTitleText: "选择时间",
      wheelFlex: [2, 1, 1, 2, 1, 1],
      onPickerConfirm: pickedValue => {
        console.log("area", pickedValue);
      }
    });
    Picker.show();
  }

  _toggle() {
    Picker.toggle();
  }

  _isPickerShow() {
    Picker.isPickerShow(status => {
      alert(status);
    });
  }

  render() {
    return (
      <View
        style={{ height: Dimensions.get("window").height, marginTop: Fit(100) }}
      >
        <TouchableOpacity
          style={{ marginTop: 10, marginLeft: 20 }}
          onPress={this._showTimePicker.bind(this)}
        >
          <Text>TimePicker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 10, marginLeft: 20 }}
          onPress={this._toggle.bind(this)}
        >
          <Text>toggle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 10, marginLeft: 20 }}
          onPress={this._isPickerShow.bind(this)}
        >
          <Text>isPickerShow</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="test picker with input"
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 10,
            padding: 5
          }}
        />
      </View>
    );
  }
}
