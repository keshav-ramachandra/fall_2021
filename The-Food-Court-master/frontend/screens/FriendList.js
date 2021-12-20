import axios from "axios";
import React, { useEffect, useState, useFocusEffect } from "react";
import { ScrollView, StyleSheet, Text, Linking, Image, View, SafeAreaView } from 'react-native';
import { Card, Button, IconButton } from 'react-native-paper';
import { server } from "../utils/server";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FriendList = (props) => {

  const [friends, setFriends] = useState([])
//   const [requests, setRequests] = useState([])
  const user = props.route.params.userData

  useEffect(() => {
    (async () => {
        const email = await AsyncStorage.getItem('email')
    axios.get(server + 'auth/get_friends', {
        params: {
            user_email: email
        }
    })
    .then(data => {
        console.log(data.data)
        setFriends(data.data)
    })
    .catch(error => console.log(error))

    })()
}, [])

const remove = async (request_id, user) => {
    const email = await AsyncStorage.getItem('email');
    axios.get(server + 'auth/delete_friend', {
        params: {
            request_id: request_id,
            user_email: email
        }
    })
    .then(data => {
        console.log(data)
        setFriends(data.data)
    })
    .catch(error => console.log(error))
}

return (
    <SafeAreaView style={{ margin:16, flex: 1 }}>
    <IconButton
        icon="arrow-left"
        color="#26C49E"
        size={20}
        onPress={() => {
          props.navigation.navigate("userprofile", {user});
        }}
    />
    {/* <Text
        style={{
        fontSize: 22,
        textAlign:"center",
        marginTop: 10,
        color: "black",
        }}
    >
        Pending requests
    </Text>
    <ScrollView>
    { requests.map((item) => {
        return(
            <>
            <Card style = {styles.cardStyle}>
                <View style = {styles.row}>
                <Image source={{ uri: 'https://littlespicejar.com/wp-content/uploads/2021/01/Best-Garlicky-Palak-Paneer-13-scaled-735x1102.jpg' }} style={styles.cardImage} />
                <View style={ styles.cardContent }>
                <Text>User: {item.sender}</Text>
                <Text>Email: {item.sender_email}</Text>                
                </View>
                </View>
                <View> 
                <Button
                mode="contained"
                name="remove"
                style={styles.acceptButton}
                backgroundColor="white"
                onPress={() => accept(item.id)}
                >
                    accept
                </Button>
                <Button
                mode="contained"
                name="remove"
                style={styles.deleteButton}
                backgroundColor="white"
                onPress={() => decline(item.id)}
                >
                    decline
                </Button>
                </View>
            </Card>
          </>
        )
    })}
    </ScrollView> */}
    <Text
        style={{
        fontSize: 22,
        textAlign:"center",
        marginTop: 10,
        color: "black",
        }}
    >
        Friends
    </Text>
    <ScrollView>
    { friends.map((item) => {
        return(
            <>
            <Card style = {styles.cardStyle}>
                <View style = {styles.row}>
                <Image source={{ uri: server + 'media/' + item.profile_photo_url }} style={styles.cardImage} />
                <View style={ styles.cardContent }>
                <Text>User: {item.friend}</Text>
                <Text>Email: {item.friend_email}</Text>                
                </View>
                </View>
                <Button
                mode="contained"
                name="remove"
                style={styles.deleteButton}
                backgroundColor="white"
                onPress={() => remove(item.id, user)}
                >
                    remove
                </Button>
            </Card>
          </>
        )
    })}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    cardStyle: {
      padding: 10,
      margin: 10,
      flexDirection: 'column',
    },
    cardImage: {
        height: 100,
        width: '100%',
        borderRadius: 5,
        flex: 2
      },
    cardContent: {
        flex: 5,
        margin: 10
    },
    acceptButton: {
        marginRight: 10,
        backgroundColor: "#26C49E",
        alignSelf: 'center',
        width: '40%',
        borderRadius: 5,
        flex: 1,
        margin: 10
    },
    deleteButton: {
        marginRight: 10,
        backgroundColor: "red",
        alignSelf: 'center',
        width: '40%',
        borderRadius: 5,
        flex: 1,
        margin: 10
    }
});

export default FriendList;
