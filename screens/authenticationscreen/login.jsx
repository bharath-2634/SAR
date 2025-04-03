import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { signIn, signUp } from '../../utils/FirebaseUtils';


export default function Login( {navigation}) {
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');

  const [create,setCreate] = useState(false);

  const handleLogin = async () => {
    try {
      await signIn(email,password);
      // navigation.replace('Home');
    }catch(error) {
      Alert.alert('Login Error', error.message);
    }
  }

  const handleSignUp = async() => {
    try {
      await signUp(email, password);
      // navigation.replace('Home');
    } catch (error) {
      Alert.alert('SignUp Error', error.message);
    }
  }

  return (
    <ImageBackground 
      source={require('../../assets/auth_bg.png')}
      style={styles.background}
    >
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.text}>Login Page</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail} 
          placeholderTextColor="#fff"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your Password"
          value={password}
          onChangeText={setPassword} 
          secureTextEntry={true}
          placeholderTextColor="#fff"
        />
        
        {
          create ? (
            <>
              <TouchableOpacity style={styles.Authbutton} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
              <Text style={styles.subText} onPress={()=>setCreate(false)}>SignUp with your Account</Text>
            </>
          ) : (
          <>
            <TouchableOpacity style={styles.Authbutton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            <Text style={styles.subText} onPress={()=>setCreate(true)}>Create an Account</Text>
          </>
        )
        }
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,  
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  logoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: '17%',
    height: '30%',
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  formContainer: {
    width: '100%',
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 80,
    padding: 20
  },
  Authbutton: {
    backgroundColor : '#000',
    color : '#fff',
    marginTop : 20,
    borderRadius : 10
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    color: '#000',
    fontSize: 28,
    fontWeight: '700'
  },
  input: {
    height: 50,
    borderColor: 'gray',
    backgroundColor: '#000', 
    color: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 10,
    placeholderTextColor: '#fff'
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    padding: 10
  },
  subText : {
    width:'100%',
    textAlign:'center'
  }
});
