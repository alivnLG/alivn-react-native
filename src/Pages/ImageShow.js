import React, { Component } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import Common from "../styles/Common";
import Nav from "../Component/Nav";
import Swiper from "react-native-deck-swiper";

class ImageShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        require("../Resources/images/itemImage1.jpg"),
        require("../Resources/images/itemImage2.jpg"),
        require("../Resources/images/itemImage3.jpg"),
        require("../Resources/images/itemImage4.jpg"),
        require("../Resources/images/itemImage5.jpg"),
        require("../Resources/images/itemImage6.jpg")
      ],
      swipedAllCards: false,
      swipeDirection: "",
      cardIndex: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", payload => {});
  }

  renderCard = (card, index) => {
    return (
      <View style={styles.card}>
        <Image style={styles.itemImage} source={card} />
      </View>
    );
  };

  onSwiped = type => {
    //拖拽类型
    console.log(`on swiped ${type}`);
  };

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true
    });
  };

  swipeLeft = () => {
    this.swiper.swipeLeft();
  };

  render() {
    return (
      <View style={[Common.container, { backgroundColor: "#f5f5f5" }]}>
        <Nav leftType="icon" title="图片浏览" />
        <Swiper
          ref={swiper => {
            this.swiper = swiper;
          }}
          onSwiped={() => this.onSwiped("general")}
          onSwipedLeft={() => this.onSwiped("left")}
          onSwipedRight={() => this.onSwiped("right")}
          onSwipedTop={() => this.onSwiped("top")}
          onSwipedBottom={() => this.onSwiped("bottom")}
          onTapCard={this.swipeLeft}
          cards={this.state.cards}
          cardIndex={this.state.cardIndex}
          cardVerticalMargin={Fit(80)}
          renderCard={this.renderCard}
          onSwipedAll={this.onSwipedAllCards}
          stackSize={Fit(3)}
          stackSeparation={Fit(15)}
          overlayLabels={{
            bottom: {
              title: "",
              style: {
                label: {
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }
              }
            },
            left: {
              title: "",
              style: {
                label: {
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: Fit(30),
                  marginLeft: -Fit(30)
                }
              }
            },
            right: {
              title: "",
              style: {
                label: {
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: Fit(30),
                  marginLeft: Fit(30)
                }
              }
            },
            top: {
              title: "",
              style: {
                label: {
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }
              }
            }
          }}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard
        >
          <TouchableOpacity
            style={styles.imageTab}
            onPress={() => this.swiper.swipeBack()}
          >
            <Image
              style={styles.loop}
              source={require("../Resources/images/loop.png")}
            />
          </TouchableOpacity>
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    height: SCREEN_HEIGHT - Fit(64) - Fit(110) - STATUSBAR_HEIGHT,
    borderRadius: Fit(4),
    borderWidth: Fit(2),
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white"
  },
  itemImage: {
    height: SCREEN_HEIGHT - Fit(64) - Fit(110) - STATUSBAR_HEIGHT
  },
  text: {
    textAlign: "center",
    fontSize: Fit(50),
    backgroundColor: "transparent"
  },
  done: {
    textAlign: "center",
    fontSize: Fit(30),
    color: "white",
    backgroundColor: "transparent"
  },
  imageTab: {
    position: "absolute",
    top: Fit(10),
    left: "50%",
    marginLeft: -Fit(30),
    width: Fit(60),
    height: Fit(60)
  },
  loop: {
    width: Fit(60),
    height: Fit(60)
  }
});
module.exports = ImageShow;
