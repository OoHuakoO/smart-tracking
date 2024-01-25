import { NavigationProp, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import LoginScreen from '@src/screens/login';
import SettingScreen from '@src/screens/setting';
import { theme } from '@src/theme';
import { PublicStackParamsList } from '@src/typings/navigation';
import React, { useCallback } from 'react';

const Stack = createNativeStackNavigator<PublicStackParamsList>();

const PublicStack = () => {
    const navigation = useNavigation<NavigationProp<PublicStackParamsList>>();
    const BackButtonComponent = useCallback(
        () => (
            <BackButton
                size={20}
                color={theme.colors.white}
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
                        fontWeight: 'bold'
                    },
                    headerLeft: BackButtonComponent
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
