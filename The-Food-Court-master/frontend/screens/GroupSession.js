import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, Text, View, FlatList, RefreshControl } from "react-native";
import { Button, IconButton, Card } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { server } from '../utils/server'
import { updateError } from "../utils/Validation";

export default function SessionStarted(props) {

  // console.log('a groupsession', props);

  const [inviteStatus, setInviteStatus] = useState([])
  const [isSessionInitiator, setIsSessionInitiator] = useState(null)
  const [storedEmail, setStoredEmail] = useState(null)
  const [error, setError] = useState("");

  const [refreshing, setRefreshing] = useState(false)
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }


  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // console.log('Refreshing')
    getInvitationStatus()
    startedSession()
    wait(2000).then(() => setRefreshing(false));
  }, []);





  /*

  useEffect(() => {
     
     const interval = setInterval(() => {
        //setRefreshing(true)
        getInvitationStatus()
        wait(1000)
        startedSession()
        wait(2000)
    }, 3000);

    return () => clearInterval(interval)
   }, []);
  */

  /*

  useEffect(() => {
        setRefreshing(true)
        getInvitationStatus()
        startedSession()
        wait(2000).then(() => setRefreshing(false));
   }, []);
  */

  // console.log(props)
  const sessionId = props.route.params.sessionId
  // console.log('3a', sessionId);

  async function getInvitationStatus() {
    const email = await AsyncStorage.getItem('email')
    setStoredEmail(email)
    await axios.get(server + 'posts/get_invite_status', {
      params: {
        session_id: sessionId
      }
    })
      .then(data => {
        // console.log(data.data[0].initiator == email);
        setInviteStatus(data.data)
        setIsSessionInitiator(data.data[0].initiator == email)
      })
      .catch(err => console.log(err))
  }

  async function startedSession() {
    axios.get(server + 'posts/is_session_started', {
      params: {
        session_id: sessionId
      }
    })
    .then(data => {
      try{
        props.navigation.navigate('groupfoodieswipe', { sessionId: sessionId, initiator: storedEmail })
      
      }
      catch{
         props.navigation.replace('groupfoodieswipe', { sessionId: sessionId, initiator: storedEmail })  
      }
      
    })
    .catch(err => {
      console.log(err);
      return updateError(err.response.data, setError)
    })
  }

  function startSession() {
    // console.log('4a start session');
    // const email = await AsyncStorage.getItem('email')
    axios.get(server + 'posts/start_session', {
      params: {
          user_email: storedEmail
      }
  })
      .then(data => {
          // console.log(data.data)
          const sessionId = data.data.session_id
          // console.log('5a', sessionId, storedEmail)
          // return updateError('Session started', setError)
          try{
            props.navigation.navigate('groupfoodieswipe', { sessionId: sessionId, initiator: storedEmail })
             
          }
          catch{
            props.navigation.replace('groupfoodieswipe', { sessionId: sessionId, initiator: storedEmail })
          }
      })
      .catch(err => {
        // console.log(err.response.data)
        return updateError(err.response.data, setError)
      })
  }

  const remove_user = async (user_name) => {
    // console.log('4a start session');
    const email = await AsyncStorage.getItem('email')
    axios.get(server + 'posts/group_foodie_remove_user', {
      params: {
          session_id: sessionId,
          user_email: storedEmail,
          remove_email: user_name
      }
  })
      .then(data => {
          // console.log(data.data)
          setInviteStatus(data.data)
          setIsSessionInitiator(data.data[0].initiator == email)
      })
      .catch(err => {
        console.log(err)
      })
  }

 
 
  

  
  const renderInviteStatus = ({ item }) => {
    
    return (
      <Card style={styles.cardStyle}>
          <View style={styles.inviteStatusItem}>
              <View style={styles.cardContent}>
              <Text>{item.user_name}</Text>
                {item.status === 0 && <Button labelStyle={{ fontSize: 25, color: "gray" }} style={{ top: 0, left:0 }} icon='timer-outline' />}
                {item.status === 1 && <Button labelStyle={{ fontSize: 25, color: "green" }} style={{ top: 0, left:0 }} icon='check' />}
                {item.status === -1 && <Button labelStyle={{ fontSize: 25, color: "red" }} style={{ top: 0, left:0 }} icon='close' />}
                {item.status === -2 && <Button labelStyle={{ fontSize: 25, color: "black" }} style={{ top: 0, left:0 }} icon='close' />}
              </View>
              {isSessionInitiator &&
              <IconButton style={styles.backButton} 
              onPress={() => remove_user(item.user_name)}
              icon='close-thick' />
              }
          </View>
        </Card>
    )
}

  return (
    <SafeAreaView style={styles.container}>  
      <Text style={styles.inviteText}>Group Session Status</Text>
      <FlatList 
      contentContainerStyle={styles.flatListView} 
      renderItem={renderInviteStatus} 
      data={inviteStatus} 
      keyExtractor={(item) => item.id.toString()} 
      
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      } />

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
    
      {isSessionInitiator && <View>
        <Button style={styles.inviteFriendButton} onPress={() => startSession()} 
        children={
          <Text style={{color: '#ffffff', padding: 16}}>
            Start
          </Text>
        }></Button>
      </View>}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    top: 0,
    left: 0,
  },
  container: {
    padding: 16,
    flex: 1,
  },
  flatListView: {
    flex: 0.75,
  },
  inviteText: {
    alignContent: "center",
    alignSelf: "center",
    marginTop: 24,
  },
  inviteFriendButton: {
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 10,
    width: '30%',
    padding: 5, 
    color: '#ffffff',
    backgroundColor: "#26C49E",
  },
  inviteStatusItem: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cardStyle: {
    padding: 10,
    margin: 10,
    flexDirection: 'column',
},
cardImage: {
    height: 100,
    width: 100,
    borderRadius: 5,
    flex: 1
},
cardContent: {
    flex: 5,
    margin: 10
},
})