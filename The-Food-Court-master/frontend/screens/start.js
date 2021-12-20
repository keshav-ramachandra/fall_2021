import React, { useState, useEffect } from "react";
import { Button, TextInput } from "react-native-paper";
import axios from 'axios';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValidEmail, updateError } from "../utils/Validation";
import LoginScreen from "./LoginScreen";
import HomeScreen from "./HomeScreen";

const StartScreen = (props) => {
  const myAsyncEffect = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log(token, 'token');
    // AsyncStorage.removeItem("token");
    if (token) {
      props.navigation.replace("home");
    } else {
      props.navigation.replace("login");
    }
  };
  useEffect(() => {
    myAsyncEffect();
  }, []);
  return (
    <>
      <View />
    </>
  );
};

export default StartScreen;
