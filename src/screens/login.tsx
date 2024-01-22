import React, { useCallback, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

import ActionButton from '@src/components/core/actionButton';
import Button from '@src/components/core/button';
import InputText from '@src/components/core/inputText';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Login } from '@src/services/login';
import { authState, useSetRecoilState } from '@src/store';
import { theme } from '@src/theme';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const LoginScreen = () => {
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const setToken = useSetRecoilState<string>(authState);

    const handleLogin = useCallback(async () => {
        try {
            const response = await Login({
                login: email?.value,
                password: password?.value
            });
            setToken(response?.result?.session_id || '');
            await AsyncStorage.setItem(
                'Token',
                response?.result?.session_id || ''
            );
        } catch (err) {
            console.log(err);
        }
    }, [email?.value, password?.value, setToken]);

    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineLarge" style={styles.textSmartTrack}>
                Smart Tracking
            </Text>
            <View style={styles.sectionLogin}>
                <InputText
                    placeholder="Email"
                    returnKeyType="next"
                    errorText={email.error}
                    value={email.value}
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    onChangeText={(text) =>
                        setEmail({ value: text, error: '' })
                    }
                />
                <InputText
                    placeholder="Password"
                    returnKeyType="done"
                    errorText={password.error}
                    value={password.value}
                    secureTextEntry
                    onChangeText={(text) =>
                        setPassword({ value: text, error: '' })
                    }
                />
                <Button
                    mode="contained"
                    onPress={() => {
                        handleLogin();
                    }}
                >
                    Login
                </Button>
            </View>
            <View style={styles.textLogin}>
                <Text>
                    @ 2024 Retail Business Services Co.,Ltd. All Rights
                    Reserved.
                </Text>
                <Text>Line Support : va_rbs (08.30 น. - 17.30 น.)</Text>
            </View>
            <ActionButton />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textSmartTrack: {
        color: theme.colors.textPrimary,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: 40
    },
    sectionLogin: {
        padding: 16
    },
    label: {
        color: theme.colors.secondary
    },
    textLogin: {
        marginTop: 25,
        alignItems: 'center'
    }
});

export default LoginScreen;
