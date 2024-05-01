import React, { FC, useCallback, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

import ActionButton from '@src/components/core/actionButton';
import Button from '@src/components/core/button';
import InputText from '@src/components/core/inputText';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import ToastComponent from '@src/components/core/toast';
import { Login } from '@src/services/login';
import { loginState, useSetRecoilState } from '@src/store';
import { toastState } from '@src/store/toast';
import { theme } from '@src/theme';
import { LoginState, Toast } from '@src/typings/common';
import { LoginParams, SettingParams } from '@src/typings/login';
import { PublicStackParamsList } from '@src/typings/navigation';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Portal, Text } from 'react-native-paper';

type LoginScreenProps = NativeStackScreenProps<PublicStackParamsList, 'Login'>;

const LoginScreen: FC<LoginScreenProps> = (props) => {
    const { navigation } = props;
    const setLogin = useSetRecoilState<LoginState>(loginState);
    const form = useForm<LoginParams>({});
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const setToast = useSetRecoilState<Toast>(toastState);

    const handleLogin = useCallback(
        async (data: LoginParams) => {
            try {
                const response = await Login({
                    login: data?.login,
                    password: data?.password
                });
                if (
                    response?.error ||
                    data?.login === '' ||
                    data?.password === ''
                ) {
                    setVisibleDialog(true);
                    setContentDialog('Email Or Password Incorrect');
                    return;
                }
                const loginObj = {
                    session_id: response?.result?.session_id,
                    uid: response?.result?.uid
                };
                setLogin(loginObj);
                await AsyncStorage.setItem('Login', JSON.stringify(loginObj));

                const settings = await AsyncStorage.getItem('Settings');
                const jsonSettings: SettingParams = JSON.parse(settings);
                await AsyncStorage.setItem(
                    'Settings',
                    JSON.stringify({
                        ...jsonSettings,
                        login: data?.login,
                        password: data?.password
                    })
                );

                setTimeout(() => {
                    setToast({ open: true, text: 'Login Successfully' });
                }, 0);
            } catch (err) {
                console.log(err);
                setVisibleDialog(true);
                setContentDialog(`Something went wrong login`);
            }
        },
        [setLogin, setToast]
    );

    const handleCloseDialog = () => {
        setVisibleDialog(false);
    };

    const handlePressSetting = () => {
        navigation.replace('PasswordSetting');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineLarge" style={styles.textSmartTrack}>
                Smart Track
            </Text>
            <Portal>
                <AlertDialog
                    textContent={contentDialog}
                    visible={visibleDialog}
                    handleClose={handleCloseDialog}
                    handleConfirm={handleCloseDialog}
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
                    <Button mode="contained">
                        <Text variant="titleMedium" style={styles.textLogin}>
                            Login
                        </Text>
                    </Button>
                </TouchableOpacity>
            </View>
            <View style={styles.boxRetail}>
                <Text variant="bodyMedium" style={styles.textRetail}>
                    @ 2024 Retail Business Services Co.,Ltd. All Rights
                    Reserved.
                </Text>
                <Text variant="bodyMedium" style={styles.textRetail}>
                    Line Support : va_rbs (08.30 น. - 17.30 น.)
                </Text>
            </View>
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.settingButton}
                onPress={handlePressSetting}
            >
                <ActionButton icon="cog" color={theme.colors.white} />
            </TouchableOpacity>
            <ToastComponent />
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
        marginTop: 40
    },
    sectionLogin: {
        padding: 16
    },
    label: {
        color: theme.colors.secondary
    },
    textLogin: {
        color: theme.colors.white,
        fontWeight: '700'
    },
    textRetail: {
        textAlign: 'center'
    },
    boxRetail: {
        padding: 16,
        alignSelf: 'center'
    },
    settingButton: {
        zIndex: 1,
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    }
});

export default LoginScreen;
