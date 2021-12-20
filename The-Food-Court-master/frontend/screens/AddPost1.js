import React, { Component, useState,useEffect } from "react";
import {Button, Snackbar } from "react-native-paper";
import axios from 'axios';
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import {
  Button as Button_native,
  SafeAreaView,
  View,
  CheckBox,
  Text,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet,
  Picker
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { server } from "../utils/server";
import { updateError } from "../utils/Validation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


const AddPost = (props, navigation) => {

  const [error, setError] = useState("");

  // const user = props.userData

  const [pickedImagePath, setPickedImagePath] = useState('');

  const [visible, setVisible] = React.useState(false);
  console.log(props)

  function onToggleSnackBar () {
    setVisible(!visible)
    setTimeout(function() {
      props.nav.replace('home')
    }, 1000)
  }

  const onDismissSnackBar = () => setVisible(false);

  const showImagePicker = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    alert("You've refused to allow this appp to access your photos!");
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
    alert("You've refused to allow this appp to access your camera!");
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

  const [listdata,setListData]=useState([])
  const [listRestar,setRestaurList]=useState([])
  const [listFriend,setFriendList]=useState([])
	
  useEffect(() => {(async() => {
    const email = await AsyncStorage.getItem('email')
  await axios.get(server + 'posts/getFoodType')
  .then(data => {
    // console.log(data)
      setListData(data.data)
  })
  .catch(error => console.log(error))
  await axios.get(server + 'posts/getRestaurant')
  .then(data => {
    console.log(data.data)
    setRestaurList(data.data)
  })
  .catch(error => console.log(error))
  await axios.get(server + 'posts/getFriend', {
    params: {
      user_email: email
    }
  })
  .then(data => {
    // console.log(data)
    setFriendList(data.data)
  })
  .catch(error => console.log(error))
  })()
}, []);

  const errormsgs = []

  const isValidForm = () => {
    // // console.log(selectedRestaurant," ",selectedFoodTag)
    if (!selectedRestaurant || selectedRestaurant.length==0) errormsgs.push("Please enter restaurant name\n")
    if (!selectedFoodTag || selectedFoodTag.length==0)  errormsgs.push("Please enter a food type\n")
    if (!pickedImagePath) errormsgs.push("Please add an image\n")
    if (errormsgs.length == 0) return true;
    else return updateError(errormsgs, setError)
  };

  const sendCred = async (props) => {
    if (isValidForm()) {
      try {
        const email = await AsyncStorage.getItem('email')
        const User = {
          email : email,
          restaurant_name : selectedRestaurant,
          food_type : selectedFoodTag,
          friend : selectFriend,
          // profile_photo_url:pickedImagePath
        }
        
        axios.post(server + `posts/savePost`, JSON.stringify(User))
          .then(async(res) => {
            // props.navigation.navigate("home")
            setSelectedFoodTag([])
            setSelectFriend([])
            setSelectedRestaurant([])
            // setPickedImagePath('')
            console.log("Post Added, now save image");
            let post = res.data
            let photo = {
              uri: pickedImagePath.uri,
              name: `post.jpg`,
              type: 'image/*'
            }
            let postForm = new FormData();
            postForm.append('post_id', post)
            postForm.append('food_image_url', photo)
            console.log(post, photo)
            try{
              axios({
                method: "post",
                url: server + 'posts/upload_image',
                data: postForm,
                headers: { 'Accept': 'application/json', "Content-Type": "multipart/form-data" },
              })
                .then(response => {
                  //handle success
                  console.log(response);
                  setPickedImagePath('')
                  setVisible(visible ? 'Hide' : 'Show')
                  onToggleSnackBar()
                  // return updateError('Post added', setError)
                })
                .catch(response => {
                  //handle error
                  console.log(response);
                  return updateError('Failed', setError)
                });
            }
            catch(err){
              console.log(err);
              console.log(err)
            }        

          }).catch(err=>{
            console.log(err);
            return updateError("Internal Error!!", setError);
          })

      } catch (err) {
        console.log(err);
        return updateError("Internal Error!!", setError);
      }
    }
  };

  const [selectedFoodTag, setSelectedFoodTag] = useState([])

   const items = []
   const [selectFriend,setSelectFriend] = useState([])
   const items1 = []
   const [selectedRestaurant, setSelectedRestaurant] = useState({})
   const items2 = []

   for (const [index, value] of listdata.entries()) {
    items.push({item:value,id:index})
   }

   function onMultiChange() {
    return (item) => setSelectedFoodTag(xorBy(selectedFoodTag, [item], 'id'))
  }

  for (const [index, value] of listFriend.entries()) {
    //  // console.log(typeof(index));
     items1.push({item:value,id:index})
   }

   function onMultiChange1() {
    //  // console.log(listFriend,"heeeee")
    return (item) => setSelectFriend(xorBy(selectFriend, [item], 'id'))
  }

  for (const [index, value] of listRestar.entries()) {
    // console.log(value, value[0]);
    // let label = value[0] + ' (' + value[1] + ')'
     let bvalue = value[1] + ', ' + value[2]
     items2.push({item:bvalue,id:value[0]})
   }
   
   function onChange() {
     return (val) => setSelectedRestaurant(val)
   }

  return (
    <SafeAreaView style={{ flex: 1}}>
    <ScrollView nestedScrollEnabled = {true}>
        <StatusBar backgroundColor="#26C49E" barStyle="light-content" />
        
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
    </View>

    <Text
          style={{
            fontSize: 15,
            marginLeft: 18,
            marginTop: 15,
            color: "black",
          }}
        >
          Choose Food Tag
        </Text>

        <View style={{ margin: 18, flex: 1 }}>
          <SelectBox
            label="Food type"
            options={items}
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

        <Text
          style={{
            fontSize: 15,
            marginLeft: 18,
            marginTop: 15,
            color: "black",
          }}
        >
          Choose Friend
        </Text>

        <View style={{ margin: 18, flex: 1 }}>
          <SelectBox
            label="Tag friends"
            options={items1}
            selectedValues={selectFriend}
            onMultiSelect={onMultiChange1()}
            onTapClose={onMultiChange1()}
            arrowIconColor='#26C49E'
            searchIconColor='#26C49E'
            toggleIconColor='#26C49E'
            multiOptionContainerStyle={{ backgroundColor: '#26C49E' }}
            isMulti
            inputPlaceholder="Search"
            listOptionProps={{ nestedScrollEnabled: true }}
          />
        </View>


        <Text
          style={{
            fontSize: 15,
            marginLeft: 18,
            marginTop: 15,
            color: "black",
          }}
        >
          Choose Restaurant
        </Text>

      <View style={{margin:18}}>
        <SelectBox
        label="Restaurants"
        options={items2}
        value={selectedRestaurant}
        onChange={onChange()}
        arrowIconColor='#26C49E'
        searchIconColor='#26C49E'
        hideInputFilter={false}
        inputPlaceholder="Search"
        listOptionProps={{ nestedScrollEnabled: true }}
        />
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
    Add Post
    </Button>

    </ScrollView>
    <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={1000}
        >
        Post Added! Now waiting for admin approval.
      </Snackbar>
    {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default AddPost;


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
    padding: 30,
  },
  image: {
    width: 330,
    height: 330,
    resizeMode: 'cover',
    borderRadius: 8,
  }
});