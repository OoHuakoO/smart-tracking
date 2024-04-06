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
import StatusTag from '@src/components/core/statusTag';
import ToastComponent from '@src/components/core/toast';
import ShortcutMenu from '@src/components/views/shortcutMenu';
import { WARNING } from '@src/constant';
import {
    createTableAsset,
    getTotalAssets,
    insertAssetData
} from '@src/db/asset';
import { createTableCategory, insertCategoryData } from '@src/db/category';
import { dropAllMasterTable } from '@src/db/common';
import { getDBConnection } from '@src/db/config';
import { createTableLocation, insertLocationData } from '@src/db/location';
import { createTableReport } from '@src/db/report';
import { createTableUseStatus, insertUseStatusData } from '@src/db/useStatus';
import {
    GetAssets,
    GetCategory,
    GetLocation,
    GetUseStatus
} from '@src/services/downloadDB';
import { loginState, useSetRecoilState } from '@src/store';
import { toastState } from '@src/store/toast';
import { theme } from '@src/theme';
import { LoginState, Toast } from '@src/typings/common';
import {
    CategoryData,
    LocationData,
    UseStatusData
} from '@src/typings/downloadDB';
import { SettingParams } from '@src/typings/login';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { ErrorResponse } from '@src/utils/axios';
import { getOnlineMode } from '@src/utils/common';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Portal, Text } from 'react-native-paper';

type HomeScreenProps = NativeStackScreenProps<PrivateStackParamsList, 'Home'>;

const HomeScreen: FC<HomeScreenProps> = (props) => {
    const { navigation, route } = props;
    const form = useForm<SettingParams>({});
    const setLogin = useSetRecoilState<LoginState>(loginState);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [contentDialog, setContentDialog] = useState<string>('');
    const [disableCloseDialog, setDisableCloseDialog] =
        useState<boolean>(false);
    const [typeDialog, setTypeDialog] = useState<string>('warning');
    const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const setToast = useSetRecoilState<Toast>(toastState);

    const clearStateDialog = useCallback(() => {
        setVisibleDialog(false);
        setTitleDialog('');
        setContentDialog('');
        setDisableCloseDialog(false);
        setTypeDialog('warning');
        setShowCancelDialog(false);
        setShowProgressBar(false);
    }, []);

    const handleInitFetch = useCallback(async () => {
        try {
            const online = await AsyncStorage.getItem('Online');
            if (!online) {
                await AsyncStorage.setItem('Online', JSON.stringify(true));
                form?.setValue('online', true);
                return;
            }
            const onlineValue = JSON.parse(online);
            form?.setValue('online', onlineValue);
            const db = await getDBConnection();
            await createTableAsset(db);
            await createTableLocation(db);
            await createTableUseStatus(db);
            await createTableCategory(db);
            await createTableReport(db);
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
        }
    }, [clearStateDialog, form]);

    const handleLogout = useCallback(async () => {
        try {
            setLogin({ session_id: '', uid: '' });
            await AsyncStorage.setItem('Login', '');
            await AsyncStorage.setItem('Online', JSON.stringify(true));
            const db = await getDBConnection();
            await dropAllMasterTable(db);
            setTimeout(() => {
                setToast({ open: true, text: 'Logout Successfully' });
            }, 0);
        } catch (err) {
            console.log(err);
            clearStateDialog();
            setVisibleDialog(true);
        }
    }, [clearStateDialog, setLogin, setToast]);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleOpenDialogDownload = useCallback(async () => {
        const isOnline = await getOnlineMode();
        if (isOnline) {
            const db = await getDBConnection();
            const countAsset = await getTotalAssets(db);
            if (countAsset > 0) {
                setVisibleDialog(true);
                setTitleDialog('Download Lasted Data');
                setContentDialog(
                    'Your old data will be deleted\nDo you want to download the latest data?'
                );
                setTypeDialog('download');
                setShowCancelDialog(false);
                return;
            }
            setVisibleDialog(true);
            setTitleDialog('Data Not Found');
            setContentDialog('Please download the current data');
            setTypeDialog('download');
            setShowCancelDialog(false);
            return;
        } else {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setContentDialog(
                `Online mode is close, please open online mode to download`
            );
            setTypeDialog('warning');
        }
    }, [clearStateDialog]);

    const handleResponseError = useCallback(
        (error: ErrorResponse | undefined): boolean => {
            if (error) {
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog(WARNING);
                setContentDialog('Something went wrong response error');
                return true;
            }
            return false;
        },
        [clearStateDialog]
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
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog(WARNING);
                setContentDialog('Something went wrong load location');
                return [];
            }
        },
        [clearStateDialog]
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
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog(WARNING);
                setContentDialog('Something went wrong load use status');
                return [];
            }
        },
        [clearStateDialog]
    );

    const handleLoadCategory = useCallback(
        async (totalPages: number): Promise<CategoryData[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetCategory({ page: i + 1, limit: 1000 })
                );
                const results = await Promise.all(promises);
                const categorys = results.flatMap(
                    (result) => result?.result?.data?.asset ?? []
                );
                return categorys;
            } catch (err) {
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog(WARNING);
                setContentDialog('Something went wrong load category');
                return [];
            }
        },
        [clearStateDialog]
    );

    const handleDownload = useCallback(async () => {
        try {
            setDisableCloseDialog(true);
            setShowProgressBar(true);
            const [
                initialResponseAssets,
                initialResponseLocation,
                initialResponseUseStatus,
                initialResponseCategory
            ] = await Promise.all([
                GetAssets({ page: 1, limit: 200 }),
                GetLocation({ page: 1, limit: 1000 }),
                GetUseStatus({ page: 1, limit: 1000 }),
                GetCategory({ page: 1, limit: 1000 })
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
            const errorCategorys = handleResponseError(
                initialResponseCategory?.error
            );

            if (
                errorAssets ||
                errorLocation ||
                errorUseStatus ||
                errorCategorys
            ) {
                return;
            }

            const totalPagesAssets =
                initialResponseAssets?.result?.data?.total_page;
            const totalPagesLocation =
                initialResponseLocation?.result?.data?.total_page;
            const totalPagesUseStatus =
                initialResponseUseStatus?.result?.data?.total_page;
            const totalPagesCategory =
                initialResponseCategory?.result?.data?.total_page;

            const [listLocation, listUseStatus, listCategory] =
                await Promise.all([
                    handleLoadLocation(totalPagesLocation),
                    handleLoadUseStatus(totalPagesUseStatus),
                    handleLoadCategory(totalPagesCategory)
                ]);

            const db = await getDBConnection();
            await dropAllMasterTable(db);
            await createTableAsset(db);

            for (let index = 0; index < totalPagesAssets; index++) {
                const result = await GetAssets({
                    page: index + 1,
                    limit: 200
                });
                await insertAssetData(db, result?.result?.data?.asset);
            }

            if (
                listLocation?.length > 0 &&
                listUseStatus?.length > 0 &&
                listCategory?.length > 0
            ) {
                await createTableLocation(db);
                await createTableUseStatus(db);
                await createTableCategory(db);
                await insertLocationData(db, listLocation);
                await insertUseStatusData(db, listUseStatus);
                await insertCategoryData(db, listCategory);
            }

            setTimeout(() => {
                setToast({ open: true, text: 'Download Successfully' });
            }, 0);
            clearStateDialog();
        } catch (err) {
            console.log(err);
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setContentDialog(`Something went wrong download`);
            setTypeDialog('warning');
        }
    }, [
        clearStateDialog,
        handleLoadCategory,
        handleLoadLocation,
        handleLoadUseStatus,
        handleResponseError,
        setToast
    ]);

    const handleConfirmDialog = useCallback(async () => {
        switch (typeDialog) {
            case 'download':
                await handleDownload();
                break;
            case 'upload':
                // handleUpload
                break;
            case 'warning':
                setShowCancelDialog(false);
                setVisibleDialog(false);
                break;
            default:
                setShowCancelDialog(false);
                setVisibleDialog(false);
                break;
        }
    }, [handleDownload, typeDialog]);

    useEffect(() => {
        handleInitFetch();
    }, [handleInitFetch]);

    return (
        <SafeAreaView style={styles.container}>
            <Portal>
                <AlertDialog
                    textTitle={titleDialog}
                    textContent={contentDialog}
                    visible={visibleDialog}
                    handleClose={handleCloseDialog}
                    disableClose={disableCloseDialog}
                    showCloseDialog={showCancelDialog}
                    handleConfirm={handleConfirmDialog}
                    showProgressBar={showProgressBar}
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
                handleDownload={handleOpenDialogDownload}
            />
            <ToastComponent />
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
        fontFamily: 'DMSans-Medium',
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
