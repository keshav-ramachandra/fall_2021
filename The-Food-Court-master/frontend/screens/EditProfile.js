import { Avatar, TextInput, Button, FAB, Card, Paragraph, IconButton } from "react-native-paper";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../utils/server";
import { useIsFocused } from "@react-navigation/core";
import { isValidDate, updateError } from "../utils/Validation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProfile(props) {
  // const user = props.route.params.userData
  const isFocused = useIsFocused();
  const [userdetails, setUSerDetail] = useState([])
  useEffect(() => {
    // console.log('useffect')
    (async () => {
      const email = await AsyncStorage.getItem('email')
      axios.get(server + 'auth/get_user', {
        params: {
          user_email: email
        }
      })
        .then(data => {
          // console.log(data)
          setUSerDetail(data.data)
        })
        .catch(error => console.log(error))
    })()
  }, [isFocused])
  console.log("Edit Profile User Details State", userdetails)

  const [username, setUserName] = useState();
  const [firstname, setFirstName] = useState();

  const [lastname, setLastName] = useState();

  const [mobileno, setMobileno] = useState();

  useEffect(
    () => {
      setUserName(userdetails.user_name);
      setFirstName(userdetails.first_name);
      setLastName(userdetails.last_name);
      setMobileno(userdetails.phone_number);
    },
    [userdetails]
  );

  // console.log(username);
  const [upUser, setNewUser] = useState();
  const [error, setError] = useState("");

  const errormsgs = []

  const isValidForm = () => {
    // console.log(firstname)
    if (!username.trim()) errormsgs.push("Username can't be empty\n");
    // if (!firstname.trim()) errormsgs.push("First name can't be empty\n");
    // if (!lastname.trim()) errormsgs.push("Last name can't be empty\n");
    // if (!mobileno.trim()) errormsgs.push("Mobile no can't be empty\n");
    if (mobileno.trim() && (mobileno.length < 10 || mobileno.length > 10))
      errormsgs.push("Mobile no must be 10 characters!\n");
    if (errormsgs.length == 0) return true;
    else return updateError(errormsgs, setError)
  };

  const sendCred = async (props) => {
    // console.log("in!!")(async () => {
    const email = await AsyncStorage.getItem('email')
    if (isValidForm()) {
      try {
        const User = {
          email: email,
          user_name: username,
          first_name: firstname,
          last_name: lastname,
          phone_number: mobileno
        }
        //JSON encoded while passing body and handled in backEnd
        await axios.post(server + `auth/update`, JSON.stringify(User))
          .then(async (res) => {
            console.log(res.data)
            setNewUser(res.data)
            props.navigation.navigate("userprofile")
            // return updateError("Success", setError);
          }).catch(err => {
            console.log(err);
            return updateError(err.response.data, setError);
          })

      } catch (err) {
        console.log(err);
        return updateError("User already exists! Try another email", setError);
      }
    }
  };

  return (
    <SafeAreaView style={styles.biggerContainer}>
      <IconButton
        icon="arrow-left"
        color="#26C49E"
        size={20}
        onPress={() => {
          props.navigation.navigate("userprofile");
        }}
      />
      <View style={styles.editUserInfoContainer}>
        <View style={styles.editUserProfileImage}>
          <Avatar.Image size={150} source={{ uri: server + 'media/' + userdetails.profile_photo_url }} />
          <FAB
            style={styles.userProfileFAB}
            small
            icon="pencil-outline"
            onPress={() => props.navigation.navigate('updateimage', { userdetails })}
          />
        </View>
        {error ? (
          <Text
            style={styles.errorStyle}
          >
            {error}
          </Text>
        ) : null}

        <TextInput mode="outlined" label="User Name" value={username} onChangeText={(text) => setUserName(text)} style={styles.changeTextField} />
        <TextInput mode="outlined" label="First Name " value={firstname} onChangeText={(text) => setFirstName(text)} style={styles.changeTextField} />
        <TextInput mode="outlined" label="Last Name" value={lastname} onChangeText={(text) => setLastName(text)} style={styles.changeTextField} />
        <TextInput mode="outlined" label="Phone No" value={mobileno} onChangeText={(text) => setMobileno(text)} style={styles.changeTextField} />
        <Button mode="contained" style={styles.submitButtonField} onPress={() => sendCred(props)}>Submit</Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  biggerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  editUserInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  editUserProfileImage: {
    marginBottom: 16
  },
  userProfileFAB: {
    position: 'absolute',
    backgroundColor: '#26C49E',
    right: 0,
    bottom: 0,
  },
  changeTextField: {
    width: '80%',
    marginBottom: 8
  },
  submitButtonField: {
    marginTop: 16,
    width: '80%',
    backgroundColor: '#26C49E'
  },
  errorStyle: {
    color: "red",
    fontSize: 14,
    marginTop: 15,
    textAlign: "center",
  }
});