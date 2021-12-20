import React, { useState,useEffect,useRef } from "react";
import {Button, TextInput, IconButton, Snackbar } from "react-native-paper";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UpdateImage = (props) => {
  const user = props.route.params.userdetails
  
  const [error, setError] = useState("");

  const [pickedImagePath, setPickedImagePath] = useState('');

  const [visible, setVisible] = React.useState(false);

  function onToggleSnackBar () {
    setVisible(!visible)
    setTimeout(function() {
      props.navigation.replace('userprofile')
    }, 1000)
  }

  const onDismissSnackBar = () => setVisible(false);

  const showImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result);
    }
  }

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result);
    }
  }

  const isValidForm = () => {
    return true;
  };

  
  const sendCred = async (props) => {
    const email = await AsyncStorage.getItem('email')
      let postForm = new FormData();
      let photo = {
          uri: pickedImagePath.uri,
          name: 'user.jpg',
          type: 'image/*'
      }
      console.log(photo)
      postForm.append('email', email)
      postForm.append('profile_photo_url', photo)
    if (isValidForm()) {
      try {

        axios({
          method: "post",
          url: server + 'auth/postImage',
          data: postForm,
          headers: { 'Accpet': 'application/json', "Content-Type": "multipart/form-data" },
        })
          .then(response => {
            console.log(response);
            setVisible(visible ? 'Hide' : 'Show')
            onToggleSnackBar()
            // return updateError('Success', setError)
          })
          .catch(response => {
            console.log(response);
            return updateError('Failed', setError)
          });

      } catch (err) {
        console.log(err);
        return updateError("Internal Server Error!!", setError);
      }
    }
    // console.log(img)
  };

  useEffect(
    () => {
      console.log(user.profile_photo_url)
      setPickedImagePath(server + 'media/' + user.profile_photo_url);
    },
    [ user]
);
  
  return (
    <>
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
          Update Your Profile Photo
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
        <Button_native onPress={showImagePicker} title={pickedImagePath !== '' ? "Edit image" : "Select an image"} />
        <Button_native onPress={openCamera} title="Open camera" />
      </View>

      <View style={styles.imageContainer}>
        {
          pickedImagePath !== '' && <Image
            source={{ uri: pickedImagePath.uri }}
            style={styles.image}
          />
        }
      </View>
      {/* <View style={styles.imageContainer}>
        {
          pickedImagePath !== '' && <Image
            source={{ uri: server + 'media/' + pickedImagePath }}
            style={styles.image}
          />
        }
      </View> */}
    </View>


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
          Update
        </Button>

        <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={1000}
        >
        Success!
      </Snackbar>
    </>
  );
};

export default UpdateImage;


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
