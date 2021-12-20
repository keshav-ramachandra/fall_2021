import React, { useState,useEffect,useRef } from "react";
import {Button, TextInput } from "react-native-paper";
import axios from 'axios';
import {
  Button as Button_native,
  View,
  CheckBox,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet
} from "react-native";
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { server } from "../utils/server";
import { isValidEmail, updateError } from "../utils/Validation";
// import AsyncStorage from "@react-native-community/async-storage";
//import { AsyncStorage } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SignupScreen_3 = (props) => {

  const [error, setError] = useState("");

  const user_name = props.route.params.User.user_name;

  const password = props.route.params.User.password;

  const email = props.route.params.User.email;

  const firstname = props.route.params.User.first_name;

  const lastname = props.route.params.User.last_name;

  const mobileno = props.route.params.User.mobileno;

  const dateofbirth = props.route.params.User.dateofbirth;

  const [pickedImagePath, setPickedImagePath] = useState('');


  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      base64: true
    });

    // Explore the result
    // console.log(result);

    if (!result.cancelled) {
      if (result.base64){
        const imgpath = 'data:image/jpeg;base64,' + result.base64
        setPickedImagePath(imgpath);
        // console.log(result.uri);
        }
      }
  }

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      base64: true
    });

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    // console.log(result);

    if (!result.cancelled) {
      if (result.base64){
      const imgpath = 'data:image/jpeg;base64,' + result.base64
      setPickedImagePath(imgpath);
      // console.log(result.uri);
      }
    }
  }

  const isValidForm = () => {
    console.log('valid')
    return true;
  };
  
  const sendCred = async (props) => {
    if (isValidForm()) {
      try {
        const User = {
          user_name : user_name,
          email : email,
          password : password,
          first_name:firstname,
          last_name: lastname,
          phone_number:mobileno,
          dob:dateofbirth,
          profile_photo_url:pickedImagePath,
        }
        console.log(User)
        //JSON encoded while passing body and handled in backEnd
        axios.post(server + `auth/register`, JSON.stringify(User))
          .then(async(res) => {
            console.log(res)
            props.navigation.replace("home", {User});
            await AsyncStorage.setItem("token", "success");
            await AsyncStorage.setItem("user", JSON.stringify(User)); 
          }).catch(err=>{
            console.log(err);
            return updateError(err.response.data, setError);
          })
          
      } catch (err) {
        console.log(err);
        return updateError(err.response.data, setError);
      }
    }
  };
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
          Upload Your Profile Photo
        </Text>

        <Text
          style={{
            fontSize: 15,
            marginLeft: 10,
            marginTop: 65,
            color: "black",
          }}
        >
        This data will be displayed in your account profile for security
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
        
        <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <Button_native onPress={showImagePicker} title="Select an image" />
        <Button_native onPress={openCamera} title="Open camera" />
      </View>

      <View style={styles.imageContainer}>
        {
          pickedImagePath !== '' && <Image
            source={{ uri: pickedImagePath }}
            style={styles.image}
          />
        }
      </View>
    </View>


        <Button
          mode="contained"
          style={{
            marginTop: 20,
            marginLeft: 120,
            marginRight: 120,
            borderRadius: 10,
            backgroundColor: "#26C49E",
            height: 40,
          }}
          onPress={() => sendCred(props)}
        >
          signup
        </Button>
    </>
  );
};

export default SignupScreen_3;


const styles = StyleSheet.create({
  screen: {
    marginTop:20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 400,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  imageContainer: {
    padding: 30
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover'
  }
});