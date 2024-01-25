import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    Switch,
    TouchableOpacity,
    View
} from 'react-native';

import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import ImageSlider from '@src/components/core/imagesSlider';
import ShortcutMenu from '@src/components/core/shortcutMenu';
import StatusTag from '@src/components/core/statusTag';
import { authState, useSetRecoilState } from '@src/store';
import { theme } from '@src/theme';
import { SettingParams } from '@src/typings/login';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Portal, Text } from 'react-native-paper';

type HomeScreenProps = NativeStackScreenProps<PrivateStackParamsList, 'Home'>;

const HomeScreen: FC<HomeScreenProps> = () => {
    // const { navigation } = props;
    const form = useForm<SettingParams>({});
    const setToken = useSetRecoilState<string>(authState);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [textDialog, setTextDialog] = useState<string>('');

    const handleInitOnline = useCallback(async () => {
        const online = await AsyncStorage.getItem('Online');
        if (!online) {
            await AsyncStorage.setItem('Online', JSON.stringify(true));
            return;
        }
        const onlineValue = JSON.parse(online);
        form?.setValue('online', onlineValue);
    }, [form]);

    const handleLogout = useCallback(async () => {
        try {
            setToken('');
            await AsyncStorage.setItem('Token', '');
        } catch (err) {
            setVisibleDialog(true);
            setTextDialog('Network Error');
        }
    }, [setToken]);

    const handleCloseDialog = () => {
        setVisibleDialog(false);
    };

    useEffect(() => {
        handleInitOnline();
    }, [handleInitOnline]);

    return (
        <SafeAreaView style={styles.container}>
            <Portal>
                <AlertDialog
                    titleText={'Warning'}
                    textContent={textDialog}
                    visible={visibleDialog}
                    handleClose={handleCloseDialog}
                    children={''}
                />
            </Portal>
            <View style={styles.modeSectionWrap}>
                <View>
                    <View style={styles.modeSection}>
                        <StatusTag
                            status={form.watch('online') ? 'Online' : 'Offline'}
                        />
                        <Controller
                            name="online"
                            defaultValue={true}
                            control={form?.control}
                            render={({ field }) => (
                                <Switch
                                    {...field}
                                    trackColor={{
                                        false: theme.colors.disableSwitch,
                                        true: theme.colors.primary
                                    }}
                                    thumbColor={theme.colors.white}
                                    onValueChange={async (value) => {
                                        field?.onChange(value);
                                        await AsyncStorage.setItem(
                                            'Online',
                                            JSON.stringify(value)
                                        );
                                    }}
                                />
                            )}
                        />
                    </View>
                </View>

                <TouchableOpacity activeOpacity={0.5} onPress={handleLogout}>
                    <View>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                <Text variant="displayMedium" style={styles.textHeader}>
                    Welcome
                </Text>
            </View>
            <ImageSlider />
            <ShortcutMenu />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 20
    },
    textHeader: {
        width: '100%',
        color: theme.colors.textPrimary,
        fontWeight: '700',
        textAlign: 'left',
        marginBottom: 15
    },
    textMenu: {
        marginTop: 15,
        fontWeight: 'bold'
    },
    modeSectionWrap: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    modeSection: {
        display: 'flex',
        flexDirection: 'row'
    }
});

export default HomeScreen;
