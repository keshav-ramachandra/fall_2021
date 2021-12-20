import * as Linking from 'expo-linking';


const prefix = Linking.makeUrl("/");

const config = {
  screens: {
      home: {
         screens: {
           Notifications: 'Notifications',
         },
      },
    }
}

const Linker = {
  prefixes: [prefix],
  config
}

export default Linker;