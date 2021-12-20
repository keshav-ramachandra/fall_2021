import React, { useState, useEffect } from "react";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import axios from 'axios';
import {
  View,
  Text,
  BackHandler,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValidEmail, updateError } from "../utils/Validation";
import { server } from "../utils/server";
import { Formik } from 'formik';
import * as yup from 'yup';

const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const validationSchema = yup.object().shape({
    email: yup.string().label('Email').email().required(),
    password: yup
      .string()
      .label('Password')
      .required()
  });

  useEffect(() => {
    console.log('use effect login');
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  const isValidForm = () => {
    // if (!isValidEmail(email)) return updateError("Invalid email!", setError);
    // if (!password.trim() || password.length < 8)
    //   return updateError("Password is less then 8 characters!", setError);
    return true;
  };

  const sendCred = (props, emailValue, passwordValue) => {
    const User = {
      email: emailValue
    }
    const loginUser = {
      email: emailValue,
      password: passwordValue
    }

    if (isValidForm()) {
      try {
        //JSON encoded while passing body and handled in backEnd
        axios.post(server + `auth/login`, JSON.stringify(loginUser))
          .then(async res => {

            props.navigation.navigate("home");
            await AsyncStorage.setItem("token", "success");
            await AsyncStorage.setItem("user", JSON.stringify(User));
            await AsyncStorage.setItem("email", emailValue);
          })
          .catch(err => {
            console.log(err);
            return updateError("Invalid credentials", setError);
          })
      }
      catch (err) {
        console.log(err);
        return updateError("Invalid credentials", setError);
      }
    }
  }

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '' }}
        initialValues={{
          'email': email,
          'password': password
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          // alert(JSON.stringify(values));
          // setEmail(values['email'])
          // setPassword(values['password'])
          const emailValue = values['email']
          const passwordValue = values['password']
          // console.log(emailValue, passwordValue)
          sendCred(props, emailValue, passwordValue)
          setTimeout(() => {
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {(formikProps) => (
          <KeyboardAvoidingView behavior="position" style={styles.container}>
            {console.log('Hello')}
            <StatusBar backgroundColor="#26C49E" barStyle="light-content" />

            <Image
              style={styles.imageLogo}
              source={require('../assets/splash.png')}
            />

            <Text
              style={styles.header}
            >
              Login To Your Account
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
              // value={email}
              style={styles.textInputEmail}
              theme={{ colors: { primary: "#26C49E" } }}
              onChangeText={formikProps.handleChange('email')}
              // onChange={
              //   (text) => {
              //     setEmail(text)
              //   }
              // }
              onBlur={formikProps.handleBlur('email')}
            />
            <Text style={styles.errorMsg}>
              {formikProps.touched.email && formikProps.errors.email}
            </Text>
            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry={true}
              // value={password}
              onChangeText={formikProps.handleChange('password')}
              // onChange={(text) => {
              //   setPassword(text);
              //   formikProps.handleChange('password')
              // }}
              // onChangeText={
              //   (text) => {
              //     formikProps.handleChange('password')
              //     setPassword(text);
              //   }
              // }
              onBlur={formikProps.handleBlur('password')}
              style={styles.textInputPassword}
              theme={{ colors: { primary: "#26C49E" } }}
            />
            <Text style={styles.errorMsg}>
              {formikProps.touched.password && formikProps.errors.password}
            </Text>
            <Text
              style={styles.passwordResentLink}
              onPress={() => props.navigation.replace('passwordreset')}
            >
              Forgot Password?
            </Text>
            {formikProps.isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <Button
                mode="contained"
                style={styles.loginButton}
                // onPress={() => sendCred(props)}
                onPress={formikProps.handleSubmit}
              >
                Login
              </Button>
            )}


            <TouchableOpacity>
              <View
                style={styles.signUpLinkContainer}
              >
                <Text
                  style={styles.signUpLinkText}
                >
                  Not Registered{" "}
                </Text>
                <Text
                  style={styles.signUpLink}
                  onPress={() => props.navigation.replace("signup")}
                >
                  Sign Up
                </Text>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  imageLogo: {
    width: 300,
    height: 140,
    marginTop: 50,
    alignContent: "center",
    alignSelf: 'center'
  },
  header: {
    fontSize: 22,
    marginTop: 65,
    color: "black",
    textAlign: 'center',
  },
  textInputEmail: {
    marginLeft: 18,
    height: 40,
    marginRight: 18,
    marginTop: 38
  },
  textInputPassword: {
    marginLeft: 18,
    height: 40,
    marginRight: 18,
    marginTop: 12
  },
  passwordResentLink: {
    fontSize: 13,
    marginTop: 18,
    color: "black",
    textAlign: 'center',
    textDecorationLine: "underline"
  },
  loginButton: {
    marginTop: 20,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: "#26C49E",
    width: 150,
  },
  signUpLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signUpLinkText: {
    fontSize: 14,
    marginTop: 20,
    fontStyle: "italic",
  },
  signUpLink: {
    fontSize: 14,
    marginTop: 20,
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  errorMsg: {
    color: '#ff0055',
    textAlign: 'center'
  },
  activityIndicator: {
    marginVertical: 10
  }
}
)

export default LoginScreen;
