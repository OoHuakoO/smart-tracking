import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@src/screens/login';
import SettingScreen from '@src/screens/setting';
import { theme } from '@src/theme';
import { PublicStackParamsList } from '@src/typings/navigation';
import React from 'react';

const Stack = createNativeStackNavigator<PublicStackParamsList>();
const PublicStack = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Setting"
                options={{
                    title: 'Settings',
                    headerStyle: {
                        backgroundColor: theme.colors.primary
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    }
                }}
                component={SettingScreen}
            />
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
