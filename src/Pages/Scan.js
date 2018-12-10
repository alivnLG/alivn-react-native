"use strict";
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  InteractionManager,
  Image,
  Text,
  Platform,
  Vibration,
  ImageBackground
} from "react-native";
import Camera from "react-native-camera";
import { Actions } from "react-native-router-flux";
export default class ScanCameraPage extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.state = {
      show: true,
      anim: "",
      camera: {
        aspect: Camera.constants.Aspect.fill
      }
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.startAnimation();
    });
  }

  componentWillUnmount() {
    this.state.show = false;
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={this.state.camera.aspect}
          onBarCodeRead={this.barcodeReceived.bind(this)}
          barCodeTypes={[Camera.constants.BarCodeType.qr]}
        >
          <View
            style={{
              height:
                Platform.OS == "ios"
                  ? (SCREEN_HEIGHT - 264) / 3
                  : (SCREEN_HEIGHT - 244) / 3,
              width: SCREEN_WIDTH,
              backgroundColor: "rgba(0,0,0,0.5)"
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <View style={styles.itemStyle} />
            <View style={styles.rectangle}>
              <View style={[styles.animatiedStyle]} />
            </View>
            <View style={styles.itemStyle} />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              width: SCREEN_WIDTH,
              alignItems: "center"
            }}
          >
            <Text style={styles.textStyle}>将二维码放入框内,即可自动扫描</Text>
          </View>
        </Camera>
      </View>
    );
  }

  startAnimation() {
    if (this.state.show) {
      //   this.state.anim.setValue(0);
      this.setState({
        anim: 0
      });
    }
  }

  barcodeReceived(e) {
    Toast.show("Type: " + e.type + "\nData: " + e.data);
    this.props.navigation.goBack();
    //console.log(e)
  }
}

const styles = StyleSheet.create({
  itemStyle: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: (SCREEN_WIDTH - 200) / 2,
    height: 200
  },
  textStyle: {
    color: "#fff",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 18
  },
  navTitleStyle: {
    color: "white",
    fontWeight: "bold"
  },
  navBarStyle: {
    // 导航条样式
    height: Platform.OS == "ios" ? 64 : 44,
    backgroundColor: "rgba(34,110,184,1.0)",
    // 设置主轴的方向
    flexDirection: "row",
    // 垂直居中 ---> 设置侧轴的对齐方式
    alignItems: "center",
    justifyContent: "center"
  },

  leftViewStyle: {
    // 绝对定位
    // 设置主轴的方向
    flexDirection: "row",
    position: "absolute",
    left: 10,
    bottom: Platform.OS == "ios" ? 15 : 12,
    alignItems: "center",
    width: 30
  },
  animatiedStyle: {
    height: 2,
    backgroundColor: "#00FF00"
  },
  container: {
    flex: 1
  },
  preview: {
    flex: 1
  },
  rectangle: {
    height: 200,
    width: 200
  }
});
