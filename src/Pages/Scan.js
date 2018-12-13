import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Platform
} from "react-native";
import Camera from "react-native-camera";
import { Actions } from "react-native-router-flux";
import Nav from "../Component/Nav";
export default class ScanCameraPage extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.state = {
      moveAnim: new Animated.Value(0),
      camera: {
        aspect: Camera.constants.Aspect.fill,
        flashMode: Camera.constants.FlashMode.auto
      }
    };
    this.isBarcodeReceived = true;
  }

  componentDidMount() {
    this.startAnimation();
  }

  render() {
    return (
      <View style={styles.container}>
        <Nav title="扫描" leftType="icon" />
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={this.state.camera.aspect}
          flashMode={this.state.camera.flashMode}
          onBarCodeRead={this.barcodeReceived.bind(this)}
          barCodeTypes={[Camera.constants.BarCodeType.qr]}
        >
          <View style={styles.scanTopMask} />
          <View style={styles.scanOuter}>
            <View style={styles.scanLeftMask} />
            <View style={styles.scanInner}>
              <View style={styles.rectangle}>
                <Animated.View
                  style={[
                    styles.animatiedStyle,
                    { transform: [{ translateY: this.state.moveAnim }] }
                  ]}
                  animation={this.state.animation}
                />
              </View>
            </View>
            <View style={styles.scanRightMask} />
          </View>
          <View style={styles.scanBottomMask}>
            <Text style={styles.textStyle}>将二维码放入框内,即可自动扫描</Text>
          </View>
        </Camera>
      </View>
    );
  }

  startAnimation() {
    this.state.moveAnim.setValue(0);
    Animated.timing(this.state.moveAnim, {
      toValue: 200,
      duration: 4000,
      easing: Easing.linear
    }).start(() => this.startAnimation());
  }

  barcodeReceived(e) {
    if (this.isBarcodeReceived) {
      this.isBarcodeReceived = false;
      Actions.pop({ refresh: { scanData: e.data } });
      console.log("Type: " + e.type + "\nData: " + e.data);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  },
  preview: {
    flex: 1,
    position: "relative"
  },
  scanTopMask: {
    height: (SCREEN_HEIGHT - Fit(450)) / 2, //上半区域背景高度
    width: SCREEN_WIDTH, //上半区域背景宽度
    backgroundColor: "rgba(0,0,0,0.5)" ////上半区域背景
  },
  scanBottomMask: {
    position: "relative",
    height: (SCREEN_HEIGHT - Fit(450)) / 2, //下半区域背景高度
    width: SCREEN_WIDTH, ////下半区域背景宽度
    backgroundColor: "rgba(0,0,0,0.5)" ////下半区域背景
  },
  scanOuter: {
    height: Fit(400),
    flexDirection: "row"
  },
  scanLeftMask: {
    width: (SCREEN_WIDTH - Fit(400)) / 2,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  scanRightMask: {
    width: (SCREEN_WIDTH - Fit(400)) / 2,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  rectangle: {
    height: Fit(400),
    width: Fit(400),
    backgroundColor: "transparent"
  },
  animatiedStyle: {
    height: 2,
    backgroundColor: "#00FF00"
  },
  textStyle: {
    position: "absolute",
    left: (SCREEN_WIDTH - Fit(400)) / 2,
    width: Fit(400),
    color: "#fff",
    textAlign: "center",
    marginTop: Fit(10),
    fontWeight: "bold",
    fontSize: Fit(24)
  }
});
