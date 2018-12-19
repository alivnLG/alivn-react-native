import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  WebView
} from "react-native";
import Common from "../styles/Common";
import Nav from "../Component/Nav";

const BaseScript = `
    (function () {
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
              window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setTimeout(changeHeight, 300);
    } ())
    `;
const DEFAULT_PROPS = {};

class Noticeifo extends Component {
  constructor(props) {
    super(props);
    this.state = { info: {}, notice: "", height: 0, width: 0 };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", payload => {
      this._getNoticeInfo();
    });
  }

  _getNoticeInfo() {
    Axios.get("/notices/" + this.props.id).then(res => {
      this.setState({
        info: res.data,
        notice: res.data.content
      });
    });
  }
  onMessage(event) {
    try {
      const action = JSON.parse(event.nativeEvent.data);
      if (action.type === "setHeight" && action.height > 0) {
        this.setState({ height: action.height });
      }
    } catch (error) {
      // pass
    }
  }

  render() {
    return (
      <View style={Common.container}>
        <Nav leftType="icon" title="公告详情" />
        <ScrollView>
          <View style={styles.noticecon}>
            <WebView
              injectedJavaScript={BaseScript}
              style={{
                width: Dimensions.get("window").width,
                height: this.state.height
              }}
              source={{ uri: "http://www.bgaa.vip/appnew?id=" + this.props.id }}
              automaticallyAdjustContentInsets
              decelerationRate="normal"
              scalesPageToFit
              javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
              domStorageEnabled // 适用于安卓
              scrollEnabled={false}
              onMessage={this.onMessage.bind(this)}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({});
module.exports = Noticeifo;
