import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    BackHandler,
    Dimensions,
    Keyboard,
    SafeAreaView,
    TouchableOpacity,
    View
} from 'react-native';

import ActionButton from '@src/components/core/actionButton';
import Button from '@src/components/core/button';
import InputText from '@src/components/core/inputText';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import ToastComponent from '@src/components/core/toast';
import PopupDeviceLogin from '@src/components/views/popupDeviceLogin';
import PopupSelectModeCompany from '@src/components/views/popupSelectModeCompany';
import { getDBConnection } from '@src/db/config';
import { getUserOffline } from '@src/db/userOffline';
import {
    ActiveDevice,
    CheckActiveDevice,
    CreateDevice,
    Login
} from '@src/services/login';
import {
    loginState,
    OnlineState,
    PrivilegeCompanyState,
    useSetRecoilState
} from '@src/store';
import { toastState } from '@src/store/toast';
import { theme } from '@src/theme';
import { LoginState, Toast } from '@src/typings/common';
import { LoginParams, SettingParams } from '@src/typings/login';
import { PublicStackParamsList } from '@src/typings/navigation';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Text } from 'react-native-paper';

type LoginScreenProps = NativeStackScreenProps<PublicStackParamsList, 'Login'>;

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768 && height >= 768;

const LoginScreen: FC<LoginScreenProps> = (props) => {
    let version = DeviceInfo.getVersion();
    let deviceId = DeviceInfo.getDeviceId();
    let deviceName = DeviceInfo.getDeviceName();
    const { navigation } = props;
    const setLogin = useSetRecoilState<LoginState>(loginState);
    const setPrivilegeCompany = useSetRecoilState<string>(
        PrivilegeCompanyState
    );
    const form = useForm<LoginParams>({});
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [visiblePopupSelectModeCompany, setVisiblePopupSelectModeCompany] =
        useState<boolean>(false);
    const [visiblePopupDeviceLogin, setVisiblePopupDeviceLogin] =
        useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [modeCompany, setModeCompany] = useState<string>('Online');
    const [modeDeviceLogin, setModeDeviceLogin] = useState<string>('Yes');
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const setToast = useSetRecoilState<Toast>(toastState);
    const setOnlineState = useSetRecoilState<boolean>(OnlineState);

    const { isConnected } = useNetInfo();

    const handleCreateDevice = useCallback(
        async (login: string, password: string) => {
            try {
                const response = await CreateDevice({
                    login: login,
                    password: password,
                    mac_address: await deviceId,
                    device_name: await deviceName
                });
                if (response?.error) {
                    throw response?.error;
                }
            } catch (err) {
                throw err;
            }
        },
        [deviceId, deviceName]
    );

    const handleActiveUser = useCallback(
        async (login: string, password: string) => {
            try {
                const response = await ActiveDevice({
                    login: login,
                    password: password,
                    mac_address: await deviceId,
                    device_name: await deviceName
                });
                if (response?.error) {
                    throw response?.error;
                }
            } catch (err) {
                throw err;
            }
        },
        [deviceId, deviceName]
    );

    const handleCheckActiveDevice = useCallback(
        async (login: string, password: string): Promise<boolean> => {
            try {
                const response = await CheckActiveDevice({ login, password });
                if (response?.error) {
                    throw response.error;
                }
                if (
                    response?.result?.data?.mac_address &&
                    response?.result?.data?.mac_address !== (await deviceId) &&
                    response?.result?.data?.user_active
                ) {
                    Keyboard.dismiss();
                    setVisiblePopupDeviceLogin(true);
                    return true;
                }
                return false;
            } catch (err) {
                throw err;
            }
        },
        [deviceId]
    );

    const handleCheckPrivilegeCompany = useCallback(async () => {
        try {
            /// fetch api PrivilegeCompany
            const privilege = 'Online/Offline';
            await AsyncStorage.setItem('PrivilegeCompany', privilege);
            setPrivilegeCompany(privilege);
            return privilege;
        } catch (err) {
            throw err;
        }
    }, [setPrivilegeCompany]);

    const handleOfflineLogin = useCallback(
        async (data: LoginParams) => {
            try {
                handleCreateDevice(data?.login, data?.password);
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
                    session_id: '',
                    uid: response?.result?.uid
                };
                setLogin(loginObj);
                setOnlineState(false);
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
                await AsyncStorage.setItem('Online', JSON.stringify(false));
                await AsyncStorage.setItem('Login', JSON.stringify(loginObj));
                setTimeout(() => {
                    setToast({ open: true, text: 'Login Successfully' });
                }, 0);
            } catch (err) {
                throw err;
            }
        },
        [handleCreateDevice, setLogin, setOnlineState, setToast]
    );

    const handleOnlineLogin = useCallback(
        async (data: LoginParams, forceLogin?: boolean) => {
            try {
                if (!forceLogin) {
                    const foundActiveDevice = await handleCheckActiveDevice(
                        data?.login,
                        data?.password
                    );
                    if (foundActiveDevice) {
                        return;
                    }
                }
                handleCreateDevice(data?.login, data?.password);
                handleActiveUser(data?.login, data?.password);
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
                    session_id: '',
                    uid: response?.result?.uid
                };
                setLogin(loginObj);
                setOnlineState(true);
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
                await AsyncStorage.setItem('Online', JSON.stringify(true));
                await AsyncStorage.setItem('Login', JSON.stringify(loginObj));
                setTimeout(() => {
                    setToast({ open: true, text: 'Login Successfully' });
                }, 0);
            } catch (err) {
                throw err;
            }
        },
        [
            handleActiveUser,
            handleCheckActiveDevice,
            handleCreateDevice,
            setLogin,
            setOnlineState,
            setToast
        ]
    );

    const handleLogin = useCallback(
        async (data: LoginParams) => {
            try {
                const privilege = await handleCheckPrivilegeCompany();
                if (privilege === 'Online') {
                    await handleOnlineLogin(data);
                } else {
                    Keyboard.dismiss();
                    setVisiblePopupSelectModeCompany(true);
                }
            } catch (err) {
                console.log(err);
                setVisibleDialog(true);
                setContentDialog(`Something went wrong login`);
            }
        },
        [handleCheckPrivilegeCompany, handleOnlineLogin]
    );

    const handleConfirmSelectModeCompany = useCallback(async () => {
        try {
            if (modeCompany === 'Online') {
                await handleOnlineLogin({
                    login: form.getValues('login'),
                    password: form.getValues('password')
                });
            } else {
                if (isConnected) {
                    await handleOfflineLogin({
                        login: form.getValues('login'),
                        password: form.getValues('password')
                    });
                } else {
                    const db = await getDBConnection();
                    const filter = {
                        email: form.getValues('login')
                    };
                    const userOffline = await getUserOffline(db);
                    if (userOffline.length > 0) {
                        const userLoginOffline = await getUserOffline(
                            db,
                            filter
                        );
                        if (userLoginOffline.length > 0) {
                            const loginObj = {
                                session_id: '',
                                uid: userLoginOffline[0]?.user_id
                            };
                            setLogin(loginObj);
                            setOnlineState(false);
                            const settings = await AsyncStorage.getItem(
                                'Settings'
                            );
                            const jsonSettings: SettingParams =
                                JSON.parse(settings);
                            await AsyncStorage.setItem(
                                'Settings',
                                JSON.stringify({
                                    ...jsonSettings,
                                    login: form.getValues('login'),
                                    password: form.getValues('password')
                                })
                            );
                            await AsyncStorage.setItem(
                                'Online',
                                JSON.stringify(false)
                            );
                            await AsyncStorage.setItem(
                                'Login',
                                JSON.stringify(loginObj)
                            );
                            setTimeout(() => {
                                setToast({
                                    open: true,
                                    text: 'Login Successfully'
                                });
                            }, 0);
                        } else {
                            setVisibleDialog(true);
                            setContentDialog(
                                `The user you are login is not found.`
                            );
                        }
                    } else {
                        setVisibleDialog(true);
                        setContentDialog(
                            `Please connect to the internet to login and download data before login without internet.`
                        );
                    }
                }
            }
            setVisiblePopupSelectModeCompany(false);
        } catch (err) {
            console.log(err);
            setVisibleDialog(true);
            setContentDialog(`Something went wrong login`);
        }
    }, [
        form,
        handleOfflineLogin,
        handleOnlineLogin,
        isConnected,
        modeCompany,
        setLogin,
        setOnlineState,
        setToast
    ]);

    const handleConfirmDeviceLogin = useCallback(() => {
        if (modeDeviceLogin === 'Yes') {
            handleOnlineLogin(
                {
                    login: form.getValues('login'),
                    password: form.getValues('password')
                },
                true
            );
        } else {
            setVisiblePopupDeviceLogin(false);
        }
    }, [form, handleOnlineLogin, modeDeviceLogin]);

    const handleChangeModeCompany = useCallback((value: string) => {
        setModeCompany(value);
    }, []);

    const handleChangeModeDeviceLogin = useCallback((value: string) => {
        setModeDeviceLogin(value);
    }, []);

    const handleVisiblePassword = useCallback(() => {
        setIsPasswordVisible(!isPasswordVisible);
    }, [isPasswordVisible]);

    const handleCloseDialog = () => {
        setVisibleDialog(false);
    };

    const handleClosePopupSelectModeCompany = () => {
        setVisiblePopupSelectModeCompany(false);
    };

    const handleClosePopupDeviceLogin = () => {
        setVisiblePopupDeviceLogin(false);
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
            <AlertDialog
                textContent={contentDialog}
                visible={visibleDialog}
                handleClose={handleCloseDialog}
                handleConfirm={handleCloseDialog}
            />
            <PopupSelectModeCompany
                visible={visiblePopupSelectModeCompany}
                modeCompany={modeCompany}
                handleClose={handleClosePopupSelectModeCompany}
                handleConfirm={handleConfirmSelectModeCompany}
                handleChangeModeCompany={handleChangeModeCompany}
            />
            <PopupDeviceLogin
                visible={visiblePopupDeviceLogin}
                modeDeviceLogin={modeDeviceLogin}
                handleClose={handleClosePopupDeviceLogin}
                handleConfirm={handleConfirmDeviceLogin}
                handleChangeModeDeviceLogin={handleChangeModeDeviceLogin}
            />
            <Text variant="headlineLarge" style={styles.textSmartTrack}>
                Smart Track
            </Text>
            <Text variant="titleMedium" style={styles.textVersion}>
                Version {version}
            </Text>
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
        fontFamily: 'DMSans-Bold',
        marginTop: 40,
        fontSize: isTablet ? 38 : 25
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
