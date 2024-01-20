import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
// import LoginScreen from './screens/login';
import SettingScreen from './screens/setting';
const Stack = createStackNavigator();
function MyStack() {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}
            {/* <Stack.Screen component={HomeScreen} /> */}
            <Stack.Screen name="Settings" component={SettingScreen} />
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
