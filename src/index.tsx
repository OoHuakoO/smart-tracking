import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import PrivateStack from '@src/stack/private';
import PublicStack from '@src/stack/public';
import { authState, useRecoilState } from '@src/store';
import React, { useCallback, useEffect } from 'react';
import { RootStackParamsList } from './typings/navigation';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createTableAsset } from './db/asset';
import { getDBConnection } from './db/config';
import { createTableLocation } from './db/location';
import { createTableUseStatus } from './db/useStatus';

const Stack = createNativeStackNavigator<RootStackParamsList>();

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

    const loadDataDB = useCallback(async () => {
        try {
            const db = await getDBConnection();
            await createTableAsset(db);
            await createTableLocation(db);
            await createTableUseStatus(db);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        getUserToken();
    }, [getUserToken, loadDataDB]);

    useEffect(() => {
        loadDataDB();
    }, [loadDataDB]);

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
