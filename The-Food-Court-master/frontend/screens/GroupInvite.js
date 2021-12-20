import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, Text, ScrollView, RefreshControl } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { server } from '../utils/server'
import { updateError } from "../utils/Validation";
import * as Notifications from 'expo-notifications';

const GroupFoodieSession = (props) => {

    // console.log('groupinvite');
    const [error, setError] = useState("");
    const [friendList, setFriendList] = useState([])
    const [storedEmail, setStoredEmail] = useState(null)

    const [selectedFriends, setSelectedFriends] = useState([])

    const [nonBusyFriends, setNonBusyFriends] = useState([])

    const [refreshing, setRefreshing] = useState(false)
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        console.log('Refreshing')
        check()
        wait(2000).then(() => setRefreshing(false));
    }, []);


   /*
   useEffect(() => {
      const interval = setInterval(() => setTime(Date.now()), 1000);
      return () => {
        clearInterval(interval);
      };
   }, []);
   */
  

   /*
    
    useEffect(() => {
        setRefreshing(true)
        check()
        wait(2000).then(() => setRefreshing(false));
    }, []);
    */
    

    function onSelectedFriendsChange() {
        return (item) => setSelectedFriends(xorBy(selectedFriends, [item], 'id'))
    }



     


     const expoNotify = (expo_ids) => {
        let text = storedEmail.split("@")[0] + " is inviting you for a Group foodie session"
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
                title : "Group Foodie Session Invite",
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
            setNonBusyFriends([])
        })
        .catch(err => {
                console.log(err);
                // return updateError(err.response, setError);
        })

       
    }
`
            `

    function handleOnSubmit() {
        const errormsgs = []
        
        //sendNotifications(friendList);

        const isValidForm = () => {
            if (!selectedFriends || selectedFriends.length==0)  errormsgs.push("Please choose a friend\n")
            if (errormsgs.length == 0) return true;
            else return updateError(errormsgs, setError)
        };
        if (isValidForm()){
        const User = {
            initiator: storedEmail,
            friend: selectedFriends
        }
        axios.post(server + 'posts/sendSessionInvite', JSON.stringify(User))
            .then(data => {
                
                const sessionId = data.data.session_id
                let frnds = []
                console.log("Session id RECIEVED is", sessionId)
                console.log("non busy friends are", data.data.notifiers)
                console.log("this is state now",nonBusyFriends)
                frnds = JSON.parse(data.data.notifiers)
                sendNotifications(frnds);

                 console.log("1a Send Session Invite \n", sessionId)
                // console.log("2a session", props)
                
                props.nav.navigate('groupsession' , { sessionId: sessionId })                 
                
        
            })
            .catch(err => {
                // console.log(err.response);
                return updateError(err.response.data, setError);
            })
        }
        else{
            return updateError(errormsgs, setError)
        }
    }

    async function check() {
        const email = await AsyncStorage.getItem('email');
        axios.get(server + 'posts/is_session_active', {
            params: {
                initiator: email
            }
        })
            .then(data => {
                const sessionId = data.data.session_id
                // console.log("Send Session Invite \n", sessionId)
                // onToggleSnackBar()
                // setInterval(function () {
                const status = data.data.status
                const init = data.data.initiator
                // console.log("session active:", sessionId, status, init)
                  if (status === 0){
                    // console.log('navigating to group session\n');
                    try{
                        props.nav.replace('groupsession', { sessionId: sessionId })
                    }
                    catch{
                        props.nav.navigate('groupsession', { sessionId: sessionId })
                    }
                   
                }
                else if (status === 1){
                    // console.log('navigating to group swipe\n');
                    try{
                        props.nav.replace('groupsession', { sessionId: sessionId, initiator: init })
                    }
                    catch{
                        props.nav.navigate('groupsession', { sessionId: sessionId, initiator: init })
                    }
                    
                }
                // }, 1000)
               
                
            })
            .catch(err => {
                // console.log(err.response.data);
                return updateError(err.response.data, setError);
            })   
    }

    useEffect(() => {
        (async () => {
            const email = await AsyncStorage.getItem('email');
            setStoredEmail(email)
            await axios.get(server + 'posts/getFriend', {
                params: {
                    user_email: email
                }
            })
                .then(data => {
                    // console.log("Getting Friend list\n", data)
                    setFriendList(data.data)
                    // console.log("Getting Friend list\n", friendList)
                })
                .catch(err => console.log(err))

            //check()
        })()
        // return () => {
        //     cleanup
        // }
    }
        , [])

    
    /*
    useEffect(() => {
     const interval = setInterval(() => {
        //setRefreshing(true)
        check()
        //wait(2000).then(() => setRefreshing(false));
    }, 3000);
    return () => clearInterval(interval)
    }, []);

   
 */

    const items = []

    for (const [index, value] of friendList.entries()) {
        // console.log(typeof(index));
        items.push({ item: value, id: index })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
            style = {styles.flatlistStyle}
            nestedScrollEnabled = {true}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
                <Text style={styles.inviteText}>Invite friends for a group foodie session!</Text>

                <SelectBox
                    
                    label="Select from friends"
                    options={items}
                    selectedValues={selectedFriends}
                    onMultiSelect={onSelectedFriendsChange()}
                    onTapClose={onSelectedFriendsChange()}
                    arrowIconColor='#26C49E'
                    searchIconColor='#26C49E'
                    toggleIconColor='#26C49E'
                    multiOptionContainerStyle={{ backgroundColor: '#26C49E' }}
                    isMulti
                />

                <Button mode="contained" style={styles.inviteFriendButton} onPress={() => handleOnSubmit()}>Create Sesion</Button>
                {/* <Button mode="contained" style={styles.inviteFriendButton} onPress={() => check()}>Check</Button> */}
            </ScrollView>
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
        </SafeAreaView >
    );
}



const styles = StyleSheet.create({
    container: {
        margin: 16, 
        flex: 1,
    },
    flatlistStyle: {
        margin: 16,
    },
    inviteText: {
        'alignContent': "center",
        'alignSelf': "center",
        marginTop: 24,
        marginBottom: 24
    },
    inviteFriendButton: {
        marginTop: 20,
        alignSelf: "center",
        borderRadius: 10,
        backgroundColor: "#26C49E"
    },
}
)

export default GroupFoodieSession;