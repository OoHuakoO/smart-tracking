import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    BackHandler,
    SafeAreaView,
    TouchableOpacity,
    View
} from 'react-native';

import ActionButton from '@src/components/core/actionButton';
import Button from '@src/components/core/button';
import InputText from '@src/components/core/inputText';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import ToastComponent from '@src/components/core/toast';
import { ActiveDevice, CreateDevice, Login } from '@src/services/login';
import { loginState, useSetRecoilState } from '@src/store';
import { toastState } from '@src/store/toast';
import { theme } from '@src/theme';
import { LoginState, Toast } from '@src/typings/common';
import { LoginParams, SettingParams } from '@src/typings/login';
import { PublicStackParamsList } from '@src/typings/navigation';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Portal, Text } from 'react-native-paper';

type LoginScreenProps = NativeStackScreenProps<PublicStackParamsList, 'Login'>;

const LoginScreen: FC<LoginScreenProps> = (props) => {
    let version = DeviceInfo.getVersion();
    let deviceId = DeviceInfo.getDeviceId();
    let deviceName = DeviceInfo.getDeviceName();

    const { navigation } = props;
    const setLogin = useSetRecoilState<LoginState>(loginState);
    const form = useForm<LoginParams>({});
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const setToast = useSetRecoilState<Toast>(toastState);

    const handleCreateDevice = useCallback(
        async (login: string, password: string) => {
            const response = await CreateDevice({
                login: login,
                password: password,
                mac_address: await deviceId,
                device_name: await deviceName
            });
            if (response?.error) {
                setVisibleDialog(true);
                setContentDialog('Login Failed');
                return;
            }
        },
        [deviceId, deviceName]
    );

    const handleActiveUser = useCallback(
        async (login: string, password: string) => {
            const response = await ActiveDevice({
                login: login,
                password: password,
                mac_address: await deviceId,
                device_name: await deviceName
            });
            if (response?.error) {
                setVisibleDialog(true);
                setContentDialog('Login Failed');
                return;
            }
        },
        [deviceId, deviceName]
    );

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

                handleCreateDevice(data?.login, data?.password);
                handleActiveUser(data?.login, data?.password);

                setTimeout(() => {
                    setToast({ open: true, text: 'Login Successfully' });
                }, 0);
            } catch (err) {
                console.log(err);
                setVisibleDialog(true);
                setContentDialog(`Something went wrong login`);
            }
        },
        [handleActiveUser, handleCreateDevice, setLogin, setToast]
    );

    const handleVisiblePassword = useCallback(() => {
        setIsPasswordVisible(!isPasswordVisible);
    }, [isPasswordVisible]);

    const handleCloseDialog = () => {
        setVisibleDialog(false);
    };

    const handlePressSetting = () => {
        navigation.replace('PasswordSetting');
    };

    useEffect(() => {
        const onBackPress = () => {
            BackHandler.exitApp();
            return true;
        };
        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        return () => {
            subscription.remove();
        };
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineLarge" style={styles.textSmartTrack}>
                Smart Track
            </Text>
            <Text variant="titleMedium" style={styles.textVersion}>
                Version {version}
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
                            isPasswordVisible={isPasswordVisible}
                            handleVisiblePassword={handleVisiblePassword}
                            placeholder="Password"
                            returnKeyType="done"
                            secureText
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
        marginTop: 40
    },
    textVersion: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        color: theme.colors.versionText
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
