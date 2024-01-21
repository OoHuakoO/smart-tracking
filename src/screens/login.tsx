import React, { FC, memo, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

import ActionButton from '@src/components/core/actionButton';
import Button from '@src/components/core/button';
import InputText from '@src/components/core/inputText';
import { theme } from '@src/theme';
import { Navigation } from '@src/typings/navigattion';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface LoginScreenProps {
    navigation: Navigation;
}

const LoginScreen: FC<LoginScreenProps> = () => {
    // const {navigation} = props;
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });

    const handleLogin = () => {
        // Add your logic to save the settings (e.g., send to server, store in AsyncStorage)
        console.log('Saving settings:');
    };

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
                        handleLogin;
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

export default memo(LoginScreen);
