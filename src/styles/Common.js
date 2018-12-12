import { StyleSheet } from "react-native";
export default (Common = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    position: "relative",
    flex: 1
  },
  statusbar: {
    paddingTop: STATUSBAR_HEIGHT
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: "#fff",
    borderBottomColor:"#f2f2f2",
    borderBottomWidth:1
  },
  title: {
    textAlign: "center",
    fontSize: Fit(32)
  },
  leftButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: Fit(200),
    paddingLeft: Fit(30),
    height: Fit(64)
  },
  rightButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: Fit(200),
    paddingRight: Fit(30),
    height: Fit(64)
  },
  rightIcon: {
    height: Fit(44),
    width: Fit(44)
  },
  rightTxt: {
    alignItems: "center",
    fontSize: Fit(30)
  },
  leftIcon: {
    height: Fit(44),
    width: Fit(44)
  },
  inputStyle: {
    height: Fit(80),
    fontSize: Fit(30),
    color: "#474747",
    borderBottomWidth: Fit(2),
    borderBottomColor: "#EDEDED",
    marginTop: Fit(15)
  },
  errMsg: {
    marginTop: Fit(4),
    fontSize: Fit(22),
    color: "#f00"
  },
  fromBox: {
    paddingLeft: Fit(32),
    paddingRight: Fit(32)
  },
  flexContent: {
    justifyContent: "center",
    alignItems: "flex-end"
  },
  rightText: {
    fontSize: Fit(26),
    color: "#9B9B9B",
    marginTop: Fit(10)
  },
  sendCode: {
    position: "absolute",
    right: 0,
    top: Fit(28),
    height: Fit(58),
    width: Fit(188),
    backgroundColor: "#EFFFEB",
    borderRadius: Fit(58),
    lineHeight: Fit(58),
    textAlign: "center",
    fontSize: Fit(28),
    color: "#41C01D",
    zIndex: Fit(2)
  },
  itemBox: {
    position: "relative"
  },
  eye: {
    position: "absolute",
    right: 0,
    top: Fit(25),
    width: Fit(60),
    height: Fit(60),
    zIndex: Fit(2)
  },
  eyeImg: {
    width: Fit(60),
    height: Fit(60)
  },
  buttonDisable: { backgroundColor: "#d5d7d9" },
  buttonStyle: {
    marginTop: Fit(40),
    marginBottom: Fit(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#30B91B",
    height: Fit(82),
    borderRadius: Fit(80)
  },
  buttonTextStyle: {
    color: "#fff",
    fontSize: Fit(30),
    letterSpacing: Fit(10)
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  }
}));
