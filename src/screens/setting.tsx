import React, { FC, useCallback, useEffect } from 'react';

import InputText from '@src/components/core/inputText';
import { theme } from '@src/theme';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ToastComponent from '@src/components/core/toast';
import { useSetRecoilState } from '@src/store';
import { toastState } from '@src/store/toast';
import { Toast } from '@src/typings/common';
import { SettingParams } from '@src/typings/login';
import { PublicStackParamsList } from '@src/typings/navigation';
import { Controller, useForm } from 'react-hook-form';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type SettingScreenProps = NativeStackScreenProps<
    PublicStackParamsList,
    'Setting'
>;

const SettingScreen: FC<SettingScreenProps> = (props) => {
    const { navigation } = props;
    const form = useForm<SettingParams>({});
    const setToast = useSetRecoilState<Toast>(toastState);
    const handleSaveSettings = useCallback(
        async (data: SettingParams) => {
            try {
                await AsyncStorage.setItem('Settings', JSON.stringify(data));
                navigation.navigate('Login');
                setTimeout(() => {
                    setToast({ open: true, text: 'Save Setting Successfully' });
                }, 0);
            } catch (err) {
                console.log(err);
            }
        },
        [navigation, setToast]
    );

    const handleInitSetting = useCallback(async () => {
        const settings = await AsyncStorage.getItem('Settings');
        const jsonSettings: SettingParams = JSON.parse(settings);
        form?.setValue('server', jsonSettings?.server);
        form?.setValue('port', jsonSettings?.port);
        form?.setValue('login', jsonSettings?.login);
        form?.setValue('password', jsonSettings?.password);
        form?.setValue('db', jsonSettings?.db);
    }, [form]);

    useEffect(() => {
        handleInitSetting();
    }, [handleInitSetting]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* <View>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        Document
                    </Text>
                    <InputText
                        placeholder="Setting 1"
                        value={settingValues.input6}
                        onChangeText={(text) =>
                            handleInputChange('input6', text)
                        }
                    />
                </View> */}
                <View>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        Odoo Config
                    </Text>
                    {/* <View style={styles.modeSection}>
                        <View style={styles.statusTag}>
                            <Text variant="bodyLarge">Mode</Text>
                            <StatusTag status={'Online'} />
                        </View>
                        <View>
                            <Controller
                                name="online"
                                defaultValue={false}
                                control={form?.control}
                                render={({ field }) => (
                                    <Switch
                                        {...field}
                                        trackColor={{
                                            false: '#767577',
                                            true: '#81b0ff'
                                        }}
                                        thumbColor={
                                            field?.value ? '#f5dd4b' : '#f4f3f4'
                                        }
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={(value) =>
                                            field?.onChange(value)
                                        }
                                    />
                                )}
                            />
                        </View>
                    </View> */}
                    <Controller
                        name="server"
                        defaultValue=""
                        control={form?.control}
                        render={({ field }) => (
                            <InputText
                                {...field}
                                placeholder="Server"
                                onChangeText={(value) => field?.onChange(value)}
                            />
                        )}
                    />
                    <Controller
                        name="port"
                        defaultValue=""
                        control={form?.control}
                        render={({ field }) => (
                            <InputText
                                {...field}
                                placeholder="Port"
                                onChangeText={(value) => field?.onChange(value)}
                            />
                        )}
                    />
                    <Controller
                        name="login"
                        defaultValue=""
                        control={form?.control}
                        render={({ field }) => (
                            <InputText
                                {...field}
                                placeholder="User"
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
                                onChangeText={(value) => field?.onChange(value)}
                            />
                        )}
                    />
                    <Controller
                        name="db"
                        defaultValue=""
                        control={form?.control}
                        render={({ field }) => (
                            <InputText
                                {...field}
                                placeholder="Database"
                                onChangeText={(value) => field?.onChange(value)}
                            />
                        )}
                    />
                </View>

                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={form?.handleSubmit(handleSaveSettings)}
                    >
                        <Button mode="contained-tonal" style={styles.button}>
                            Save
                        </Button>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <ToastComponent />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight
    },
    scrollView: {
        marginHorizontal: 20
    },
    textHeader: {
        width: '100%',
        color: theme.colors.textPrimary,
        fontWeight: '700',
        textAlign: 'left',
        marginBottom: 15
    },
    modeSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    statusTag: {
        display: 'flex',
        flexDirection: 'row'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: 4
    }
});

export default SettingScreen;
