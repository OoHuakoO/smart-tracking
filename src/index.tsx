import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import PrivateStack from '@src/stack/private';
import PublicStack from '@src/stack/public';
import { loginState, useRecoilState } from '@src/store';
import React, { useCallback, useEffect } from 'react';
import { RootStackParamsList } from './typings/navigation';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import { createTableAsset } from './db/asset';
import { createTableCategory } from './db/category';
import { getDBConnection } from './db/config';
import { createTableLocation } from './db/location';
import { createTableReport } from './db/report';
import { createTableUseStatus } from './db/useStatus';
import { LoginState } from './typings/common';

const Stack = createNativeStackNavigator<RootStackParamsList>();

export default function App() {
    const [login, setLogin] = useRecoilState<LoginState>(loginState);

    const getUserLogin = useCallback(async () => {
        try {
            const loginValue = await AsyncStorage.getItem('Login');
            if (loginValue !== null && loginValue !== '') {
                setLogin(JSON.parse(loginValue));
            }
        } catch (err) {
            console.log(err);
        }
    }, [setLogin]);

    const loadDataDB = useCallback(async () => {
        try {
            const db = await getDBConnection();
            await createTableAsset(db);
            await createTableLocation(db);
            await createTableUseStatus(db);
            await createTableCategory(db);
            await createTableReport(db);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const hideSplashScreen = useCallback(() => {
        setTimeout(() => {
            SplashScreen.hide();
        }, 500);
    }, []);

    useEffect(() => {
        getUserLogin();
    }, [getUserLogin, loadDataDB]);

    useEffect(() => {
        loadDataDB();
    }, [loadDataDB]);

    useEffect(() => {
        hideSplashScreen();
    }, [hideSplashScreen]);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {login?.session_id !== '' ? (
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
