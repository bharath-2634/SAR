import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { authStateListener } from './utils/FirebaseUtils';

// Screens
import Login from './screens/authenticationscreen/login';
import Home from './screens/homescreen/home';
import Info from './screens/generalScreens/info';
import Loading from './screens/generalScreens/loading';

const Stack = createNativeStackNavigator();

// 👇 Define Authenticated Screens (Home, Info, etc.)
const AuthenticatedStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Info" component={Info} options={{ headerShown: false }}/>
  </Stack.Navigator>
);

// 👇 Define Unauthenticated Screens (Login)
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
      {isLogged ? <AuthenticatedStack /> : <UnauthenticatedStack />}
    </NavigationContainer>
  );
};

export default App;
