import React, {useState,useEffect} from 'react'
import {
  StyleSheet, 
  SafeAreaView, 
  Image,
  Platform,
  StatusBar,
  Text,
  View,
  FlatList
} from 'react-native'
import { useIsFocused } from "@react-navigation/native";
import { server } from '../utils/server';
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'
import { Menu, Button, Divider, Provider, IconButton, Checkbox } from 'react-native-paper'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from './EditProfile'
import HomeScreen from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InviteUser from "./InviteUser";
import LoginScreen from './LoginScreen';
import AddFriend from './AddFriend';
import FriendList from './FriendList';
import InviteUserSuccess from './InviteUserSuccess';
import axios from 'axios';
import UpdateImage from './UpdateImage';
import ChangePasswordEdit from './ChangePasswordEdit';
import SignupScreen from './SignupScreen';
import PasswordReset from './PasswordReset';
import ChangePassword from './ChangePassword';
import ChangePasswordSuccess from './ChangePasswordSuccess';

const Tab = createMaterialTopTabNavigator()

function UserImagesTabs(props) {
	return (
		<Tab.Navigator
			initialRouteName="Uploads"
			screenOptions={{
				tabBarActiveTintColor: '#000F',
				tabBarLabelStyle: { fontSize: 12 },
				tabBarStyle: { backgroundColor: 'white', borderTopColor: 'black'},
			}}
		>
		<Tab.Screen
			name="Uploads"
			children={() => (
				<UploadsFragment uploadedImageData={props.uploadedImageData} />
			)}
			options={{ tabBarLabel: 'Uploads' }}
		/>
		<Tab.Screen
			name="Tagged"
			children={() => (
				<TaggedFragment taggedImageData={props.taggedImageData} />
			)}
			options={{ tabBarLabel: 'Tagged' }}
		/>
		</Tab.Navigator>
	)
}

function UploadsFragment(props) {
	return (
		<View style={styles.listViewLayout}>
			
			<FlatList 
				numColumns={2}
				data = {props.uploadedImageData}
				renderItem={({ item }) => (
					<Image 
					style={styles.imageGridView}
					source={{uri: server + 'media/' + item.imageUri}} />
				)}
			/>
		</View>
	)
}

function TaggedFragment(props) {
	return (
		<View style={styles.listViewLayout}>
			<FlatList 
				numColumns={2}
				data = {props.taggedImageData}
				renderItem={({ item }) => (
					<Image 
					style={styles.imageGridView}
					source={{uri: server + 'media/' + item.imageUri}} />
				)}
			/>
		</View>
	)
}

function Profile(props) {

	const userData=props.route.params.userData;
	const [userd,setUserd] = useState({});
	const isFocused = useIsFocused();
	const [indvPost,setIndvPost] = useState([])
	const [indvTag,setIndvTag] = useState([])
	const Logout = async (props) => {
		// const User = props.route.params.User;
		// await AsyncStorage.getItem("token");
		AsyncStorage.removeItem("token");
		AsyncStorage.removeItem('email');
		props.navigation.replace("login");
	  };
	
	//   console.log(userData)
	useEffect(() => {
		(async () => {
		const email = await AsyncStorage.getItem('email');
		// console.log(email, 'user email 1');
		axios.get(server + 'auth/get_user', {
			params: {
				user_email: email
			}
		})
		.then(data => {
			// console.log(userData.email, data.data, 'p data');
			setUserd(data.data)
		})
		.catch(error => console.log(error, "p error"))
	
		axios.get(server + 'posts/getIndvPosts', {
			params: {
				user_email:email
			}
		})
		.then(data => {
			// console.log(data)
			setIndvPost(data.data)
			// console.log(userd)
		})
		.catch(error => console.log(error))

		axios.get(server + 'posts/getIndvTags', {
			params: {
				user_email:email
			}
		})
		.then(data => {
			// console.log(data)
			setIndvTag(data.data)
			// console.log(userd)
		})
		.catch(error => console.log(error))

	})()
},[userData, isFocused])

	// const indqvPost=['../assets/userfinal.jpg']

	// let listIndvPost=[];
	// 	for (let i in indqvPost){
	// 		listIndvPost.append({imageUri:require(i),key:'1'})

	// const User = props.route.params.userData
	var listIndvPost=[];
		for (let i in indvPost){

			listIndvPost.push({imageUri:indvPost[i],key:(Number(i)+1).toString()})
		}
	var listIndvTag=[];
		for (let i in indvTag){

			listIndvTag.push({imageUri:indvTag[i],key:(Number(i)+1).toString()})
		}
	// console.log(listIndvPost);
	// 	}

	// const User = props.route.params.userData
	const [contextMenuVisible, setContextMenuVisible] = useState(false)
	// console.log(userd.profile_photo_url)
	var uploadedImageData=[]
	if(listIndvPost.length!=0){
	uploadedImageData=listIndvPost
	}
	var taggedImageData=[]
	if(listIndvTag.length!=0){
		taggedImageData=listIndvTag
	}

	const openMenu = () => setContextMenuVisible(true)
	const closeMenu = () => setContextMenuVisible(false)
	const [locationAccess, setLocationAccess] = useState(true);
  const [allowNotifications, setAllowNotifications] = useState(true);

	console.log(userd,"Hello")
	return (
		<SafeAreaView style={styles.container}>
			<IconButton
			icon="arrow-left"
			color="#26C49E"
			size={20}
			onPress={() => {
				props.navigation.navigate("home");
			}}
			/>
			<View style={styles.userInfoSection}>
			{userd.profile_photo_url ? (
          <Image
          style={styles.userProfileImage}
          source={{ uri: server + 'media/' + userd.profile_photo_url }}
            />
            ) : 
            <Image
             style={styles.userProfileImage}
             source={{ uri:"https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png" }}
           />
           }
				{/* <Image source={{uri: userd.profile_photo_url}} style={styles.userProfileImage}/> */}
				<View style={styles.userDetails}>
					<Text style={styles.userDetailsName}>{userd.user_name}</Text>
					<Text style={styles.userDetailsEmail}>{userd.email}</Text>
				</View>
				<Menu
					visible={contextMenuVisible}
					onDismiss={closeMenu}
					anchor={<Entypo style={styles.contextMenu} name="dots-three-vertical" onPress={openMenu} size={24} color="black" />}
				>
					<Menu.Item onPress={() => {
						closeMenu()
						props.navigation.navigate('edituserprofile',{userData: userData})
						}} title="Edit Profile" />
					<Menu.Item onPress={() => {
						closeMenu()
						props.navigation.navigate('inviteuser',{userData: userData})
						}} title="Invite User" />
					<Menu.Item onPress={() => {
						closeMenu()
						props.navigation.navigate('addfriend',{userData: userData})
						}} title="Add Friend" />
					<Menu.Item onPress={() => {
						closeMenu()
						props.navigation.navigate('friendlist',{userData: userData})
						}} title="Friend list" />
					<Menu.Item onPress={() => {
						closeMenu()
						props.navigation.navigate('changepasswordedit',{userData: userData})
						}} title="Change Password" />
					{/* <Checkbox.Item label="Location Access" status={ locationAccess ? 'checked' : 'unchecked' } onPress= { () =>  {
						setLocationAccess(!locationAccess) 
						}} />
                    <Checkbox.Item label="Notifications" status={ allowNotifications ? 'checked' : 'unchecked' } onPress={ () => {
						setAllowNotifications(!allowNotifications)
						} } /> */}
				</Menu>
			</View>
			<Button
        mode="contained"
        style={{
          marginLeft: 18,
          backgroundColor: "#26C49E",
          marginRight: 18,
          marginTop: 18,
          borderRadius: 20,
        }}
        onPress={() => Logout(props)}
      >
        Logout
      </Button>
	  
			<View style={styles.tabLayout} >
				<NavigationContainer independent={true}>
				<UserImagesTabs uploadedImageData={uploadedImageData} taggedImageData={taggedImageData}/>
				</NavigationContainer>
			</View>
		</SafeAreaView>
	)
}

export default function UserProfile(props) {
	
	const EditUserInfoStack = createNativeStackNavigator();

	const userData=props.route.params.userData
	// console.log(userData);
	return (
		<>
		<Provider>
			<NavigationContainer independent={true}>
				<EditUserInfoStack.Navigator>
					<EditUserInfoStack.Screen name="userprofile" component={Profile} initialParams={{userData: userData}} options={{ headerShown: false }} />
					<EditUserInfoStack.Screen name="home" component={HomeScreen} initialParams={{userData: userData}} options={{ headerShown: false }} />
					<EditUserInfoStack.Screen name="inviteuser" component={InviteUser} initialParams={{userData: userData}} options={{ headerShown: false }} />
					{/* <EditUserInfoStack.Screen name="inviteusersuccess" component={InviteUserSuccess} initialParams={{userData: userData}} options={{ headerShown: false }} /> */}
					<EditUserInfoStack.Screen name="edituserprofile" component={EditProfile} initialParams={{userData: userData}} options={{ headerShown: false }} />
					<EditUserInfoStack.Screen name="changepasswordedit" component={ChangePasswordEdit} initialParams={{userData: userData}} options={{ headerShown: false }} />
					<EditUserInfoStack.Screen name="updateimage" component={UpdateImage} initialParams={{userData: userData}} options={{ headerShown: false }} />
					<EditUserInfoStack.Screen name="addfriend" component={AddFriend} initialParams={{userData: userData}} options={{ headerShown: false }} />
					<EditUserInfoStack.Screen name="friendlist" component={FriendList} initialParams={{userData: userData}} options={{ headerShown: false }} />
					<EditUserInfoStack.Screen name="login" component={LoginScreen} options={{headerShown: false}} />
					<EditUserInfoStack.Screen name="signup" component={SignupScreen} options={{headerShown: false}} />
					<EditUserInfoStack.Screen name="passwordreset" component={PasswordReset} options={{headerShown: false}} />
					<EditUserInfoStack.Screen name="changepassword" component={ChangePassword} options={{headerShown: false}} />
					{/* <EditUserInfoStack.Screen name="changepasswordsuccess" component={ChangePasswordSuccess} options={{headerShown: false}} /> */}
				</EditUserInfoStack.Navigator>		
			</NavigationContainer>
		</Provider>
		</>	
	);
}

const styles = StyleSheet.create({
	container: {
		// marginTop: Platform.OS === "android" ? (StatusBar.currentHeight + 20) : 0,
		flex: 1,
		backgroundColor: '#fff',
	},
	userInfoSection: {
		flex: 3,
		maxHeight: 200,
		flexDirection: 'row'
	},
	userProfileImage: {
		margin: 8,
		flex: 4,
		height: '90%',
		width: '100%',
		resizeMode: 'cover',
		borderRadius: 16
	},
	userDetails: {
		flex: 6,
		margin: 16,
		flexDirection: 'column',
	},
	userDetailsName: {
		fontSize: 24,
		marginBottom: 8
	},
	userDetailsEmail: {
		fontSize: 16,
		color: 'rgba(0, 0, 0, 0.5)'
	},
	contextMenu: {
		flex: 1,
		margin: 8
	},
	tabLayout: {
		flex: 11,
	},
	listViewLayout: {
		flex: 1,
	},
	imageGridView: {
		height: 180,
		width: '50%',
		resizeMode: 'cover'
	}
});
