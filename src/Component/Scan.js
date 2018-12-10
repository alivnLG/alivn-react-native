import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import Camera from "react-native-camera";
class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      code: ""
    };
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
    }
  }
  onBarCodeRead(e) {
    if (e.data !== this.code) {
      this.setState({ open: false, code: e.data });
      //当条形码变化时保存当前条形码，并关闭扫码
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.open ? (
          <Camera
            ref={cam => {
              this.camera = cam;
            }}
            onBarCodeRead={e => this.onBarCodeRead(e)}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}
          />
        ) : (
          <View>
            <TouchableOpacity onPress={() => this.setState({ open: true })}>
              <Text>扫一扫</Text>
            </TouchableOpacity>
            <Text>结果：{this.state.code}</Text>
          </View>
        )}
      </View>
    );
  }
}

module.exports = Scan;
