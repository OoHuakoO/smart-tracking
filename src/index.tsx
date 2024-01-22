import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PrivateStack from '@src/stack/private';
import { authState, useRecoilState } from '@src/store';
import React, { useCallback, useEffect } from 'react';
import PublicStack from './stack/public';

const Stack = createStackNavigator();

export default function App() {
    const [token, setToken] = useRecoilState<string>(authState);

    const getUserToken = useCallback(async () => {
        try {
            const tokenValue = await AsyncStorage.getItem('Token');
            if (tokenValue !== null && tokenValue !== '') {
                setToken(tokenValue);
            }
        } catch (err) {
            console.log(err);
        }
    }, [setToken]);

    useEffect(() => {
        // getUserToken();
    }, [getUserToken]);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {token !== '' ? (
                    <Stack.Screen
                        options={{
                            headerShown: false
                        }}
                        name="PrivateStack"
                        component={PrivateStack}
                    />
                ) : (
                    <Stack.Screen
                        options={{
                            headerShown: false
                        }}
                        name="PublicStack"
                        component={PublicStack}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
