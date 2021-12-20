import axios from "axios";
import React, { useEffect, useState, useFocusEffect } from "react";
import { ScrollView, StyleSheet, Text, Linking, Image, View, FlatList, SafeAreaView } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { server } from "../utils/server";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopNavBar from '../components/TopNavBar';

const SavedList = (props) => {

  const isFocused = useIsFocused();

  const [posts, setPosts] = useState([])
  const user = props.userData
  console.log(props)
  const [isSaved, setSaved] = useState(true)

  useEffect(() => {
    (async () => {
        const email = await AsyncStorage.getItem('email');
        await axios.get(server + 'posts/get_saved_list', {
            params: {
                user_email: email
            }
    })
    .then(data => {
        
        setPosts(data.data)
        if (data.data.length != 0) {
            setSaved(true)
        } else {
            setSaved(false)
        }
        console.log('Setting saved posts state\n',isSaved)
    })
    .catch(error => console.log(error))

    })()
}, [props, isFocused])



const remove = (post_id, user_id) => {
    axios.get(server + 'posts/remove_saved', {
        params: {
            user_id: user_id,
            post_id: post_id
        }
    })
    .then(data => {
        setPosts(data.data)
    })
    .catch(error => console.log(error))
}

const renderSaved = ({item}) => {
    return(
        <Card style = {styles.cardStyle}>
            <View style = {styles.row}>
            <Image source={{ uri: server + 'media/' + item.image_url }} style={styles.cardImage} />
            <View style={ styles.cardContent }>
            <Text>User: {item.profile}</Text>
            <Text>Restaurant: {item.restaurant}</Text>
            <Text>Food type: {item.food_type.toString()}</Text>
            <Text style={{   
            color: 'blue',
            textDecorationLine: 'underline'   
            }} 
            onPress={ ()=> Linking.openURL(item.rest_url) }>Visit the restaurant's website</Text> 
            </View>
            </View>
            <Button
            mode="contained"
            name="remove"
            style={styles.deleteButton}
            backgroundColor="white"
            onPress={() => remove(item.post_id, user.email)}
            >
                remove
            </Button>
        </Card>
    )
}

return (
    <SafeAreaView style={{flex: 1}}>
    {console.log('Where it matters the most', isSaved)}
        {isSaved && <FlatList
            data={posts}
            renderItem = {renderSaved}
            keyExtractor = {(item) => item.post_id.toString()} 
        />}
        {!isSaved && <View style={styles.emptyText}>
            <Text>There are no posts saved</Text>
        </View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    emptyText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black'
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
        height: '100%',
        width: '100%',
        borderRadius: 5,
        flex: 2
      },
    cardContent: {
        flex: 3,
        margin: 10
    },
    deleteButton: {
        marginRight: 10,
        backgroundColor: "red",
        alignSelf: 'center',
        width: '90%',
        borderRadius: 5,
        flex: 1,
        margin: 10
    }
});

export default SavedList;
