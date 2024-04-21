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
import {
    RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND,
    STATE_ASSET,
    STATE_DOCUMENT_NAME,
    WARNING
} from '@src/constant';
import {
    createTableAsset,
    getAsset,
    getTotalAssets,
    insertAssetData,
    updateAsset
} from '@src/db/asset';
import { createTableCategory, insertCategoryData } from '@src/db/category';
import { dropAllMasterTable } from '@src/db/common';
import { getDBConnection } from '@src/db/config';
import {
    createTableDocument,
    getDocument,
    updateDocument
} from '@src/db/document';
import {
    createTableDocumentLine,
    getDocumentLine,
    updateDocumentLineData
} from '@src/db/documentLine';
import { createTableLocation, insertLocationData } from '@src/db/location';
import {
    createTableReportAssetNotFound,
    insertReportAssetNotFound
} from '@src/db/reportAssetNotFound';
import {
    createTableReportDocumentLine,
    insertReportDocumentLine
} from '@src/db/reportDocumentLine';
import { createTableUseStatus, insertUseStatusData } from '@src/db/useStatus';
import { CreateAsset, GetAssetNotFoundSearch } from '@src/services/asset';
import {
    AddDocumentLine,
    CreateDocument,
    GetDocumentLineSearch
} from '@src/services/document';
import {
    GetAssets,
    GetCategory,
    GetLocation,
    GetUseStatus
} from '@src/services/downloadDB';
import { loginState, useRecoilValue, useSetRecoilState } from '@src/store';
import { toastState } from '@src/store/toast';
import { theme } from '@src/theme';
import { LoginState, Toast } from '@src/typings/common';
import { DocumentAssetData } from '@src/typings/document';
import {
    AssetData,
    CategoryData,
    LocationData,
    UseStatusData
} from '@src/typings/downloadDB';
import { SettingParams } from '@src/typings/login';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { ErrorResponse } from '@src/utils/axios';
import { getOnlineMode } from '@src/utils/common';
import { parseDateStringTime } from '@src/utils/time-manager';
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
    const loginValue = useRecoilValue<LoginState>(loginState);
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
            await createTableDocument(db);
            await createTableDocumentLine(db);
            await createTableReportAssetNotFound(db);
            await createTableReportDocumentLine(db);
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
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog('Download Lasted Data');
                setContentDialog(
                    'Your old data will be deleted\nDo you want to download the latest data ?'
                );
                setTypeDialog('download');
                setShowCancelDialog(false);
                return;
            }
            clearStateDialog();
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

    const handleOpenDialogUpload = useCallback(async () => {
        const isOnline = await getOnlineMode();
        if (isOnline) {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog('Upload');
            setContentDialog('Do you want to upload document ?');
            setTypeDialog('upload');
            setShowCancelDialog(false);
        } else {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setContentDialog(
                `Online mode is close, please open online mode to upload`
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
                    (result) => result?.result?.data?.asset ?? []
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

    const handleLoadAssetNotFound = useCallback(
        async (totalPages: number): Promise<AssetData[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetAssetNotFoundSearch({
                        page: i + 1,
                        limit: 1000,
                        search_term: {
                            and: { state: STATE_ASSET }
                        }
                    })
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
                setContentDialog('Something went wrong load asset not found');
                return [];
            }
        },
        [clearStateDialog]
    );

    const handleLoadDocumentLine = useCallback(
        async (totalPages: number): Promise<DocumentAssetData[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetDocumentLineSearch({
                        page: i + 1,
                        limit: 1000,
                        search_term: {
                            and: { state: ['0', '1', '2'] }
                        }
                    })
                );
                const results = await Promise.all(promises);
                const assets = results.flatMap(
                    (result) =>
                        result?.result?.data?.document_item_line?.flatMap(
                            (item) => item.assets
                        ) ?? []
                );
                return assets;
            } catch (err) {
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog(WARNING);
                setContentDialog('Something went wrong load documentLine');
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
                initialResponseCategory,
                initialResponseAssetNotFound,
                initialDocumentLine
            ] = await Promise.all([
                GetAssets({ page: 1, limit: 200 }),
                GetLocation({ page: 1, limit: 1000 }),
                GetUseStatus({ page: 1, limit: 1000 }),
                GetCategory({ page: 1, limit: 1000 }),
                GetAssetNotFoundSearch({
                    page: 1,
                    limit: 1000,
                    search_term: {
                        and: { state: STATE_ASSET }
                    }
                }),
                GetDocumentLineSearch({
                    page: 1,
                    limit: 1000,
                    search_term: {
                        and: { state: ['0', '1', '2'] }
                    }
                })
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
            const errorAssetNotFound = handleResponseError(
                initialResponseAssetNotFound?.error
            );
            const errorDocumentLine = handleResponseError(
                initialDocumentLine?.error
            );

            if (
                errorAssets ||
                errorLocation ||
                errorUseStatus ||
                errorCategorys ||
                errorAssetNotFound ||
                errorDocumentLine
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
            const totalPagesAssetNotFound =
                initialResponseAssetNotFound?.result?.data?.total_pages;
            const totalPagesDocumentLine =
                initialDocumentLine?.result?.data?.total_page;

            const [
                listLocation,
                listUseStatus,
                listCategory,
                listAssetNotFound,
                listDocumentLine
            ] = await Promise.all([
                handleLoadLocation(totalPagesLocation),
                handleLoadUseStatus(totalPagesUseStatus),
                handleLoadCategory(totalPagesCategory),
                handleLoadAssetNotFound(totalPagesAssetNotFound),
                handleLoadDocumentLine(totalPagesDocumentLine)
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
                await createTableReportAssetNotFound(db);
                await createTableReportDocumentLine(db);
                await insertLocationData(db, listLocation);
                await insertUseStatusData(db, listUseStatus);
                await insertCategoryData(db, listCategory);
                if (listAssetNotFound?.length > 0) {
                    await insertReportAssetNotFound(db, listAssetNotFound);
                }
                if (listDocumentLine?.length > 0) {
                    await insertReportDocumentLine(db, listDocumentLine);
                }
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
        handleLoadAssetNotFound,
        handleLoadCategory,
        handleLoadDocumentLine,
        handleLoadLocation,
        handleLoadUseStatus,
        handleResponseError,
        setToast
    ]);

    const handleUpload = useCallback(async () => {
        try {
            setDisableCloseDialog(true);
            setShowProgressBar(true);
            const db = await getDBConnection();
            const filterAsset = {
                is_sync_odoo: false
            };
            const listAsset = await getAsset(db, filterAsset, 1, 100);

            listAsset?.forEach(async (item) => {
                const assetData = {
                    default_code: item?.default_code,
                    name: item?.name,
                    category_id: item?.category_id,
                    quantity: 1,
                    location_id: item?.location_id,
                    user_id: loginValue?.uid,
                    purchase_price: 0,
                    image: item?.image,
                    new_img: item?.new_img
                };
                const response = await CreateAsset({
                    asset_data: assetData
                });
                if (response?.error) {
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong save asset');
                    return;
                }
                if (
                    response?.result?.message === 'Asset created successfully'
                ) {
                    const filterUpdateAsset = {
                        asset_id: response?.result?.data?.id,
                        id: item?.id
                    };
                    await updateAsset(db, filterUpdateAsset);

                    const filterDocumentLine = {
                        asset_id_update: response?.result?.data?.id,
                        code: item?.default_code
                    };

                    await updateDocumentLineData(db, filterDocumentLine);
                }
            });

            const filterDocument = {
                state: STATE_DOCUMENT_NAME?.Draft
            };
            const listDocument = await getDocument(db, filterDocument, 1, 100);

            listDocument?.forEach(async (item) => {
                const responseCreateDocument = await CreateDocument({
                    location_id: item?.location_id,
                    date_order: parseDateStringTime(item?.date_order)
                });
                if (responseCreateDocument?.error) {
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong create document');
                    return;
                }
                const filterDocumentLine = {
                    document_id: item?.id
                };
                const listDocumentLine = await getDocumentLine(
                    db,
                    filterDocumentLine
                );
                const mappingValueDocumentLine = listDocumentLine?.map(
                    (documentLine) => {
                        return {
                            id: documentLine?.asset_id,
                            state: documentLine?.state,
                            use_state: documentLine?.use_state_code,
                            new_img: documentLine?.new_img ? true : false,
                            image: documentLine?.image,
                            date_check: parseDateStringTime(
                                documentLine?.date_check
                            )
                        };
                    }
                );

                const responseAddDocumentLine = await AddDocumentLine({
                    location_id: item?.location_id,
                    asset_tracking_id: responseCreateDocument?.result?.data?.id,
                    asset_ids: mappingValueDocumentLine
                });

                if (
                    responseAddDocumentLine?.result?.message ===
                    RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND
                ) {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong add document line');
                    return;
                }
                if (responseAddDocumentLine?.error) {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong add document line');
                    return;
                }
                if (responseAddDocumentLine?.result?.error) {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong add document line');
                    return;
                }
                const documentObj = {
                    id: item?.id,
                    state: STATE_DOCUMENT_NAME.Done
                };

                await updateDocument(db, documentObj);
            });

            setTimeout(() => {
                setToast({ open: true, text: 'Upload Successfully' });
            }, 0);

            clearStateDialog();
        } catch (err) {
            console.log(err);
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setContentDialog(`Something went wrong upload`);
            setTypeDialog('warning');
        }
    }, [clearStateDialog, loginValue?.uid, setToast]);

    const handleConfirmDialog = useCallback(async () => {
        switch (typeDialog) {
            case 'download':
                await handleDownload();
                break;
            case 'upload':
                await handleUpload();
                break;
            case 'warning':
                clearStateDialog();
                break;
            default:
                clearStateDialog();
                break;
        }
    }, [clearStateDialog, handleDownload, handleUpload, typeDialog]);

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
                handleUpload={handleOpenDialogUpload}
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
