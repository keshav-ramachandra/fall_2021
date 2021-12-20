import React from "react";
import { IconButton } from "react-native-paper";
import {
  Text,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";

const GroupFoodieEnd = (props) => {

  const type = props.route.params.match.type
  const tag = props.route.params.match.tag
  console.log(type, tag);

  return (
    <SafeAreaView>
        <StatusBar backgroundColor="#26C49E" barStyle="light-content" />
        <IconButton
        icon="arrow-left"
        color="#26C49E"
        size={20}
        onPress={() => {
          props.navigation.replace("home");
        }}
        />
        {tag.length > 0 &&
        <Text
          style={{
            fontSize: 22,
            textAlign:"center",
            marginTop: 65,
            marginHorizontal: 35,
            color: "black",
          }}
        >
          You have a {type} match: {tag}
        </Text>
        }
        {tag.length == 0 &&
        <Text
        style={{
          fontSize: 22,
          textAlign:"center",
          marginTop: 65,
          marginHorizontal: 35,
          color: "black",
        }}
      >
        Y'all are too picky and have {type} matches.
      </Text>
        }
    </SafeAreaView>
  );
};

export default GroupFoodieEnd;
