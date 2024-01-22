import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@src/screens/home';
import SettingScreen from '@src/screens/setting';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { memo } from 'react';

const Stack = createNativeStackNavigator<PrivateStackParamsList>();
const PrivateStack = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                options={{
                    headerShown: false
                }}
                component={HomeScreen}
            />
            <Stack.Screen name="Setting" component={SettingScreen} />
        </Stack.Navigator>
    );
};

export default memo(PrivateStack);
