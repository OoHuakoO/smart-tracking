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
import { createTableAsset, insertAssetData } from '@src/db/asset';
import { dropAllMasterTable } from '@src/db/common';
import { getDBConnection } from '@src/db/config';
import { createTableLocation, insertLocationData } from '@src/db/location';
import { createTableUseStatus, insertUseStatusData } from '@src/db/useStatus';
import { GetAssets, GetLocation, GetUseStatus } from '@src/services/asset';
import { authState, useSetRecoilState } from '@src/store';
import { theme } from '@src/theme';
import { AssetData, LocationData, UseStatusData } from '@src/typings/asset';
import { SettingParams } from '@src/typings/login';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { ErrorResponse } from '@src/utils/axios';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Portal, Text } from 'react-native-paper';

type HomeScreenProps = NativeStackScreenProps<PrivateStackParamsList, 'Home'>;

const HomeScreen: FC<HomeScreenProps> = (props) => {
    const { navigation, route } = props;
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

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleResponseError = useCallback(
        (error: ErrorResponse | undefined): boolean => {
            if (error) {
                setVisibleDialog(true);
                setTextDialog('Something went wrong response error');
                return true;
            }
            return false;
        },
        []
    );

    const handleLoadAsset = useCallback(
        async (totalPages: number): Promise<AssetData[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetAssets({ page: i + 1, limit: 1000 })
                );
                const results = await Promise.all(promises);
                const assets = results.flatMap(
                    (result) => result?.result?.data?.asset ?? []
                );
                return assets;
            } catch (err) {
                console.log(err);
                setVisibleDialog(true);
                setTextDialog('Something went wrong load asset');
                return [];
            }
        },
        []
    );

    const handleLoadLocation = useCallback(
        async (totalPages: number): Promise<LocationData[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetLocation({ page: i + 1, limit: 1000 })
                );
                const results = await Promise.all(promises);
                const assets = results.flatMap(
                    (result) => result?.result?.data?.data ?? []
                );
                return assets;
            } catch (err) {
                console.log(err.message);
                setVisibleDialog(true);
                setTextDialog('Something went wrong load location');
                return [];
            }
        },
        []
    );

    const handleLoadUseStatus = useCallback(
        async (totalPages: number): Promise<UseStatusData[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetUseStatus({ page: i + 1, limit: 1000 })
                );
                const results = await Promise.all(promises);
                const assets = results.flatMap(
                    (result) => result?.result?.data?.data ?? []
                );
                return assets;
            } catch (err) {
                console.log(err.message);
                setVisibleDialog(true);
                setTextDialog('Something went wrong load use status');
                return [];
            }
        },
        []
    );

    const handleDownload = useCallback(async () => {
        try {
            const [
                initialResponseAssets,
                initialResponseLocation,
                initialResponseUseStatus
            ] = await Promise.all([
                GetAssets({ page: 1, limit: 1000 }),
                GetLocation({ page: 1, limit: 1000 }),
                GetUseStatus({ page: 1, limit: 1000 })
            ]);

            const errorAssets = handleResponseError(
                initialResponseAssets?.error
            );
            const errorLocation = handleResponseError(
                initialResponseLocation?.error
            );
            const errorUseStatus = handleResponseError(
                initialResponseUseStatus?.error
            );

            if (errorAssets || errorLocation || errorUseStatus) {
                return;
            }

            const totalPagesAssets =
                initialResponseAssets?.result?.data?.total_page;
            const totalPagesLocation =
                initialResponseLocation?.result?.data?.total_page;
            const totalPagesUseStatus =
                initialResponseUseStatus?.result?.data?.total_page;

            const [listAssets, listLocation, listUseStatus] = await Promise.all(
                [
                    handleLoadAsset(totalPagesAssets),
                    handleLoadLocation(totalPagesLocation),
                    handleLoadUseStatus(totalPagesUseStatus)
                ]
            );
            if (
                listAssets?.length > 0 &&
                listLocation?.length > 0 &&
                listUseStatus?.length > 0
            ) {
                const db = await getDBConnection();
                await dropAllMasterTable(db);
                await createTableAsset(db);
                await createTableLocation(db);
                await createTableUseStatus(db);
                await insertAssetData(db, listAssets);
                await insertLocationData(db, listLocation);
                await insertUseStatusData(db, listUseStatus);
            }
        } catch (err) {
            console.log(err.message);
            setVisibleDialog(true);
            setTextDialog(`Something went wrong download`);
        }
    }, [
        handleLoadAsset,
        handleLoadLocation,
        handleLoadUseStatus,
        handleResponseError
    ]);

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
            <ShortcutMenu
                navigation={navigation}
                route={route}
                handleDownload={handleDownload}
            />
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
