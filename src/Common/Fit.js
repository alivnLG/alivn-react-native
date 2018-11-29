// Fit.js
import { Dimensions, Platform, PixelRatio, NativeModules } from "react-native";
const { StatusBarManager } = NativeModules;
//适配
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const Fit = size => {
  if (PixelRatio.get() >= 3 && Platform.Os === "ios" && size === 1) {
    return size;
  }
  return (deviceWidth / 750) * size;
};
//获取状态栏高度
//判断是否为iphoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;
const STATUSBAR_HEIGHT = 0;
const isIphoneX = function isIphoneX() {
  return (
    Platform.OS === "ios" &&
    ((deviceHeight === X_HEIGHT && deviceWidth === X_WIDTH) ||
      (deviceHeight === X_WIDTH && deviceWidth === X_HEIGHT))
  );
};
if (isIphoneX()) {
  STATUSBAR_HEIGHT = 44;
} else if (Platform.OS === "ios") {
  STATUSBAR_HEIGHT = 20;
} else {
  STATUSBAR_HEIGHT = StatusBarManager.HEIGHT;
}
export { Fit, STATUSBAR_HEIGHT, deviceWidth, deviceHeight, isIphoneX };
