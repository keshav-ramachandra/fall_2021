import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Screen, View, Text, Image } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import UpdateImage from "./screens/UpdateImage";
import SignupScreen from "./screens/SignupScreen";
import StartScreen from "./screens/start";
import SignupScreen_2 from "./screens/SignupScreen_2";
import SignupScreen_3 from "./screens/SignupScreen_3";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import PasswordReset from "./screens/PasswordReset";
import ChangePassword from "./screens/ChangePassword";
import UserProfile from "./screens/UserProfile";
import EditProfile from "./screens/EditProfile";
import ChangePasswordSuccess from "./screens/ChangePasswordSuccess";
import SessionStarted from './screens/GroupSession';
import GroupFoodieSwipe from "./screens/GroupFoodieSwipe";
// import InviteUser from "./screens/InviteUser";
// import InviteUserSuccess from "./screens/InviteUserSuccess";
// import AsyncStorage from "@react-native-community/async-storage";
//import { AsyncStorage } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GroupFoodieEnd from "./screens/GroupFoodieEnd";

import Notifications from './screens/Notifications';
import Constants from 'expo-constants';
import * as ENotifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import Linker from './utils/Linker';


const Stack = createStackNavigator();

const App = ({ navigation }) => {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [url, setUrl ] = useState(null);
  
  
  ENotifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }), 
  });

  /*
  function handleDL(e){
    console.log("linking object is", e)
    let url  = Linking.parse(e.url);
     setUrl(url);
     console.log("url received was", url)
     //alert(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`);
     Linking.openURL('exp://hv-wzb.kesha14.frontend.exp.direct:80/--/notifications');
  }
  */



  useEffect(() => {

    async function getInitialURL(){
      const initialURL = await Linking.getInitialURL();
      if(initialURL){
        setUrl(Linking.parse(initialURL))
        Linking.openURL('app://home')
      }
    }
     
    if(!url){
      getInitialURL();
    }

    registerForPushNotificationsAsync().then(token => {
      console.log("token is", token);
      setExpoPushToken(token)
    });


    //Linking.addEventListener("url", handleDL);

    
    notificationListener.current = ENotifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    
    responseListener.current = ENotifications.addNotificationResponseReceivedListener(response => {

      console.log("notification was clicked",response);
      //Linking.openURL('exp://hv-wzb.kesha14.frontend.exp.direct:80/--/notifications');
      //Linking.openURL('exp://exp.host/@community/with-webbrowser-redirect/--/app/notifications');
      Linking.openURL('app://home/Notifications')
    });

    return () => {
      ENotifications.removeNotificationSubscription(notificationListener.current);
      ENotifications.removeNotificationSubscription(responseListener.current);
      Linking.removeEventListener("url");
    };

  }, []);


  const linking = Linker;

  return (
    <>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Stack.Navigator>
          <Stack.Screen
            name="start"
            component={StartScreen}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="login"
            screenOptions={{gestureEnabled: true}}
            component={LoginScreen}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signup_2"
            component={SignupScreen_2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signup_3"
            component={SignupScreen_3}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="passwordreset"
            component={PasswordReset}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="changepassword"
            component={ChangePassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="changepasswordsuccess"
            component={ChangePasswordSuccess}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="userprofile"
            component={UserProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="groupsession"
            component={SessionStarted}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="groupfoodieswipe"
            component={GroupFoodieSwipe}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="groupfoodieend"
            component={GroupFoodieEnd}
            options={{ headerShown: false }}
          /> 
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({});



async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await ENotifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await ENotifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await ENotifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    ENotifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: ENotifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}







export default App;
