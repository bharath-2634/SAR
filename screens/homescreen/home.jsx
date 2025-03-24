import { useNavigation } from '@react-navigation/native'
import React, { Component } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { Text, View ,Button} from 'react-native'
import { signOut } from '../../utils/FirebaseUtils';

export default function Home()  {

    const navigation = useNavigation();

    const logOut = async() => {
      try {
          await signOut();
          navigation.replace('Login');

      }catch(error) {
        Alert.alert("Sorry Try Again Later !!");
      }
    }

  return (
    <View>
        <Button title='Logout' onPress={()=>logOut()}/>
    </View>
  )
}

const styles = StyleSheet.create({
    
})

