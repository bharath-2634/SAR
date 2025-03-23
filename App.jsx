import React from 'react';
import { Text, View } from 'react-native';
import Login from './screens/authenticationscreen/login';  // Adjust path if needed

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <Login />
      {/* <Text style={{color: 'black'}}>Hello</Text> */}
    </View>
  );
};

export default App;
