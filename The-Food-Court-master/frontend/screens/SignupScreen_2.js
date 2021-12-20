import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import {
  View,
  CheckBox,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { isValidDate, updateError, isValidMobile } from "../utils/Validation";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SignupScreen_2 = (props) => {
  
  const user_name = props.route.params.User.user_name;

  const password = props.route.params.User.password;

  const email = props.route.params.User.email;
  
  const [firstname, setFirstName] = useState("");
  
  const [lastname, setLastName] = useState("");

  const [mobileno, setMobileno] = useState("");

  const [error, setError] = useState([]);

  const errormsgs = []

  const [dateofbirth, setDateOfBirth] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (dateofbirth) => {
    const year = dateofbirth.getFullYear()
    const month = dateofbirth.getMonth() + 1
    const date = dateofbirth.getDate()
    const datestr = year + '-' + month + '-' + date
    setDateOfBirth(datestr);
    hideDatePicker();
  };

  const isValidForm = () => {
    if (!firstname.trim()) errormsgs.push("First name can't be empty\n")
    if (!lastname.trim()) errormsgs.push("Last name can't be empty\n");
    if (!mobileno.trim() || !isValidMobile(mobileno))
      errormsgs.push("Mobile no should be 10 digits \n");
    if (!isValidDate(dateofbirth)) errormsgs.push("Not a valid date of birth\n");

    if (errormsgs.length == 0) return true;
    else return updateError(errormsgs, setError)
  };

  const sendCred = async (props) => {
    const User = {
      user_name : user_name,
      email : email,
      password : password,
      first_name:firstname,
      last_name: lastname,
      mobileno:mobileno,
      dateofbirth:dateofbirth
    }
    
    if (isValidForm()) {
      try {
        props.navigation.navigate(
          'signup_3',
          { User },
        );
      } catch (err) {
        console.log(err);
        return updateError("User already exists! Try another email", setError);
      }
    }
  };

  return (
    <>
      <KeyboardAvoidingView behavior="position">
        <StatusBar backgroundColor="#26C49E" barStyle="light-content" />

        <Text
          style={{
            fontSize: 22,
            textAlign:"center",
            marginTop: 65,
            color: "black",
          }}
        >
          Fill in your bio to get started
        </Text>

        <Text
          style={{
            fontSize: 15,
            marginLeft: 10,
            marginTop: 65,
            color: "black",
          }}
        >
        This data will be displayed in your account profile for security
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
        
        <TextInput
          label="First Name *"
          mode="outlined"
          value={firstname}
          onChangeText={(text) => setFirstName(text)}
          style={{ marginLeft: 18, marginRight: 18, height: 40, marginTop: 18 }}
          theme={{ colors: { primary: "red" } }}
        />

        <TextInput
          label="Last Name *"
          mode="outlined"
          value={lastname}
          onChangeText={(text) => setLastName(text)}
          style={{ marginLeft: 18, marginRight: 18, height: 40, marginTop: 18 }}
          theme={{ colors: { primary: "red" } }}
        />
        <TextInput
          label="Mobile No *"
          mode="outlined"
          value={mobileno}
          onChangeText={(text) => setMobileno(text)}
          style={{ marginLeft: 18, marginRight: 18, height: 40, marginTop: 18 }}
          theme={{ colors: { primary: "red" } }}
        />
        
        <View>
          <TextInput
            value={dateofbirth}
            placeholder="Date..."
            label="Date of Birth: YYYY-MM-DD *"
            mode="outlined"
            onChangeText={(text) => setDateOfBirth(text)}
            style={{ marginLeft: 18, marginRight: 18, height: 40, marginTop: 18 }}
            theme={{ colors: { primary: "red" } }}
          />
          <Button onPress={showDatePicker} title="Set Date" 
            style={{ marginLeft: 18, marginRight: 18, height: 40, marginTop: 18, backgroundColor: "#26C49E" }} > pick date </Button>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>

        <Button
          mode="contained"
          style={{
            marginTop: 20,
            marginLeft: 120,
            marginRight: 120,
            borderRadius: 10,
            backgroundColor: "#26C49E",
            height: 40,
          }}
          onPress={() => sendCred(props)}
        >
          next
        </Button>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignupScreen_2;
