import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssetDetail from '@src/screens/assetDetail';
import AssetScreen from '@src/screens/assets';
import HomeScreen from '@src/screens/home';
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
            <Stack.Screen
                name="Assets"
                options={{
                    headerShown: false
                }}
                component={AssetScreen}
            />
            <Stack.Screen
                name="AssetDetail"
                options={{
                    headerShown: false
                }}
                component={AssetDetail}
            />
        </Stack.Navigator>
    );
};

export default memo(PrivateStack);
