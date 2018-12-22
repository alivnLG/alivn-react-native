import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Fit } from "./Fit";
import * as Animatable from "react-native-animatable";
import codePush from "react-native-code-push";
let self = null;
class Update extends Component {
  constructor(props) {
    super(props);
  }
  //检查更新
  static _checkupDate() {
    codePush.checkForUpdate().then(update => {
      if (!update) {
        Alert.alert({
          icon: "success",
          msg: "APP已是最新版本"
        });
      } else {
        if (update.description == "expired") {
          Confirm.confirm({
            info: "fail",
            msg: "您的应用版本已更新,请前往应用商店下载新的版本",
            okTxt: "前往下载",
            onOk: () => {
              Linking.openURL("https://top.bgaa.vip");
            }
          });
        } else {
          codePush.sync(
            {},
            status => {
              switch (status) {
                case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                  console.log("DOWNLOADING_PACKAGE");
                  break;
                case codePush.SyncStatus.INSTALLING_UPDATE:
                  console.log(" INSTALLING_UPDATE");
                  break;
              }
            },
            progress => {
              console.log(
                progress.receivedBytes +
                  " of " +
                  progress.totalBytes +
                  " received."
              );
            }
          );
        }
      }
    });
  }
}
module.exports = Update;
