 
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Modal,
  Pressable,
  Picker,
  TouchableHighlight,
  Button,
} from 'react-native';

import { Entypo } from '@expo/vector-icons';

import { Menu, Provider, IconButton, Checkbox } from 'react-native-paper';
import React, { useState } from 'react';
import { server } from '../utils/server';


function TopNavBar (props) {

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const openMenu = () => setContextMenuVisible(true);
  const closeMenu = () => setContextMenuVisible(false);
  const [locationAccess, setLocationAccess] = useState(true);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const userData = props.userdetails
  return (
       <Provider>
        {/* <View style={styles.top_nav_container}> */}
        <View style={styles.top_container}>
        <TouchableHighlight onPress={() => props.nav.navigate('userprofile', {userData})} style={[styles.image]}>
        {userData.profile_photo_url ? (
          <Image
          style={styles.profileImage}
          source={{ uri: server + 'media/' + userData.profile_photo_url }}
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
              {/* <TouchableHighlight onPress={() => props.nav.navigate('userprofile', {userData: props.userdata} )} style={[styles.image]}>
                 <Image
                   style={styles.profileImage}
                   source={{ uri:"https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png" }}
                 />
              </TouchableHighlight> */}
              {/* <Menu
                    style={styles.menu1}
                    visible={contextMenuVisible}
                    onDismiss={closeMenu}
                    anchor={<Entypo name="dots-three-vertical" onPress={openMenu} size={24} color="black" />}
                >
                    <Checkbox.Item label="Location Access" status={ locationAccess ? 'checked' : 'unchecked' } onPress= { () =>  setLocationAccess(!locationAccess) } />
                    <Checkbox.Item label="Notifications" status={ allowNotifications ? 'checked' : 'unchecked' } onPress={ () => setAllowNotifications(!allowNotifications) } />
                    <Menu.Item onPress={() => props.navigation.navigate('changePassword',{userData: userData})} title="Change Password" />
                </Menu>  */}
           
        </View>
       </Provider>
   );     
}
 
       
const styles = StyleSheet.create({
  top_nav_container : {
      flex: 1,
      flexDirection: 'row',
      width:'100%',
      maxHeight: 62,
      top:0,
      backgroundColor: '#54C59F',  
      justifyContent:'space-between',
      alignItems: 'center',
      padding:30, 
      zIndex: 3, // works on ios
      elevation: 3,
  },
  profileImage: {
      width: 50,
      height: 50,
      borderColor: 'white',
      borderWidth: 1,
      borderRadius: 75,
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
  // menu1:{
  //   zIndex: 3, // works on ios
  //   elevation: 3,
  // }
});       

export default TopNavBar;
