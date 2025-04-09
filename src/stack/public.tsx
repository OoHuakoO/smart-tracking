import { NavigationProp, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import LoginScreen from '@src/screens/login';
import PasswordSettingScreen from '@src/screens/passwordSetting';
import SettingScreen from '@src/screens/setting';
import { theme } from '@src/theme';
import { PublicStackParamsList } from '@src/typings/navigation';
import React, { useCallback } from 'react';
import { isTablet } from 'react-native-device-info';

const Stack = createNativeStackNavigator<PublicStackParamsList>();

const PublicStack = () => {
    const navigation = useNavigation<NavigationProp<PublicStackParamsList>>();
    const BackButtonComponent = useCallback(
        () => (
            <BackButton
                handlePress={() => {
                    navigation.navigate('Login');
                }}
            />
        ),
        [navigation]
    );

    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Setting"
                options={{
                    title: 'Settings',
                    headerStyle: {
                        backgroundColor: theme.colors.primary
                    },
                    headerTintColor: theme.colors.white,
                    headerTitleStyle: {
                        fontFamily: 'DMSans-Bold',
                        fontSize: isTablet() ? 35 : 20
                    },
                    headerLeft: BackButtonComponent
                }}
                component={SettingScreen}
            />
            <Stack.Screen
                name="PasswordSetting"
                options={{
                    headerShown: false
                }}
                component={PasswordSettingScreen}
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
