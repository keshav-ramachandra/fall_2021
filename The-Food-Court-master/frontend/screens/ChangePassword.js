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
} from "react-native";
import { isValidEmail, updateError } from "../utils/Validation";
import axios from 'axios';
import { server } from "../utils/server";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ChangePassword = (props) => {
  
    const [passcode, setPasscode] = useState("");

    const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [visible, setVisible] = React.useState(false);

  function onToggleSnackBar () {
    setVisible(!visible)
    setTimeout(function() {
      props.navigation.navigate('login')
    }, 1000)
  }

  const onDismissSnackBar = () => setVisible(false);

  const isValidForm = () => {
    if (!password.trim() || password.length < 8)
      return updateError("Password is less then 8 characters!", setError);
    if (password !== confirmPassword)
      return updateError("Password does not match!", setError);
    if (!passcode.trim()) return updateError("Passcode can't be empty", setError);
    return true;
  };

  const sendCred = async (props) => {
    const email = props.route.params.User.email
    const User = {
        passcode: passcode,
        email: email,
        password : password
      }
      
    if (isValidForm()) {
        try {
            //JSON encoded while passing body and handled in backEnd
            axios.post(server + `auth/change_password`, JSON.stringify(User))
            .then(res => {
              // props.navigation.navigate("changepasswordsuccess");
              setVisible(visible ? 'Hide' : 'Show')
              onToggleSnackBar()
            }).catch(err=>{
              console.log(err);
              return updateError("An error has occured. Password reset unsuccessful", setError);
            })
            
            }catch (err) {
              console.log(err);
              return updateError("An error has occured. Password reset unsuccessful", setError);
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
            props.navigation.navigate("passwordreset");
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
        Change Password
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
        
        <Text
          style={{
            fontSize: 15,
            marginLeft: 10,
            marginTop: 65,
            color: "black",
          }}
        >
        Enter the passcode sent via email
        </Text>

        <TextInput
          label="Passcode"
          mode="outlined"      
          secureTextEntry={true}
          value={passcode}
          style={{ marginLeft: 18, height: 40, marginRight: 18, marginTop: 12 }}
          theme={{ colors: { primary: "#26C49E" } }}
          onChangeText={(text) => setPasscode(text)}
        />

        <Text
          style={{
            fontSize: 15,
            marginLeft: 10,
            marginTop: 65,
            color: "black",
          }}
        >
        Enter your new password
        </Text>

        <TextInput
          label="Password"
          mode="outlined"      
          secureTextEntry={true}
          value={password}
          style={{ marginLeft: 18, height: 40, marginRight: 18, marginTop: 12 }}
          theme={{ colors: { primary: "#26C49E" } }}
          onChangeText={(text) => setPassword(text)}
        />

        <Text
          style={{
            fontSize: 15,
            marginLeft: 10,
            marginTop: 15,
            color: "black",
          }}
        >
        Confirm your password
        </Text>

        <TextInput
          label="Password"
          mode="outlined"      
          secureTextEntry={true}
          value={confirmPassword}
          style={{ marginLeft: 18, height: 40, marginRight: 18, marginTop: 12 }}
          theme={{ colors: { primary: "#26C49E" } }}
          onChangeText={(text) => setConfirmPassword(text)}
          
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
          Reset
        </Button>
      </KeyboardAvoidingView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={1000}
        >
        Password Reset Successfully!
      </Snackbar>
    </>
  );
};

export default ChangePassword;
