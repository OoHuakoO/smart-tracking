import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrivateStack from '@src/stack/private';
import PublicStack from '@src/stack/public';
import {
    loginState,
    OnlineState,
    useRecoilState,
    useSetRecoilState
} from '@src/store';
import React, { useCallback, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { createTableAsset } from './db/asset';
import { createTableCategory } from './db/category';
import { getDBConnection } from './db/config';
import { createTableDocumentLine } from './db/documentLineOffline';
import { createTableDocumentOffline } from './db/documentOffline';
import { createTableLocation } from './db/location';
import { createTableReportAssetNotFound } from './db/reportAssetNotFound';
import { createTableReportDocumentLine } from './db/reportDocumentLine';
import { createTableUserOffline } from './db/userOffline';
import { createTableUseStatus } from './db/useStatus';
import { LoginState } from './typings/common';
import { RootStackParamsList } from './typings/navigation';
import { getOnlineMode } from './utils/common';

const Stack = createNativeStackNavigator<RootStackParamsList>();

export default function App() {
    const [login, setLogin] = useRecoilState<LoginState>(loginState);
    const setOnlineMode = useSetRecoilState<boolean>(OnlineState);

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

    const getUserOnlineMode = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            setOnlineMode(isOnline);
        } catch (err) {
            console.log(err);
        }
    }, [setOnlineMode]);

    const loadDataDB = useCallback(async () => {
        try {
            const db = await getDBConnection();
            await createTableAsset(db);
            await createTableLocation(db);
            await createTableUseStatus(db);
            await createTableCategory(db);
            await createTableDocumentOffline(db);
            await createTableDocumentLine(db);
            await createTableReportAssetNotFound(db);
            await createTableReportDocumentLine(db);
            await createTableUserOffline(db);
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
        getUserOnlineMode();
    }, [getUserOnlineMode]);

    useEffect(() => {
        loadDataDB();
    }, [loadDataDB]);

    useEffect(() => {
        hideSplashScreen();
    }, [hideSplashScreen]);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {login?.uid ? (
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
