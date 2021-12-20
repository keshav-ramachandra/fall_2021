import React, { useEffect, useState } from 'react';
import { Platform,Modal, Text, View, Image, Pressable, StyleSheet, Button, TouchableHighlight, ScrollView, KeyboardAvoidingView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Swipe from './Swipe';
import SavedList from './SavedList';
import { Badge } from 'react-native-paper';
import { Avatar } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Modal from 'react-awesome-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddPost from './AddPost';
import axios from 'axios';
import { server } from '../utils/server';
import { useIsFocused } from "@react-navigation/native";
import Notifications from './Notifications';
import GroupFoodieSession from './GroupInvite';
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import GetLocation from 'react-native-get-location'
import Slider from '@react-native-community/slider';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { RadioButton, IconButton } from 'react-native-paper';

function Home(props) {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  var listdata=props.listdata
  var listRestar=props.listRestar
  // console.log(props.nav,"navigation")

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Please try again!!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState(5);

  const items1 = []
  const [selectedRestaurant, setSelectedRestaurant] = useState({})
  const items2 = []
  const [selectedFoodTag, setSelectedFoodTag] = useState([])
  for (const [index, value] of listdata.entries()) {
    items2.push({item:value,id:index})
   }

   function onMultiChange() {
    console.log(onMultiChange,"on multichange")
    return (item) => setSelectedFoodTag(xorBy(selectedFoodTag, [item], 'id'))
  }
  for (const [index, value] of listRestar.entries()) {
     let bvalue = value[1] + ', ' + value[2]
     items1.push({item:bvalue,id:value[0]})
   }
   
   function onChange() {
     return (val) => setSelectedRestaurant(val)
   }
   var userData=props.userData
   var userdetails=props.userdetails

   function refreshPage() {
    window.location.reload();
  }

  const [shouldShow, setShouldShow] = useState(true);
  const [shouldShow1, setShouldShow1] = useState(false);
  const [shouldShow2, setShouldShow2] = useState(false);
  const [checked, setChecked] = React.useState('first');
  return (
    <View style={{ flex: 1}}>
      <View style={styles.top_container}>
        <TouchableHighlight onPress={() => props.nav.navigate('userprofile', {userData})} style={[styles.image]}>
        {userdetails.profile_photo_url ? (
          <Image
          style={styles.profileImage}
          source={{ uri: server + 'media/' + userdetails.profile_photo_url }}
            />
            ) : 
            <Image
             style={styles.profileImage}
             source={{ uri:"https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png" }}
           />
           }
           {/* <Image
             style={styles.profileImage}
             source={{ uri: userdetails.profile_photo_url }}
           /> */}
        </TouchableHighlight>
        <View>
          {
            checked === 'second' &&
            <Badge size={15}>1</Badge>
          }
          {
            checked === 'third' &&
            <Badge size={15}>1</Badge>
          }
          {
            checked === 'first' &&
            <Badge size={15}>{selectedFoodTag.length}</Badge>
          }
        <Icon name="filter" size={30} color="#ffff"  onPress={() => setModalVisible(!modalVisible) } />
        </View>
        <Modal
        animationType="none"
        transparent={false}
        visible={modalVisible}
        statusBarTranslucent ={true}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
          <IconButton
          icon="arrow-left"
          color="#26C49E"
          size={20}
          onPress={() => {
            setModalVisible(!modalVisible)
          }}
          />
          <KeyboardAvoidingView behavior="position">
          <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <Text style={styles.modalText}>FILTERS</Text>
            <View>
            
        <View style={{flexDirection: "row", margin:30}}><RadioButton
          value="first"
          status={ checked === 'first' ? 'checked' : 'unchecked' }
          onPress={() => {setChecked('first') 
          setShouldShow(true)
          setShouldShow1(false)
          setShouldShow2(false)
        }}
        /><Text
          style={{
          fontSize: 15,
          marginLeft: 18,
          marginTop: 10,
          color: "black",
        }}>Choose Food Tag</Text></View>

        <Text style={styles.sepText}>----- OR -----</Text>

        <View style={{flexDirection: "row", margin:30}}><RadioButton
          value="second"
          status={ checked === 'second' ? 'checked' : 'unchecked' }
          onPress={() => {setChecked('second')
          setShouldShow(false)
          setShouldShow1(true)
          setShouldShow2(false)
        }}
        /> 
        <Text
        style={{
          fontSize: 15,
          marginLeft: 18,
          marginTop: 10,
          color: "black",
        }}
      >
        Choose Restaurant
      </Text></View>

      <Text style={styles.sepText}>----- OR -----</Text>

      <View style={{flexDirection: "row", margin:30}}>
        <RadioButton
          value="third"
          status={ checked === 'third' ? 'checked' : 'unchecked' }
          onPress={() => {setChecked('third')
          setShouldShow(false)
          setShouldShow1(false)
          setShouldShow2(true)
        }}
        />
        <Text style={{fontSize: 15,
            marginLeft: 18,
            marginTop: 15,
            color: "black"}}>
            Radius range: {sliderValue}
        </Text>
      </View>
      </View>

        {shouldShow ? (  
        <View style={{ margin: 18 }}>
          <SelectBox
            label="Food type"
            options={items2}
            selectedValues={selectedFoodTag}
            onMultiSelect={onMultiChange()}
            onTapClose={onMultiChange()}
            arrowIconColor='#26C49E'
            searchIconColor='#26C49E'
            toggleIconColor='#26C49E'
            multiOptionContainerStyle={{ backgroundColor: '#26C49E' }}
            isMulti
            inputPlaceholder="Search"
            listOptionProps={{ nestedScrollEnabled: true }}
          />
        </View>
        ):null}

        
        {shouldShow1 ? (
        <View style={{margin:18}}>
        <SelectBox
        label="Restaurants"
        options={items1}
        value={selectedRestaurant}
        onChange={onChange()}
        arrowIconColor='#26C49E'
        searchIconColor='#26C49E'
        hideInputFilter={false}
        inputPlaceholder="Search"
        listOptionProps={{ nestedScrollEnabled: true }}
        />
        </View>
        ):null}

        {/*Slider with max, min, step and initial value*/}
        {shouldShow2 ? (
        <Slider
          maximumValue={30}
          minimumValue={5}
          minimumTrackTintColor="#307ecc"
          maximumTrackTintColor="#000000"
          step={1}
          style={{fontSize: 15,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 15,
            color: "black",
          }}
          value={sliderValue}
          onValueChange={
            (sliderValue) => setSliderValue(sliderValue)
          }
        />
        ):null}
             <View style={styles.button_container}>
              <Button
                      title="Filter"
                      color="#15BE77"
                      onPress={() => {refreshPage
                    setModalVisible(!modalVisible)}}
              />
            </View>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>

        </View>
      <Swipe userdata={props.userData} nav={props.nav} checked={checked} rest_filter={selectedRestaurant} foodtag={selectedFoodTag} location={text} radius={sliderValue}/>
    </View>
  );
}

// function SavedList() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <SavedList />
//     </View>
//   );
// }

// function Notifications() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Notifications!</Text>
//     </View>
//   );
// }

// function GroupInvite() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Group session!</Text>
//     </View>
//   );
// }


// function Add() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Add!</Text>
//     </View>
//   );
// }

const Tab = createMaterialBottomTabNavigator();

function MyTabs(props) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="white"
      labelStyle={{ fontSize: 12 }}
    >
      <Tab.Screen
        name="Home"
        // component={Home}
        children={()=><Home userData={props.dataFromParent} nav={props.nav} userdetails={props.userdetails} listdata={props.listdata} listRestar={props.listRestar}/>} 
        options={{
          tabBarColor: '#26C49E',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="SavedList"
        children={()=><SavedList userData={props.dataFromParent} nav={props.nav} userdetails={props.userdetails}/>} 
        options={{
          tabBarColor: '#26C49E',
          tabBarLabel: 'SavedList',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bookmark-check" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        children={()=><AddPost userData={props.dataFromParent} nav={props.nav} userdetails={props.userdetails}/>} 
        options={{
          tabBarColor: '#26C49E',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus" color={color} size={26} />
          ),
        }}
      />
      {props.notifications > 0 &&
      <Tab.Screen
        name="Notifications"
        children={()=><Notifications userData={props.dataFromParent} nav={props.nav} userdetails={props.userdetails}/>} 
        options={{
          tabBarColor: '#26C49E',
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
          tabBarBadge: props.notification
        }}
      />
      }
       {props.notifications == 0 && 
      <Tab.Screen 
      name="Notifications"  
      children={()=><Notifications userData={props.dataFromParent} nav={props.nav} userdetails={props.userdetails}/>}   
      options={{  
        tabBarColor: '#26C49E', 
        tabBarLabel: 'Notifications', 
        tabBarIcon: ({ color }) => (  
          <MaterialCommunityIcons name="bell" color={color} size={26} />  
        ),  
        tabBarBadge: false  
      }}  
      />  
      }
      <Tab.Screen
        name="GroupInvite"
        children={()=><GroupFoodieSession userData={props.dataFromParent} nav={props.nav} userdetails={props.userdetails}/>}
        options={{
          tabBarColor: '#26C49E',
          tabBarLabel: 'GroupFoodie',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function HomeScreen(props) {
  const [userData, setUserData] = useState([]);
  const [listdata,setListData]=useState([])
  const [listRestar,setRestaurList]=useState([])

  // const User = props.route.params.User;
  // console.log(props.navigation,"navigate")

  const [isNotif, setNotif] = useState(0);  
  async function getNotifications() { 
    const email = await AsyncStorage.getItem('email') 
    await axios.get(server + 'auth/get_notifications', {  
        params: { 
            user_email: email 
        } 
    })  
        .then(data => { 
            // console.log('A guy\n',data.data) 
            const notificationlist = data.data; 
            var count = 0;  
            notificationlist.forEach(n => { 
              if (n.type === 'friend request' || n.type === 'group foodie invite'){ 
                count = count + 1 
              } 
            })  
            console.log('count', count);  
            setNotif(count);  
        })  
        .catch(error => console.log(error)) 
   } 


  useEffect(() => {
    (async() =>{
      const user = await AsyncStorage.getItem("user");
      const User = JSON.parse(user);
      setUserData(User);
      getNotifications();
    })();
  }, []);

  // console.log(userData)
  React.useEffect(() => {
    getNotifications();
    const willFocusSubscription = props.navigation.addListener('focus', () => {
  });
  return willFocusSubscription;
  }, []);

  const [userdetails,setUSerDetail] =useState([])
  
  useEffect(() => {(async () => {
    // console.log('useffect')
    const email = await AsyncStorage.getItem('email');
    console.log("user email at home", email);
    await axios.get(server + 'auth/get_user', {
      params: {
          user_email: email
      }
    })
    .then(data => {
        // console.log(data.data)
        setUSerDetail(data.data)
    })
    .catch(error => console.log(error))

    await axios.get(server + 'posts/get_filtered_foodtypes')
    .then(data => {
      // console.log(data)
        setListData(data.data)
    })
    .catch(error => console.log(error))
  
    await axios.get(server + 'posts/get_filtered_restaurants')
    .then(data => {
      // console.log(data)
      setRestaurList(data.data)
    })
    .catch(error => console.log(error))

    })()

},[])
  // console.log(userdetails)
  
  return (

    <NavigationContainer independent={true}>
      <MyTabs dataFromParent={userData} nav={props.navigation} userdetails={userdetails} listdata={listdata} listRestar={listRestar}/>
    </NavigationContainer>    
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
    marginBottom:50
  },
  text_container:{
       textAlign: 'center', // <-- the magic
       fontWeight: 'bold',
       fontSize: 18,
       marginTop: 0,
       flex: 1,
  },
  label:{
    textAlign: 'left',
    fontSize : 12,
    paddingBottom: 3
  },
  close: {
    color:"red",
    textAlign: "right",
    paddingRight: 20
  },
  top_container : {
        alignSelf: 'stretch',
        height: 62,
        flexDirection: 'row', // row
        backgroundColor: '#54C59F',
        alignItems: 'center',
        justifyContent: 'space-between', // center, space-around
        paddingLeft: 10,
        paddingRight: 10,
        top:0
  },
  profileImage: {
      width: 50,
      height: 50,
      borderColor: 'white',
      borderWidth: 1,
      borderRadius: 75
  },
   modalText: {
    marginBottom: 15,
    marginTop:80,
    textAlign: "center"
  },
  button_container:{
    margin:50,
    padding:20
  },
  sepText: {
   textAlign: "center",
   color: "gray"
 },
});
