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
    BackHandler,
    Dimensions,
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

const { width, height } = Dimensions.get('window');

const isTablet = width >= 768 && height >= 768;

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
        form?.setValue('db', jsonSettings?.db);
    }, [form]);

    useEffect(() => {
        handleInitSetting();
    }, [handleInitSetting]);

    useEffect(() => {
        const onBackPress = () => {
            navigation.navigate('Login');
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
            <ScrollView style={styles.scrollView}>
                <View>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        Odoo Config
                    </Text>
                    <Controller
                        name="server"
                        defaultValue=""
                        control={form?.control}
                        render={({ field }) => (
                            <InputText
                                {...field}
                                placeholder="Url"
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
                        <Button style={styles.buttonConfirm}>
                            <Text
                                style={styles.textConfirm}
                                variant="bodyLarge"
                            >
                                Save
                            </Text>
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
        textAlign: 'left',
        marginBottom: 15,
        fontSize: isTablet ? 30 : 25,
        fontFamily: 'DMSans-Bold'
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
    buttonConfirm: {
        paddingVertical: isTablet ? 5 : 0,
        paddingHorizontal: isTablet ? 20 : 10,
        backgroundColor: theme.colors.buttonConfirm,
        borderRadius: 10,
        marginTop: 10
    },
    textConfirm: {
        fontFamily: 'DMSans-Medium',
        color: theme.colors.white,
        fontSize: isTablet ? 30 : 16
    }
});

export default SettingScreen;
