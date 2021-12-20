import axios from "axios";
import React, { useEffect, useState, useFocusEffect } from "react";
import { ScrollView, StyleSheet, Text, Linking, Image, View, FlatList, RefreshControl, SafeAreaView, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { server } from "../utils/server";
import { useIsFocused } from "@react-navigation/native";
import { updateError } from "../utils/Validation";
import TopNavBar from '../components/TopNavBar';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Notifications = (props) => {

    const [notifications, setNotifications] = useState([])
    const [isNotificationAvailable, setNotificationAvailable] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        console.log('Refreshing')
        getNotifications()
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const accept_friend_request = (notification) => {
        if (notification.type == 'friend request') {
            axios.get(server + 'auth/accept_friend_request', {
                params: {
                    notification_id: notification.id
                }
            })
                .then(data => {
                    // console.log(data)
                    const notificationlist = data.data
                    setNotifications(data.data)
                    if (notificationlist.length == 0) setNotificationAvailable(false)
                    else setNotificationAvailable(true)
                })
                .catch(error => console.log(error))
        }
    }

    const decline_friend_request = (notification) => {
        axios.get(server + 'auth/decline_friend_request', {
            params: {
                notification_id: notification.id
            }
        })
            .then(data => {
                // console.log(data)
                const notificationlist = data.data
                setNotifications(data.data)
                if (notificationlist.length == 0) setNotificationAvailable(false)
                else setNotificationAvailable(true)
            })
            .catch(error => console.log(error))
    }

    const accept_invite = (notification) => {
        axios.get(server + 'posts/accept_group_invite', {
            params: {
                notification_id: notification.id
            }
        })
            .then(data => {
                console.log(data)
                const notificationlist = data.data
                setNotifications(data.data)
                if (notificationlist.length == 0) setNotificationAvailable(false)
                else setNotificationAvailable(true)
                const sessionId = data.data.session_id
                try{
                    props.nav.navigate('groupsession', { sessionId: sessionId })
                }
                catch{
                    props.nav.replace('groupsession', { sessionId: sessionId })
                }
                // finally{
                //     Alert.alert(
                //         'An error occured',
                //         "Go to Group Foodie tab and refresh if you aren't taken to the session"
                //     )
                // }
            })
            .catch(error => console.log(error))
    }

    const decline_invite = (notification) => {
        axios.get(server + 'posts/decline_group_invite', {
            params: {
                notification_id: notification.id
            }
        })
            .then(data => {
                // console.log(data)
                const notificationlist = data.data
                setNotifications(data.data)
                if (notificationlist.length == 0) setNotificationAvailable(false)
                else setNotificationAvailable(true)
            })
            .catch(error => console.log(error))
    }

    const renderNotification = ({ item }) => {
        const fr = item.type === 'friend request'
        const gf = item.type === 'group foodie invite'
        const tag = item.type === 'tagged you in a post'
        const match = item.type === 'group foodie match'
        const end = item.type === 'session ended'
        const rem = item.type === 'removed'
        const msg = item.message
        console.log(item)
        return (
            <Card style={styles.cardStyle}>
                <View style={styles.row}>
                    <View style={styles.cardContent}>

                        {(fr || gf) && <Text>{item.sender} has sent you a {item.type}</Text>}
                        {tag && <Text>{item.sender} has {item.type}</Text>}
                        {match && <Text>A {item.type} was found in the session initiated by {item.sender}.</Text>}
                        {end && <Text>The group foodie session started by {item.sender} has ended</Text>}
                        {msg && <Text>{item.message}</Text>}
                        {rem && <Text>You were removed from the group foodie session by {item.sender}.</Text>}
                        <Text>Notification received at: {item.date}, {item.time}</Text>
                    </View>
                </View>
                <View>

                    {
                        fr &&
                        <>
                            <Button
                                mode="contained"
                                name="remove"
                                style={styles.acceptButton}
                                backgroundColor="white"
                                onPress={() => accept_friend_request(item)}
                            >
                                accept
                            </Button>
                            <Button
                                mode="contained"
                                name="remove"
                                style={styles.deleteButton}
                                backgroundColor="white"
                                onPress={() => decline_friend_request(item)}
                            >
                                decline
                            </Button>
                        </>
                    }
                    {
                        gf &&
                        <>
                            <Button
                                mode="contained"
                                name="remove"
                                style={styles.acceptButton}
                                backgroundColor="white"
                            onPress={() => accept_invite(item)}
                            >
                                accept
                            </Button>
                            <Button
                                mode="contained"
                                name="remove"
                                style={styles.deleteButton}
                                backgroundColor="white"
                            onPress={() => decline_invite(item)}
                            >
                                decline
                            </Button>
                        </>
                    }
                </View>
            </Card>
        )
    }


    const isFocused = useIsFocused();
    const user = props.userData

    async function getNotifications() {
        const email = await AsyncStorage.getItem('email')
        await axios.get(server + 'auth/get_notifications', {
            params: {
                user_email: email
            }
        })
            .then(data => {
                // console.log('A guy\n',data.data)
                const notificationlist = data.data
                setNotifications(data.data)
                if (notificationlist.length == 0) setNotificationAvailable(false)
                else setNotificationAvailable(true)
                // console.log(notifications)
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {

        getNotifications()

    }, [props, isFocused])

    return (
        <SafeAreaView style={styles.parentView}>
            {/* <View style={{ flex: 1, flexDirection: 'row' , zIndex: 1, elevation : 1,  justifyContent:'space-between', alignItems:'flex-start', margin:0, padding:0 }}> */}
            {/* <TopNavBar  nav={props.nav} userdata={props.userData} userdetails={props.userdetails}/> */}
            {/* </View> */}
            {console.log("When it actually matters\n", isNotificationAvailable)}
            {!isNotificationAvailable &&
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <Text>There are no notifications available</Text>
                </ScrollView>
            }
            {isNotificationAvailable && <View>
                <FlatList
                    data={notifications}
                    renderItem={renderNotification}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            </View>}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    parentView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row'
    },
    cardStyle: {
        padding: 10,
        margin: 10,
        flexDirection: 'column',
    },
    cardFont: {
        color: 'green',
        fontSize: 30
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

export default Notifications;
