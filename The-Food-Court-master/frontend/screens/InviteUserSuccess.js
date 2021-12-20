import React from "react";
import { Button } from "react-native-paper";
import {
  Text,
  StatusBar,
  Dimensions,
} from "react-native";

const InviteUserSuccess = (props) => {
  const userData = props.route.params.inviter_user
  return (
    <>
        <StatusBar backgroundColor="#26C49E" barStyle="light-content" />

        <Text
          style={{
            fontSize: 22,
            textAlign:"center",
            marginTop: 65,
            color: "black",
          }}
        >
          Invitation email sent!
        </Text>

        <Button
          mode="contained"
          style={{
            marginTop: 20,
            marginLeft: 120,
            marginRight: 120,
            borderRadius: 10,
            backgroundColor: "#26C49E"
          }}
          onPress={() => {
            props.navigation.navigate("userprofile", {userData});
          }}
        >
          back
        </Button>
    </>
  );
};

export default InviteUserSuccess;
