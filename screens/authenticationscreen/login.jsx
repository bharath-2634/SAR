import React, { Component } from 'react'
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import bg from "../../assets/auth_bg.png";

export default class login extends Component {
  render() {
    return (
      <ImageBackground 
      source={require('../../assets/auth_bg.png')}
      style={styles.background}
    >

      <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logo}></Image>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.text}>Login</Text>
      </View>
    </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,  
    resizeMode: 'cover', // Ensures the image covers the whole screen
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    height: '100%'
  },
  logoContainer : {
    width : '100%',
    display : 'flex',
    justifyContent :'center',
    alignItems : 'center'
  },
  logo : {
    width : '17%',
    height : '30%',
    borderTopRightRadius : 20,
    borderBottomLeftRadius : 20
  },
  formContainer : {
    width : '100%',
    height : '80%',
    backgroundColor : '#fff',
    borderTopLeftRadius : 80,
    padding :20
  },
  text : {
    textAlign:'center',
    fontFamily :'Poppins',
    color : '#000',
    fontSize:28,
    fontWeight : 700
  }
  
});
