import React from "react";
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  StatusBar,
  DeviceEventEmitter
} from "react-native";

import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst,
  Overlay,
  Tabs,
  Modal,
  Drawer,
  Stack,
  Lightbox
} from "react-native-router-flux";
import { Theme } from "teaset";

import TabIcon from "./Component/TabIcon";

import Home from "./Pages/Home";
import Trade from "./Pages/Trade";
import Wallet from "./Pages/Wallet";
import My from "./Pages/My";

const reducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    return defaultReducer(state, action);
  };
};

const getSceneStyle = () => ({
  backgroundColor: Theme.backgroundColor
});
const onBackPress = () => {
  console.log(Actions.state);
  if (Actions.state.index !== 0) {
    return false;
  }
  Actions.pop();
  return true;
};

const router = (...props) => (
  <Router
    createReducer={reducerCreate}
    getSceneStyle={getSceneStyle}
    backAndroidHandler={onBackPress}
  >
    <Modal hideNavBar transitionConfig={() => ({})}>
      <Stack hideNavBar headerMode="screen" key="root">
        <Tabs
          key="tabbar" // 唯一标识
          wrap={true} // 自动使用自己的导航栏包装每个场景
          showLabel={false} // 显示文字
          tabBarStyle={styles.tabBarStyle} // tabBar的样式
          swipeEnabled={false} // 是否可以滑动
          headerMode="screen" // 页面切换方式
          icon={TabIcon} // 自定义Icon显示方式
          lazy={true} // 是否默认渲染tabbar
          tabBarPosition={"bottom"} // tabbar在顶部还是底部，iOS默认顶部，安卓默认顶部
          activeBackgroundColor="white" // 选中tabbar的背景色
          inactiveBackgroundColor="white" // 未选中tabbar的背景色
          activeTintColor="#4ECBFC" // 选中tabbar图标的颜色
          inactiveTintColor="#aaa" // 未选中tabbar图标的颜色
        >
          <Stack
            hideNavBar
            key="Home"
            title={"首页"}
            image={Images.Home}
            selectedImage={Images.aHome}
          >
            <Scene component={Home} key="home" />
          </Stack>
          <Stack
            hideNavBar
            key="Trade"
            title="交易"
            image={Images.Trade}
            selectedImage={Images.aTrade}
          >
            <Scene component={Trade} key="trade" />
          </Stack>
          <Stack
            hideNavBar
            key="钱包"
            title="我的"
            image={Images.Wallet}
            selectedImage={Images.aWallet}
          >
            <Scene component={Wallet} key="wallet" />
          </Stack>
          <Stack
            hideNavBar
            key="My"
            title="我的"
            image={Images.My}
            selectedImage={Images.aMy}
          >
            <Scene component={My} key="my" />
          </Stack>
        </Tabs>
        {/*// 推荐把需要的路由放在<Tabs/>后面，跳转的时候通过key，Actions.Test3_key*/}
      </Stack>
    </Modal>
  </Router>
);

export default router;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "#eee",
    height: 49
  }
});
