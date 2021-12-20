import React, { useState } from "react";
import { Button, TextInput, IconButton, Snackbar } from "react-native-paper";
import {
  View,
  CheckBox,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { isValidEmail, updateError } from "../utils/Validation";
import axios from 'axios';
import { server } from "../utils/server";
import { cos } from "react-native-reanimated";
import InviteUserSuccess from "./InviteUserSuccess";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const InviteUser = (props) => {
  
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const inviter_user = props.route.params.userData

  const [visible, setVisible] = React.useState(false);

  function onToggleSnackBar () {
    setVisible(!visible)
    setTimeout(function() {
      props.navigation.navigate('userprofile')
    }, 1000)
  }

  const onDismissSnackBar = () => setVisible(false);

  const isValidForm = () => {
    if (!isValidEmail(email)) return updateError("Enter a valid email", setError);

    return true;
  };
  const userData = props.route.params.userData
  const sendCred = async (props) => {
    const iemail = await AsyncStorage.getItem('email')
    console.log(inviter_user, email)
    if (isValidForm()) {
        const User = {
          inviter : iemail,
          invitee : email
        }
      try {
      axios.post(server + 'auth/invite_user', JSON.stringify(User))
      .then(res => {
        console.log(res)
        // return updateError("Invitation Sent!", setError);
        // props.navigation.navigate("inviteusersuccess", {inviter_user});
        setEmail('')
        setVisible(visible ? 'Hide' : 'Show')
        onToggleSnackBar()
      })
      .catch(err=>{
        console.log(err);
        return updateError("User is already registered!", setError);
      })
      
      }catch (err) {
        console.log(err);
        return updateError("User is already registered!", setError);
      }
    }
  };

  return (
    <SafeAreaView style={{ margin:16, flex: 1 }}>
      <KeyboardAvoidingView behavior="position">
        <StatusBar backgroundColor="#26C49E" barStyle="light-content" />
        <IconButton
        icon="arrow-left"
        color="#26C49E"
        size={20}
        onPress={() => {
          props.navigation.navigate("userprofile", {inviter_user});
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
          Invite User
        </Text>

        <Text
          style={{
            fontSize: 15,
            marginLeft: 10,
            marginTop: 65,
            color: "black",
          }}
        >
        Please enter the email address of the user you want to invite:
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
          invite
        </Button>
      </KeyboardAvoidingView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={1000}
        >
        Invite Sent!
      </Snackbar>
    </SafeAreaView>
  );
};

export default InviteUser;
