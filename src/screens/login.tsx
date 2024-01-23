import React, { FC, useCallback, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

import ActionButton from '@src/components/core/actionButton';
import Button from '@src/components/core/button';
import InputText from '@src/components/core/inputText';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import { Login } from '@src/services/login';
import { authState, useSetRecoilState } from '@src/store';
import { theme } from '@src/theme';
import { LoginParams } from '@src/typings/login';
import { PublicStackParamsList } from '@src/typings/navigation';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Portal, Text } from 'react-native-paper';

type LoginScreenProps = NativeStackScreenProps<PublicStackParamsList, 'Login'>;

const LoginScreen: FC<LoginScreenProps> = (props) => {
    const { navigation } = props;
    const setToken = useSetRecoilState<string>(authState);
    const form = useForm<LoginParams>({});
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [textDialog, setTextDialog] = useState<string>('');

    const handleLogin = useCallback(
        async (data: LoginParams) => {
            try {
                const response = await Login({
                    login: data?.login,
                    password: data?.password
                });
                if (response?.error) {
                    setVisibleDialog(true);
                    setTextDialog('Email Or Password Incorrect');
                    return;
                }
                setToken(response?.result?.session_id || '');
                await AsyncStorage.setItem(
                    'Token',
                    response?.result?.session_id || ''
                );
            } catch (err) {
                setVisibleDialog(true);
                setTextDialog('Network Error');
            }
        },
        [setToken]
    );

    const handleCloseDialog = () => {
        setVisibleDialog(false);
    };

    const handlePressSetting = () => {
        navigation.replace('Setting');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineLarge" style={styles.textSmartTrack}>
                Smart Tracking
            </Text>
            <Portal>
                <AlertDialog
                    titleText={'Warning'}
                    textContent={textDialog}
                    visible={visibleDialog}
                    handleClose={handleCloseDialog}
                    children={''}
                />
            </Portal>
            <View style={styles.sectionLogin}>
                <Controller
                    name="login"
                    defaultValue=""
                    control={form?.control}
                    render={({ field }) => (
                        <InputText
                            {...field}
                            placeholder="Email"
                            returnKeyType="next"
                            autoCapitalize="none"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                            onChangeText={(value) => field?.onChange(value)}
                        />
                    )}
                />
                <Controller
                    name="password"
                    defaultValue=""
                    control={form?.control}
                    render={({ field }) => (
                        <InputText
                            {...field}
                            placeholder="Password"
                            returnKeyType="done"
                            secureTextEntry
                            onChangeText={(value) => field?.onChange(value)}
                        />
                    )}
                />
                <TouchableOpacity onPress={form?.handleSubmit(handleLogin)}>
                    <Button mode="contained">Login</Button>
                </TouchableOpacity>
            </View>
            <View style={styles.textLogin}>
                <Text>
                    @ 2024 Retail Business Services Co.,Ltd. All Rights
                    Reserved.
                </Text>
                <Text>Line Support : va_rbs (08.30 น. - 17.30 น.)</Text>
            </View>
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.settingButton}
                onPress={handlePressSetting}
            >
                <ActionButton icon={'cog'} />
            </TouchableOpacity>
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
        marginBottom: 40,
        fontFamily: 'DMSans',
        marginTop: 40
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
    },
    settingButton: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    }
});

export default LoginScreen;
