import React, { useCallback, useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';

import Button from '@src/components/core/button';
import TextInput from '@src/components/core/textInput';
import { authState, useSetRecoilState } from '@src/store';
import { theme } from '@src/theme';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const LoginScreen = () => {
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const setToken = useSetRecoilState<string>(authState);

    const handleLogin = useCallback(() => {
        // handle fetch api login get token and save store
        setToken('token');
    }, [setToken]);

    return (
        <SafeAreaView>
            <Text variant="headlineLarge" style={styles.textSmartTrack}>
                Smart Tracking
            </Text>
            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />
            <TouchableOpacity onPress={() => handleLogin()}>
                <Button mode="contained">Login</Button>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    textSmartTrack: {
        color: theme.colors.textPrimary,
        textAlign: 'center',
        fontWeight: '700'
    },
    label: {
        color: theme.colors.secondary
    }
});

export default LoginScreen;
