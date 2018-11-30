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
            height: Fit(42),
            width: Fit(42)
          }
        ]}
      />
      <Text
        style={{
          color: props.tintColor,
          marginTop: Fit(6),
          fontSize: Fit(22),
          textAlign: "center"
        }}
      >
        {props.title}
      </Text>
    </View>
  );
};

export default TabIcon;
