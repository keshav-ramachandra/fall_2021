import React, { useState, useEffect } from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Platform,
    StatusBar,

} from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import { Button, IconButton, Card, Snackbar } from "react-native-paper";
import { server } from "../utils/server";
import Swiper from 'react-native-deck-swiper';
import { Transitioning, Transition, log } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function GroupFoodieSwipe(props) {

    const [postData, setPostData] = useState([])

    let boolean = null
    const sessionId = props.route.params.sessionId;
    const initiator = props.route.params.initiator;

    const [index, setIndex] = useState(0)
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [currentUserDetails, setCurrentUserDetails] = useState([])
    const [storedEmail, setStoredEmail] = useState("")

    const swiperRef = React.createRef();
    const transitionRef = React.createRef();

    const [visible, setVisible] = React.useState(false);

    function onToggleSnackBar () {
        setVisible(!visible)
        setTimeout(function() {
        props.navigation.replace('home')
        }, 1000)
    }

    const onDismissSnackBar = () => setVisible(false);

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
            getCurrentUserDetails()
            getPosts(location)
        })();

    }, [])

    const onSwipedRight = () => {
        try{
        axios.get(server + 'posts/group_foodie_swipe', {
            params: {
                session_id: sessionId,
                user_email: storedEmail,
                post_id: postData[index].id
            }
        })
            .then(data => {
                console.log(data.data)
                try{
                    if (data.data.match_found === 1){
                        const match = {
                            'type': data.data.type,
                            'tag': data.data.tag
                        }
                        props.navigation.replace('groupfoodieend', {match})
                    }
                    else if (data.data.match_found === 0){
                        setVisible(visible ? 'Hide' : 'Show')
                        onToggleSnackBar()
                    }
                }
                catch{
                    console.log('catch');
                }
            })
            .catch(err => {
                console.log(err)
                if (err.response.status == 500){
                    setVisible(visible ? 'Hide' : 'Show')
                    onToggleSnackBar()
                }
            })
        }
        catch{
            console.log('No more cards left');
            axios.get(server + 'posts/group_foodie_swipe', {
                params: {
                    session_id: sessionId,
                    user_email: storedEmail,
                    post_id: postData[index % postData.length].id,
                    is_end: 1
                }
            })
                .then(data => {
                    console.log(data.data)
                    try{
                        if (data.data.match_found === 1){
                            const match = {
                                'type': data.data.type,
                                'tag': data.data.tag
                            }
                            props.navigation.replace('groupfoodieend', {match})
                        }
                        else if (data.data.match_found === 2){
                            console.log('no match');
                            const match = {
                                'type': data.data.type,
                                'tag': data.data.tag
                            }
                            props.navigation.replace('groupfoodieend', {match})
                        }
                    }
                    catch{
                        console.log('catch');
                    }
                })
                .catch(err => {
                    console.log(err)
                    if (err.response.status == 500)
                    setVisible(visible ? 'Hide' : 'Show')
                    onToggleSnackBar()
                })
        }
    }

    const onSwipedLeft = () => {
        try{
        axios.get(server + 'posts/group_foodie_left', {
            params: {
                session_id: sessionId,
                user_email: storedEmail,
                post_id: postData[index].id
            }
        })
            .then(data => {
                console.log(data.data)
                try{
                    if (data.data.match_found === 1){
                        const match = {
                            'type': data.data.type,
                            'tag': data.data.tag
                        }
                        props.navigation.replace('groupfoodieend', {match})
                    }
                    else if (data.data.match_found === 0){
                        setVisible(visible ? 'Hide' : 'Show')
                        onToggleSnackBar()
                    }
                }
                catch{
                    console.log('catch');
                }
            })
            .catch(err => {
                console.log(err)
                if (err.response.status == 500)
                setVisible(visible ? 'Hide' : 'Show')
                onToggleSnackBar()
            })
        }
        catch{
            console.log('No more cards left');
            axios.get(server + 'posts/group_foodie_left', {
                params: {
                    session_id: sessionId,
                    user_email: storedEmail,
                    post_id: postData[index % postData.length].id,
                    is_end: 1
                }
            })
                .then(data => {
                    console.log(data.data)
                    try{
                        if (data.data.match_found === 1){
                            const match = {
                                'type': data.data.type,
                                'tag': data.data.tag
                            }
                            props.navigation.replace('groupfoodieend', {match})
                        }
                        else if (data.data.match_found === 2){
                            console.log('no match');
                            const match = {
                                'type': data.data.type,
                                'tag': data.data.tag
                            }
                            props.navigation.replace('groupfoodieend', {match})
                        }
                    }
                    catch{
                        console.log('catch');
                    }
                })
                .catch(err => {
                    console.log(err)
                    if (err.response.status == 500)
                    setVisible(visible ? 'Hide' : 'Show')
                    onToggleSnackBar()
                })   
        }
    }

    const onSwiped = () => {
        setIndex((index + 1));
    };


    const onSwipedAll = () => {
        setIndex(0)
    }

    async function getCurrentUserDetails() {
        const email = await AsyncStorage.getItem('email')
        setStoredEmail(email)
        axios.get(server + 'auth/get_user', {
            params: {
                user_email: email
            }
        })
            .then(data => {
                setCurrentUserDetails(data.data)
            })
            .catch(error => console.log(error, "p error"))

    }

    const getPosts = async (location) => {
        const email = await AsyncStorage.getItem('email')
        axios.get(server + 'posts/get_posts', {
            params: {
                user: email,
                foodtag: [],
                rest_filter: {},
                location: JSON.stringify(location),
                radius: 30,
                checked: "first",
            }
        }).then(res => {
            const resdata = res.data
            setPostData(resdata)
        })
            .catch(err => {
                console.log("Error retrieving post data\n", err);
            })
    }

    async function stopSession() {
        const email = await AsyncStorage.getItem('email')
        axios.get(server + 'posts/end_session', {
          params: {
              user_email: email,
              session_id: sessionId
          }
        })
          .then(data => {
            setVisible(visible ? 'Hide' : 'Show')
            onToggleSnackBar()
          })
          .catch(err => {
            console.log(err.response)
          })
      }

    // Define Card Style
    const Card = ({ card }) => {
        if (card) {
            return (
                <View style={styles.card}>
                    <Image source={{ uri: server + 'media/' + card.image }} style={styles.cardImage} />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.text, styles.heading]} numberOfLines={2}>
                            Restaurant: {card.name}
                        </Text>
                        <Text style={[styles.text, styles.tags]}>Profile: {card.user}</Text>
                        <Text style={[styles.text, styles.tags]}>Tags: {card.tags.toString()}</Text>
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={styles.card}>
                    <Text>No more options for you. Please remain in the session while your friends make their choice.</Text>
                </View>
            )

        }
    }

    const stackSize = 4;
    const ANIMATION_DURATION = 200;
    const transition = (
        <Transition.Sequence>
            <Transition.Out
                type='slide-bottom'
                durationMs={ANIMATION_DURATION}
                interpolation='easeIn'
            />
            <Transition.Together>
                <Transition.In
                    type='fade'
                    durationMs={ANIMATION_DURATION}
                    delayMs={ANIMATION_DURATION / 2}
                />
                <Transition.In
                    type='slide-bottom'
                    durationMs={ANIMATION_DURATION}
                    delayMs={ANIMATION_DURATION / 2}
                    interpolation='easeOut'
                />
            </Transition.Together>
        </Transition.Sequence>
    );

    return (
        <SafeAreaView style={styles.container}>
            {(initiator === storedEmail) && 
            <IconButton style={styles.backButton} 
            onPress={() => stopSession()}
            icon='close-thick' />}
            
            <View style={styles.swiperContainer}>             
                <Swiper
                    ref={swiperRef}
                    cardIndex={index}
                    cards={postData}
                    renderCard={card => <Card card={card} />}
                    backgroundColor={'transparent'}
                    onSwiped={() => onSwiped()}
                    onSwipedRight={() => onSwipedRight()}
                    onSwipedLeft={() => onSwipedLeft()}
                    onTapCard={() => { swiperRef.current.swipeLeft() }}
                    disableBottomSwipe={true}
                    disableTopSwipe={true}
                    cardVerticalMargin={50}
                    stackSize={stackSize}
                    stackScale={1}
                    infinite
                    animateOverlayLabelsOpacity
                    animateCardOpacity
                    overlayLabels={{
                        left: {
                            title: 'SKIP',
                            style: {
                                label: {
                                    backgroundColor: "red",
                                    borderColor: "red",
                                    color: "white",
                                    borderWidth: 1,
                                    fontSize: 24
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start',
                                    marginTop: 20,
                                    marginLeft: -20
                                }
                            }
                        },
                        right: {
                            title: 'SAVE',
                            style: {
                                label: {
                                    backgroundColor: "blue",
                                    borderColor: "blue",
                                    color: "white",
                                    borderWidth: 1,
                                    fontSize: 24
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    marginTop: 20,
                                    marginLeft: 20
                                }
                            }
                        }
                    }}
                />
            </View>
            <View style={styles.bottomContainer}>
                <Transitioning.View
                    ref={transitionRef}
                    transition={transition}
                    style={styles.bottomContainerMeta}
                >
                </Transitioning.View>
                <View style={styles.bottomContainerButtons}>
                    <MaterialCommunityIcons.Button
                        name='close'
                        size={54}
                        backgroundColor='transparent'
                        underlayColor='transparent'
                        activeOpacity={0.3}
                        color={"red"}
                        onPress={() => {
                            console.log('Swiping Left')
                            swiperRef.current.swipeLeft()
                        }}
                    />
                    <MaterialCommunityIcons.Button
                        name='heart'
                        size={54}
                        backgroundColor='transparent'
                        underlayColor='transparent'
                        activeOpacity={0.3}
                        color={"blue"}
                        onPress={() => swiperRef.current.swipeRight()}
                    />
                </View>
            </View>
            <View style={styles.userArea}>

            </View>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={1000}
                >
                Session ended! Check notifications.
            </Snackbar>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        top: 0,
        flex: 1
    },
    swiperContainer: {
        flex: 0.8
    },
    bottomContainer: {
        flex: 0.2,
        justifyContent: 'space-evenly',
        backgroundColor: 'white'
    },
    userArea: {
        backgroundColor: 'white',
    },
    bottomContainerMeta: { alignContent: 'flex-end', alignItems: 'center' },
    bottomContainerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    cardImage: {
        width: 300,
        flex: 1,
        resizeMode: 'cover'
    },
    card: {
        flex: 0.65,
        borderRadius: 8,
        shadowRadius: 25,
        shadowColor: "black",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 0 },
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        padding: 16
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        backgroundColor: 'transparent'
    },
    done: {
        textAlign: 'center',
        fontSize: 20,
        color: "white",
        backgroundColor: 'transparent'
    },
    heading: { fontSize: 24, color: "black" },
    tags: { color: "black", fontSize: 24 },

    backButton: {
        top: 0,
        left: 0,
      },
})