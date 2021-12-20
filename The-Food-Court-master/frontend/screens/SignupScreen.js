import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import axios from 'axios';
import {
  Image,
  View,
  CheckBox,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet
} from "react-native";
import { isValidEmail, updateError } from "../utils/Validation";
import { server } from "../utils/server";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { AsyncStorage } from "react-native";
import { Formik } from 'formik';
import * as yup from 'yup';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';



const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SignupScreen = (props) => {
  const [user_name, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState([]);

  const [isSelected, setSelection] = useState(false);

  const validationSchema = yup.object().shape({
    username: yup.string().label('Username').required(),
    email: yup.string().label('Email').email().required(),
    password: yup
      .string()
      .label('Password')
      .required()
      .min(8, 'Password must be atleast 8 characters long.')

  });
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [url, setUrl ] = useState(null);

  // const [flag, setFlag] = useState(true)
  // const [emailFlag, setEmailFlag] = useState(true)

  const errormsgs = []

  const isValidForm = () => {
    // if (!user_name.trim()) errormsgs.push("Username can't be empty\n");
    // if (!isValidEmail(email)) errormsgs.push("Invalid email!\n");

    // axios.get(server + 'auth/check_email', {
    //   params: {
    //     user_email: email
    // }
    // })
    // .then(res => {
    //   errormsgs.push("User with same email exists!\n");
    //   setEmailFlag(true)
    //   return updateError("User with same email exists!\n", setError)
    // })
    // .catch(err => {
    //   setEmailFlag(false)
    //   console.log(err)
    // })

    // axios.get(server + 'auth/check_username', {
    //   params: {
    //     user_name: user_name
    // }
    // })
    // .then(res => {
    //   setFlag(true)
    //   return updateError("Username exists!\n", setError)
    // })
    // .catch(err => {
    //   setFlag(false)
    //   console.log(err)
    // })
    // if (!password.trim() || password.length < 8)
    //   errormsgs.push("Password is less then 8 characters!\n");
    // console.log(errormsgs)
    if (errormsgs.length == 0) return true;
    else return updateError(errormsgs, setError)
  };

  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }), 
  });

  useEffect(() => {

    registerForPushNotificationsAsync().then(token => {
      console.log("token is", token);
      setExpoPushToken(token)
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("notification was clcked",response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const sendCred = async (props, usernameValue, emailValue, passwordValue) => {
    const User = {
      user_name: usernameValue,
      email: emailValue,
      password: passwordValue,
      expo_token: expoPushToken
    }

    if (isValidForm()) {
      try {
        console.log(User)
        //JSON encoded while passing body and handled in backEnd
        axios.post(server + `auth/register`, JSON.stringify(User))
          .then(async (res) => {
            console.log(res)
            await AsyncStorage.setItem("token", "success");
            await AsyncStorage.setItem("user", JSON.stringify(User));
            await AsyncStorage.setItem("email", emailValue);
            await AsyncStorage.setItem("expoToken", expoPushToken)
            props.navigation.replace("home");
          })
          .catch(err => {
            console.log(err);
            if (err.response.data === 'user_name') {
              console.log('hey')
              return updateError('Username already exists', setError)
            }
            else if (err.response.data === 'email') {
              return updateError('Email already exists', setError)
            }
            else if (err.response.data === 'user_nameemail') {
              return updateError('Username and Email already exists.', setError);
            }
          })

      } catch (err) {
        console.log(err);
        return updateError(err.response.data, setError);
      }
    }


    // if (isValidForm()) {
    //   try {
    //     // props.navigation.navigate(
    //     //   'signup_2',
    //     //   { User },
    //     // );

    //   } catch (err) {
    //     console.log(err);
    //     return updateError(err.response.data, setError);
    //   }
    // }
  };

  return (
    <>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          // alert(JSON.stringify(values));
          // setEmail(values['email'])
          // setPassword(values['password'])
          const usernameValue = values['username']
          const emailValue = values['email']
          const passwordValue = values['password']
          // console.log(emailValue, passwordValue)
          sendCred(props, usernameValue, emailValue, passwordValue)
          setTimeout(() => {
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {(formikProps) => (
          <KeyboardAvoidingView behavior="position" style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor="#26C49E" barStyle="light-content" />

            <Image
              style={{
                width: 300,
                height: 140,
                marginTop: 50,
                alignContent: "center",
                alignSelf: 'center'
              }}
              source={require('../assets/splash.png')}
            />

            <Text
              style={{
                fontSize: 22,
                textAlign: "center",
                marginTop: 65,
                color: "black",
              }}
            >
              Sign Up For Free
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
              label="Username *"
              mode="outlined"
              // value={user_name}
              // onChangeText={(text) => setUsername(text)}
              onChangeText={formikProps.handleChange('username')}
              onBlur={formikProps.handleBlur('username')}
              style={{ marginLeft: 18, marginRight: 18, height: 40, marginTop: 18 }}
              theme={{ colors: { primary: "#26C49E" } }}
            />
            <Text style={styles.errorMsg}>
              {formikProps.touched.username && formikProps.errors.username}
            </Text>
            <TextInput
              label="Email *"
              mode="outlined"
              // value={email}
              // onChangeText={(text) => setEmail(text)}
              onChangeText={formikProps.handleChange('email')}
              onBlur={formikProps.handleBlur('email')}
              style={{ marginLeft: 18, marginRight: 18, height: 40, marginTop: 18 }}
              theme={{ colors: { primary: "#26C49E" } }}
            />
            <Text style={styles.errorMsg}>
              {formikProps.touched.email && formikProps.errors.email}
            </Text>
            <TextInput
              label="Password *"
              mode="outlined"
              secureTextEntry={true}
              // value={password}
              // onChangeText={(text) => setPassword(text)}
              onChangeText={formikProps.handleChange('password')}
              onBlur={formikProps.handleBlur('password')}
              style={{ marginLeft: 18, marginRight: 18, height: 40, marginTop: 18 }}
              theme={{ colors: { primary: "#26C49E" } }}
            />
            <Text style={styles.errorMsg}>
              {formikProps.touched.password && formikProps.errors.password}
            </Text>
            {formikProps.isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <Button
                mode="contained"
                style={{
                  marginTop: 20,
                  marginLeft: 120,
                  marginRight: 120,
                  borderRadius: 10,
                  backgroundColor: "#26C49E"
                }}
                // onPress={() => sendCred(props)}
                onPress={formikProps.handleSubmit}
              >
                signup
              </Button>
            )}
            <Text
              style={{
                fontSize: 13,
                marginTop: 30,
                textAlign: "center",
                textDecorationLine: 'underline',
              }}
              onPress={() => props.navigation.replace('login')}
            >
              Already have an account? Login here
            </Text>
          </KeyboardAvoidingView>
        )}

      </Formik>
    </>
  );
};

const styles = StyleSheet.create(
  {
    errorMsg: {
      textAlign: 'center',
      color: '#FF0055'
    }
  }
)




async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default SignupScreen;
