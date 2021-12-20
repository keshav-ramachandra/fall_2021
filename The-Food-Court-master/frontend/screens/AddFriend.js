import React, { useEffect, useState } from "react";
import { Button, IconButton, Snackbar } from "react-native-paper";
import {
  Text,
  StatusBar,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { updateError } from "../utils/Validation";
import axios from 'axios';
import { server } from "../utils/server";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectBox from 'react-native-multi-selectbox';

const AddFriend = (props) => {

  const [error, setError] = useState("");

  const inviter_user = props.route.params.userData

  const [friendList, setFriendList] = useState([])

  const [visible, setVisible] = React.useState(false);

  const [emailId, setEmailId]= React.useState('');


  function onToggleSnackBar () {
    setVisible(!visible)
    setTimeout(function() {
      props.navigation.navigate('userprofile')
    }, 1000)
  }

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {(async() => {
    const email = await AsyncStorage.getItem('email');
    setEmailId(email)
    await axios.get(server + 'posts/getUsers', {
        params: {
            email: email
        }
    })
        .then(data => {
            setFriendList(data.data)
        })
        .catch(err => console.log(err))
    })()
  }, []);

  const items1 = []
  const [friend, setFriend] = useState({})
  for (const [index, value] of friendList.entries()) {
    items1.push({item:value,id:index})
   }
   
   function onChange() {
     return (val) => 
       setFriend(val)
      
   }

  const isValidForm = () => {
    if (!friend || friend.item.length == 0) return updateError("User name can't be empty", setError);

    return true;
  };


   const expoNotify = (expo_ids) => {
        let text = emailId.split("@")[0] + " has sent you a friend request"
        console.log("received expo ids are ", expo_ids)
        for (var i = 0; i < expo_ids.length; i++){
            fetch("https://exp.host/--/api/v2/push/send", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Accept-Encoding": "gzip,deflate",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: expo_ids[i],
                sound: 'default',
                title : "Friend request",
                body:text,
                data:{"url":"app://home/Notifications"}
              }),
            })
        }
  }


  const sendNotifications = async (users) => {
      
          
        console.log("users areaaa", users)
        
        await axios.get(server + 'auth/get_expo_ids', {
            params: {
                users: users
            }
        })
        .then(async function(data) {
            let expo_ids = data.data.friends
            console.log("friend's expo ids are", expo_ids)
            //await expoNotify(expo_ids);
            expoNotify(expo_ids)
        })
        .catch(err => {
                console.log(err);
                // return updateError(err.response, setError);
        })

       
  }

  const sendCred = async (props) => {
    const email = await AsyncStorage.getItem('email')
    console.log('fr', friend.item)
    if (isValidForm()) {
        const User = {
          initiator : email,
          friend : friend.item
        }
      try {
      axios.post(server + 'auth/add_friend', JSON.stringify(User))
      .then(res => {
        setFriend('')
        setVisible(visible ? 'Hide' : 'Show')
        onToggleSnackBar()
        sendNotifications([friend.item])

      })
      .catch(err=>{
        // console.log(err.response);
        return updateError(err.response, setError);
      })
      
      }catch (err) {
        console.log(err);
        return updateError(err.response.data, setError);
      }
    }
  };

  return (
    <SafeAreaView style={{ margin:16, flex: 1 }}>
      <KeyboardAvoidingView behavior="position">
        <StatusBar backgroundColor="#26C49E" barStyle="light-content" />
        <IconButton
        icon="arrow-left"
        color="#26C49E"
        size={20}
        onPress={() => {
          props.navigation.navigate("userprofile", {inviter_user});
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
          Add a friend
        </Text>

        <Text
          style={{
            fontSize: 15,
            marginVertical: 20,
            color: "black",
          }}
        >
        Enter the user name of the user you want to add as a friend:
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

        <SelectBox
        label="Users"
        options={items1}
        value={friend}
        onChange={onChange()}
        arrowIconColor='#26C49E'
        searchIconColor='#26C49E'
        hideInputFilter={false}
        inputPlaceholder="Search"
        listOptionProps={{ nestedScrollEnabled: true }}
        />
      
        <Button
          mode="contained"
          style={{
            marginTop: 20,
            marginLeft: 50,
            marginRight: 50,
            borderRadius: 10,
            backgroundColor: "#26C49E"
          }}
          onPress={() => sendCred(props)}
        >
          add friend
        </Button>
      </KeyboardAvoidingView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={1000}
        >
        Friend Request Sent!
      </Snackbar>
    </SafeAreaView>
  );
};

export default AddFriend;
