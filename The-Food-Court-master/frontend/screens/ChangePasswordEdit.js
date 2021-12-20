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
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ChangePasswordEdit = (props) => {
  
  const [passcode, setPasscode] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const errormsgs = []

  const user = props.route.params.userData

  const [visible, setVisible] = React.useState(false);

  function onToggleSnackBar () {
    setVisible(!visible)
    setTimeout(function() {
      props.navigation.navigate('userprofile')
    }, 1000)
  }

  const onDismissSnackBar = () => setVisible(false);

  const isValidForm = () => {
    if (!password.trim() || password.length < 8)
    errormsgs.push("New password is less then 8 characters!\n")
      // return updateError("New password is less then 8 characters!", setError);
    if (password !== confirmPassword)
    errormsgs.push("Password does not match!\n")
      // return updateError("Password does not match!", setError);
    if (!passcode.trim()) 
    errormsgs.push("Old password can't be empty\n")
    // return updateError("Old password can't be empty", setError);
    // return true;
    if (errormsgs.length == 0) return true;
    else return updateError(errormsgs, setError)
  };

  const sendCred = async (props) => {
    const email = await AsyncStorage.getItem('email')
    const User = {
        passcode: passcode,
        email: email,
        password : password
      }
      
    if (isValidForm()) {
        try {
            //JSON encoded while passing body and handled in backEnd
            axios.post(server + `auth/change_password_edit`, JSON.stringify(User))
            .then(res => {
              // props.navigation.navigate("changepasswordsuccess");
              setPasscode('')
              setPassword('')
              setConfirmPassword('')
              setVisible(visible ? 'Hide' : 'Show')
              onToggleSnackBar()
              // return updateError("Password change successful!", setError);
            }).catch(err=>{
              console.log(err);
              return updateError(err.response.data, setError);
            })
            
            }catch (err) {
              console.log(err);
              return updateError("An error has occured. Password change unsuccessful", setError);
            }
    
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView behavior="position">
        <StatusBar backgroundColor="#26C49E" barStyle="light-content" />
        <IconButton
          icon="arrow-left"
          color="#26C49E"
          size={20}
          onPress={() => {
            props.navigation.navigate("userprofile");
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
        Enter your old password
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
          Change
        </Button>
      </KeyboardAvoidingView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={1000}
        >
        Password Changed Successfully!
      </Snackbar>
    </SafeAreaView>
  );
};

export default ChangePasswordEdit;
