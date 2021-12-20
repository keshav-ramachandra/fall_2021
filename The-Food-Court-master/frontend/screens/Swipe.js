import React,{useState,useEffect} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions
} from 'react-native';
import data from './data';
import Swiper from 'react-native-deck-swiper';
import { Transitioning, Transition, log } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { server } from "../utils/server";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get('window');

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

const swiperRef = React.createRef();
const transitionRef = React.createRef();

const Card = ({ card }) => {
  const d = new Date()
  if(card){
    // console.log(d,"Hello")
  return (
    <View style={styles.card}>
      <Image source={{ uri: server + 'media/' + card.image }} style={styles.cardImage} />
      <View style={{ alignItems: 'center' }}>
      <Text style={[styles.text, styles.heading]} numberOfLines={2}>
        Restaurant: {card.name}
      </Text>
      <Text style={[styles.text, styles.tags]}>Profile: {card.user}</Text>
      <Text style={[styles.text, styles.tags]}>Tags: {card.tags.toString()}</Text>
      {card.dist && <Text style={[styles.text, styles.tags]}>{card.dist} miles away</Text>}
      {card.operating_hours && 
      <Text style={[styles.text, styles.tags]}>{card.operating_hours.split(",")[d.getDay()].slice(card.operating_hours.split(",")[d.getDay()].indexOf(':') + 2).trim()}</Text>
      }
    </View>
    </View>
  );
}
else{
  // console.log("empty")
  return (
    <View style={styles.card}>
      <Text>Sorry, we're fresh out of swipes. The kitchen is working on more, so check back soon!</Text>
    </View>
    )

}
}


export default function Swipe(props) {
  const isFocused = useIsFocused();
  const [newdata, setData] = React.useState([])
  
  const [index, setIndex] = React.useState(0);
  
    // console.log(props.foodtag, props.rest_filter, props.location)
  const {userdata}=props;
  useEffect(()=>{
    (async () => {
    const email = await AsyncStorage.getItem('email')
    // console.log(props);
    // console.log(props.foodtag,"mohit ayaaaaaaaaa")
      axios.get(server + 'posts/get_posts', {
      params: {
          // user: props.userdata.email,
          foodtag:props.foodtag,
          rest_filter: props.rest_filter,
          location:props.location,
          radius:props.radius,
          checked:props.checked,
          user: email
      }
      }).then(res => {
        const resdata = res.data
        // console.log(resdata, 'res');
        setData(resdata)
        console.log(newdata, 'Setting newdata state')
      })
      .catch(err=>{
        console.log(err);
      })
    })()
  },[props.radius,props.location,props.checked,props.rest_filter,props.foodtag,isFocused]);
    
    // console.log(newdata)

  const onSwiped = () => {
    // var values = Object.keys(newdata).map(function (key) { return newdata[key]; });
    // console.log('values', values);
    // transitionRef.current.animateNextTransition();
    console.log(newdata, 'Setting newdata state-1')
    setIndex((index + 1) % newdata.length);
    // console.log('idx', index)
    // console.log(newdata[index])
  };

  const addtoSavedList = () => {
    axios.get(server + 'posts/add_saved', {
        params: {
          user_email: props.userdata.email,
            post_id: newdata[index].id
            // get post_id from parent
        }
    })
    .then(data => {
        // console.log('saved', data)
    })
    .catch(error => console.log(error))
  }

  const swipeLeft = () => {
    axios.get(server + 'posts/left_swipe', {
        params: {
          user_email: props.userdata.email,
          post_id: newdata[index].id
        }
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => console.log(error))
  }

  // const data=newdata
  
  return (
    <SafeAreaView style={styles.container}>
      {/* <ModalFilter /> */}
      <StatusBar hidden={true} />
      <View style={styles.swiperContainer}>
        {/* {console.log('Naya data aaya kya', newdata)} */}
        <Swiper
          ref={swiperRef}
          cards={newdata}
          cardIndex={index}
          renderCard={card => <Card card={card} />}
          backgroundColor={'transparent'}
          onSwiped={onSwiped}
          onSwipedRight={() => addtoSavedList()}
          onSwipedLeft={() => swipeLeft()}
          onTapCard={() => swiperRef.current.swipeLeft()}
          cardVerticalMargin={50}
          stackSize={stackSize}
          stackScale={1}
          infinite
          verticalSwipe={false}
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
          {/* <CardDetails index={index} /> */}
        </Transitioning.View>
        <View style={styles.bottomContainerButtons}>
          <MaterialCommunityIcons.Button
            name='close'
            size={54}
            backgroundColor='transparent'
            underlayColor='transparent'
            activeOpacity={0.3}
            color={"red"}
            onPress={() => swiperRef.current.swipeLeft()}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    flex: 1
  },
  swiperContainer: {
    flex: 0.85
  },
  bottomContainer: {
    flex: 0.2,
    justifyContent: 'space-evenly'
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
  heading: { fontSize: 24,color: "black" },
  tags: { color: "black", fontSize: 18}
});