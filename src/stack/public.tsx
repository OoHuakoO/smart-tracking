import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@src/screens/login';
import SettingScreen from '@src/screens/setting';
import React from 'react';

const Stack = createStackNavigator();
const PublicStack = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Setting" component={SettingScreen} />
            <Stack.Screen
                name="Login"
                options={{
                    headerShown: false
                }}
                component={LoginScreen}
            />
        </Stack.Navigator>
    );
};

export default PublicStack;
