import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
// import LoginScreen from './screens/login';
import SettingScreen from './screens/setting';
// import HomeScreen from './screens/home';
const Stack = createStackNavigator();
function MyStack() {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}
            {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
            <Stack.Screen name="Settings" component={SettingScreen} />
            {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}
