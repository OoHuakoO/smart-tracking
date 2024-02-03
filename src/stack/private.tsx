import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssetDetail from '@src/screens/assetDetail';
import AssetSearch from '@src/screens/assetSearch';
import AssetScreen from '@src/screens/assets';
import Document from '@src/screens/document';
import HomeScreen from '@src/screens/home';
import Location from '@src/screens/location';
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
            <Stack.Screen
                name="AssetSearch"
                options={{
                    headerShown: false
                }}
                component={AssetSearch}
            />
            <Stack.Screen
                name="Location"
                options={{
                    headerShown: false
                }}
                component={Location}
            />
            <Stack.Screen
                name="Document"
                options={{
                    headerShown: false
                }}
                component={Document}
            />
        </Stack.Navigator>
    );
};

export default memo(PrivateStack);
