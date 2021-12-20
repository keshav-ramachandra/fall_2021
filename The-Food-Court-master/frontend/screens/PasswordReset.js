import React, { useState } from "react";
import { Button, TextInput, IconButton } from "react-native-paper";
import {
  View,
  CheckBox,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { isValidEmail, updateError } from "../utils/Validation";
import axios from 'axios';
import { server } from "../utils/server";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PasswordReset = (props) => {
  
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const isValidForm = () => {
    if (!isValidEmail(email)) return updateError("Enter a valid email", setError);
    return true;
  };

  const sendCred = async (props) => {
    const User = {
      email : email
    }

    if (isValidForm()) {
      try {
      //JSON encoded while passing body and handled in backEnd
      axios.post(server + 'auth/password_reset', JSON.stringify(User))
      .then(res => {
          props.navigation.navigate("changepassword", {User});
      })
      .catch(err=>{
        console.log(err);
        return updateError("No such user exists!", setError);
      })
      
      }catch (err) {
        console.log(err);
        return updateError("Not a registered account!", setError);
      }
    }
  };

  return (
    <>
      <KeyboardAvoidingView behavior="position">
        <StatusBar backgroundColor="#26C49E" barStyle="light-content" />
        <IconButton
          icon="arrow-left"
          color="#26C49E"
          size={20}
          onPress={() => {
            props.navigation.navigate("login");
          }}
        />

        <Text
          style={{
            fontSize: 22,
            textAlign:"center",
            marginTop: 65,
            color: "black",
          }}
        >
          Password Reset
        </Text>

        <Text
          style={{
            fontSize: 15,
            marginLeft: 10,
            marginTop: 65,
            color: "black",
          }}
        >
        Please enter your email address
        </Text>

        {error ? (
          <Text
            style={{
              color: "red",
              fontSize: 14,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        ) : null}
        
        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          style={{ marginLeft: 18, height: 40, marginRight: 18, marginTop: 38 }}
          theme={{ colors: { primary: "#26C49E" } }}
          onChangeText={(text) => setEmail(text)}
        />

        <Button
          mode="contained"
          style={{
            marginTop: 20,
            marginLeft: 120,
            marginRight: 120,
            borderRadius: 10,
            backgroundColor: "#26C49E"
          }}
          onPress={() => sendCred(props)}
        >
          send email
        </Button>
      </KeyboardAvoidingView>
    </>
  );
};

export default PasswordReset;
