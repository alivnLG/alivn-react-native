/**
 * Created by Rabbit 下午6:40
 */

import React from "react";
import { Text, View, Image } from "react-native";

const TabIcon = props => {
  // console.log(props);
  return (
    <View>
      <Image
        source={!props.focused ? props.image : props.selectedImage}
        style={[
          {
            height: Fit(27),
            width: Fit(27),
            marginTop: 5,
            tintColor: props.tintColor
          }
        ]}
      />
      <Text
        style={{
          paddingLeft: Fit(5),
          color: props.tintColor,
          marginTop: Fit(6),
          fontSize: Fit(10)
        }}
      >
        {props.title}
      </Text>
    </View>
  );
};

export default TabIcon;
