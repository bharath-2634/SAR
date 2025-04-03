import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { authStateListener } from './utils/FirebaseUtils';
import Login from './screens/authenticationscreen/login';
import Home from './screens/homescreen/home';
import Info from './screens/generalScreens/info';
import Loading from './screens/generalScreens/loading';
import Products from './screens/Products/products';
import { StyleSheet } from 'react-native';
import CartScreen from './screens/Products/cart';
// import ProductDetectionCamera from './screens/Products/objectDetection';

const Stack = createNativeStackNavigator();

const AuthenticatedStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Info" component={Info} options={{ headerShown: false }}/>
    <Stack.Screen name="Products" component={Products} options={{ headerShown: false }}/>
    <Stack.Screen name="CartScreen" component={CartScreen}/>
  </Stack.Navigator>
);

const UnauthenticatedStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const App = () => {
  const [isLogged, setIsLogged] = useState(null);

  useEffect(() => {
    const unsubscribe = authStateListener((user) => {
      setIsLogged(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isLogged === null) return <Loading />;

  return (
    <NavigationContainer>
      {/* {isLogged && <ProductDetectionCamera style={styles.backgroundCamera} />} */}
      {isLogged ? <AuthenticatedStack /> : <UnauthenticatedStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  backgroundCamera: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});

export default App;
