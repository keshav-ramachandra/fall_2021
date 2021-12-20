import React from "react";
import { Button } from "react-native-paper";
import {
  Text,
  StatusBar,
  Dimensions,
} from "react-native";

const ChangePasswordSuccess = (props) => {

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
          Password Reset Successful!
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
            props.navigation.navigate("login");
          }}
        >
          login
        </Button>
    </>
  );
};

export default ChangePasswordSuccess;
