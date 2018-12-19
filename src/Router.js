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
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Scan from "./Pages/Scan";
import Forget from "./Pages/Forget";
import Lock from "./Pages/Lock";
import TransferEnter from "./Pages/TransferEnter";
import LockLog from "./Pages/LockLog";
import TransferBgaa from "./Pages/TransferBgaa";
import TransferBgaaLog from "./Pages/TransferBgaaLog";
import BgaaLog from "./Pages/BgaaLog";
import MySpeed from "./Pages/MySpeed";
import SpeedLog from "./Pages/SpeedLog";
import ChargeEth from "./Pages/ChargeEth";
import WithdrawEth from "./Pages/WithdrawEth";
import ChargeEthLog from "./Pages/ChargeEthLog";
import WithdrawEthLog from "./Pages/WithdrawEthLog";
import EthLog from "./Pages/EthLog";
import CapitalPwd from "./Pages/CapitalPwd";
import UpdateCapitalPwd from "./Pages/UpdateCapitalPwd";
import MyCode from "./Pages/MyCode";
import BuyBgaa from "./Pages/BuyBgaa";
import SellBgaa from "./Pages/SellBgaa";
import TradeBuyLog from "./Pages/TradeBuyLog";
import TradeSellLog from "./Pages/TradeSellLog";
import BuyWarrant from "./Pages/BuyWarrant";
import GetWarrant from "./Pages/GetWarrant";
import WarrantNotLog from "./Pages/WarrantNotLog";
import WarrantLog from "./Pages/WarrantLog";
import SellWarrant from "./Pages/SellWarrant";
import TransferWarrant from "./Pages/TransferWarrant";
import TradeWarrant from "./Pages/TradeWarrant";
import WithdrawInfo from "./Pages/WithdrawInfo";
import NoticeList from "./Pages/NoticeList";
import NoticeInfo from "./Pages/NoticeInfo";
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

const userinfo = Store.getItem("userinfo");
const router = (...props) => (
  <Router
    createReducer={reducerCreate}
    getSceneStyle={getSceneStyle}
    backAndroidHandler={onBackPress}
  >
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
        activeTintColor="#044236" // 选中tabbar图标的颜色
        inactiveTintColor="#7A7B7D" // 未选中tabbar图标的颜色
      >
        <Stack
          hideNavBar
          key="Home"
          title={"首页"}
          image={Images.Home}
          initial={!!userinfo}
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
          <Scene component={Trade} key="trade" hideNavBar />
          <Scene component={TradeWarrant} key="tradeWarrant" hideNavBar />
        </Stack>
        <Stack
          hideNavBar
          key="钱包"
          title="钱包"
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
      <Scene component={Login} initial={!userinfo} key="login" hideNavBar />
      <Scene component={Register} key="register" hideNavBar />
      <Scene component={Scan} key="scan" hideNavBar />
      <Scene component={Forget} key="forget" hideNavBar />
      <Scene component={Lock} key="lock" hideNavBar />
      <Scene component={LockLog} key="lockLog" hideNavBar />
      <Scene component={TransferEnter} key="transferEnter" hideNavBar />
      <Scene component={TransferBgaa} key="transferBgaa" hideNavBar />
      <Scene component={TransferBgaaLog} key="transferBgaaLog" hideNavBar />
      <Scene component={BgaaLog} key="bgaaLog" hideNavBar />
      <Scene component={MySpeed} key="mySpeed" hideNavBar />
      <Scene component={SpeedLog} key="speedLog" hideNavBar />
      <Scene component={ChargeEth} key="chargeEth" hideNavBar />
      <Scene component={WithdrawEth} key="withdrawEth" hideNavBar />
      <Scene component={ChargeEthLog} key="chargeEthLog" hideNavBar />
      <Scene component={WithdrawEthLog} key="withdrawEthLog" hideNavBar />
      <Scene component={EthLog} key="ethLog" hideNavBar />
      <Scene component={CapitalPwd} key="capitalPwd" hideNavBar />
      <Scene component={UpdateCapitalPwd} key="updateCapitalPwd" hideNavBar />
      <Scene component={MyCode} key="myCode" hideNavBar />
      <Scene component={BuyBgaa} key="buyBgaa" hideNavBar />
      <Scene component={SellBgaa} key="sellBgaa" hideNavBar />
      <Scene component={TradeBuyLog} key="tradeBuyLog" hideNavBar />
      <Scene component={TradeSellLog} key="tradeSellLog" hideNavBar />
      <Scene component={BuyWarrant} key="buyWarrant" hideNavBar />
      <Scene component={GetWarrant} key="getWarrant" hideNavBar />
      <Scene component={WarrantNotLog} key="warrantNotLog" hideNavBar />
      <Scene component={WarrantLog} key="warrantLog" hideNavBar />
      <Scene component={SellWarrant} key="sellWarrant" hideNavBar />
      <Scene component={TransferWarrant} key="transferWarrant" hideNavBar />
      <Scene component={TradeWarrant} key="tradeWarrant" hideNavBar />
      <Scene component={WithdrawInfo} key="withdrawInfo" hideNavBar />
      <Scene component={NoticeList} key="noticeList" hideNavBar />
      <Scene component={NoticeInfo} key="noticeInfo" hideNavBar />
    </Stack>
  </Router>
);
export default router;
const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "#eee",
    height: Fit(98)
  }
});
