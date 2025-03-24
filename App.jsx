import React from 'react';
import { Text, View } from 'react-native';
import Login from './screens/authenticationscreen/login';
import Home from './screens/homescreen/home';
import Loading from './screens/generalScreens/loading';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
      // <View style={{ flex: 1 }}>
      //  <Login/>
      //  {/* <Home/> */}
       
      //  {/* <Loading/> */}
      // </View>

    
  );
};

export default App;
