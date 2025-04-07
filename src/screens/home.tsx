import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    BackHandler,
    Dimensions,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    View
} from 'react-native';

import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
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
import { createTableBranch, insertBranchData } from '@src/db/branch';
import { createTableCategory, insertCategoryData } from '@src/db/category';
import { dropAllMasterTable } from '@src/db/common';
import { getDBConnection } from '@src/db/config';
import {
    createTableDocumentLine,
    getDocumentLine,
    removeDocumentLineOfflineByTrackingID,
    updateDocumentLineData
} from '@src/db/documentLineOffline';
import {
    createTableDocumentOffline,
    getDocumentOffline,
    removeDocumentOffline,
    updateDocument
} from '@src/db/documentOffline';
import { createTableLocation, insertLocationData } from '@src/db/location';
import {
    createTableReportAssetNotFound,
    insertReportAssetNotFound
} from '@src/db/reportAssetNotFound';
import {
    createTableReportDocumentLine,
    insertReportDocumentLine
} from '@src/db/reportDocumentLine';
import { createTableUserOffline, insertUserOffline } from '@src/db/userOffline';
import { createTableUseStatus, insertUseStatusData } from '@src/db/useStatus';
import { CreateAsset, GetAssetNotFoundSearch } from '@src/services/asset';
import { GetBranches } from '@src/services/branch';
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
import {
    CheckMacAddress,
    CheckUserActive,
    GetAllUserOffline,
    LogoutDevice
} from '@src/services/login';
import {
    BranchState,
    loginState,
    OnlineState,
    useRecoilValue,
    useSetRecoilState
} from '@src/store';
import { toastState } from '@src/store/toast';
import { theme } from '@src/theme';
import { GetBranchData } from '@src/typings/branch';
import { BranchStateProps, LoginState, Toast } from '@src/typings/common';
import { DocumentAssetData } from '@src/typings/document';
import {
    AssetData,
    CategoryData,
    LocationData,
    UseStatusData
} from '@src/typings/downloadDB';
import { SettingParams, UserList } from '@src/typings/login';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { ErrorResponse } from '@src/utils/axios';
import { parseDateStringTime } from '@src/utils/time-manager';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import { Button, Portal, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HomeScreenProps = NativeStackScreenProps<PrivateStackParamsList, 'Home'>;

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768 && height >= 768;
const isSmallMb = width < 400;

const HomeScreen: FC<HomeScreenProps> = (props) => {
    const { navigation, route } = props;
    const { top } = useSafeAreaInsets();
    const form = useForm<SettingParams>({});
    const setLogin = useSetRecoilState<LoginState>(loginState);
    const setToast = useSetRecoilState<Toast>(toastState);
    const setBranch = useSetRecoilState<BranchStateProps>(BranchState);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [contentDialog, setContentDialog] = useState<string>('');
    const [disableCloseDialog, setDisableCloseDialog] =
        useState<boolean>(false);
    const [typeDialog, setTypeDialog] = useState<string>('warning');
    const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const loginValue = useRecoilValue<LoginState>(loginState);
    const onlineValue = useRecoilValue<boolean>(OnlineState);
    const branchValue = useRecoilValue(BranchState);

    const { isConnected } = useNetInfo();

    const clearStateDialog = useCallback(() => {
        setVisibleDialog(false);
        setTitleDialog('');
        setContentDialog('');
        setDisableCloseDialog(false);
        setTypeDialog('warning');
        setShowCancelDialog(false);
        setShowProgressBar(false);
    }, []);

    const handleLogout = useCallback(
        async (loginAnotherDevoice?: boolean) => {
            try {
                if (!loginAnotherDevoice && isConnected) {
                    const response = await LogoutDevice();
                    if (response?.error) {
                        clearStateDialog();
                        setVisibleDialog(true);
                        setContentDialog('Logout Failed');
                        return;
                    }
                }
                const defaultBranch = {
                    branchId: null,
                    branchName: 'no branch'
                };
                setLogin({ uid: '' });
                setBranch(defaultBranch);
                await AsyncStorage.setItem('Login', '');
                await AsyncStorage.setItem(
                    'Branch',
                    JSON.stringify(defaultBranch)
                );
                setTimeout(() => {
                    setToast({ open: true, text: 'Logout Successfully' });
                }, 0);
            } catch (err) {
                console.log(err);
                clearStateDialog();
                setVisibleDialog(true);
            }
        },
        [clearStateDialog, isConnected, setBranch, setLogin, setToast]
    );

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleOpenDialogDownload = useCallback(async () => {
        if (isConnected) {
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
                setShowCancelDialog(true);
                return;
            }
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog('Data Not Found');
            setContentDialog('Please download the current data');
            setTypeDialog('download');
            setShowCancelDialog(true);
            return;
        } else {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setContentDialog(
                `Network Disconnected, please open internet to download`
            );
            setTypeDialog('warning');
        }
    }, [clearStateDialog, isConnected]);

    const handleOpenDialogUpload = useCallback(async () => {
        if (isConnected) {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog('Upload');
            setContentDialog('Do you want to upload document ?');
            setTypeDialog('upload');
            setShowCancelDialog(true);
        } else {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setContentDialog(
                `Network disconnected, please open internet to download`
            );
            setTypeDialog('warning');
        }
    }, [clearStateDialog, isConnected]);

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
                    (result) => result?.result?.data?.assets ?? []
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
                console.log(err);
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
                console.log(err);
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
                console.log(err);
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
                console.log(err);
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog(WARNING);
                setContentDialog('Something went wrong load documentLine');
                return [];
            }
        },
        [clearStateDialog]
    );

    const handleCheckMacAddress = useCallback(async (): Promise<boolean> => {
        const settings = await AsyncStorage.getItem('Settings');
        const jsonSettings: SettingParams = JSON.parse(settings);
        const response = await CheckMacAddress({
            mac_address: jsonSettings?.mac_address
        });
        if (
            response?.result?.success &&
            response?.result?.data?.device_active
        ) {
            return true;
        }
        return false;
    }, []);

    const handleLoadUserOffline = useCallback(
        async (totalPages: number): Promise<UserList[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetAllUserOffline({ page: i + 1, limit: 1000 })
                );
                const results = await Promise.all(promises);
                const users = results.flatMap(
                    (result) => result?.result?.data?.user ?? []
                );
                return users;
            } catch (err) {
                console.log(err);
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog(WARNING);
                setContentDialog('Something went wrong load user offline');
                return [];
            }
        },
        [clearStateDialog]
    );

    const handleLoadBranch = useCallback(
        async (totalPages: number): Promise<GetBranchData[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetBranches({ page: i + 1, limit: 1000 })
                );
                const results = await Promise.all(promises);
                const branches = results.flatMap(
                    (result) => result?.result?.data?.assets ?? []
                );
                return branches;
            } catch (err) {
                console.log(err);
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog(WARNING);
                setContentDialog('Something went wrong load branch');
                return [];
            }
        },
        [clearStateDialog]
    );

    const handleDownload = useCallback(async () => {
        try {
            const foundMacAddress = await handleCheckMacAddress();
            if (foundMacAddress) {
                setDisableCloseDialog(true);
                setShowProgressBar(true);
                const [
                    initialResponseAssets,
                    initialResponseLocation,
                    initialResponseUseStatus,
                    initialResponseCategory,
                    initialResponseAssetNotFound,
                    initialDocumentLine,
                    initialUserOffline,
                    initialBranch
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
                    }),
                    GetAllUserOffline({
                        page: 1,
                        limit: 1000
                    }),
                    GetBranches({
                        page: 1,
                        limit: 1000
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
                const errorUserOffline = handleResponseError(
                    initialUserOffline?.error
                );
                const errorBranch = handleResponseError(initialBranch?.error);

                if (
                    errorAssets ||
                    errorLocation ||
                    errorUseStatus ||
                    errorCategorys ||
                    errorAssetNotFound ||
                    errorDocumentLine ||
                    errorUserOffline ||
                    errorBranch
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
                const totalPagesUserOffline =
                    initialUserOffline?.result?.data?.total_page;
                const totalPagesBranch =
                    initialBranch?.result?.data?.total_page;

                const [
                    listLocation,
                    listUseStatus,
                    listCategory,
                    listAssetNotFound,
                    listDocumentLine,
                    listUserOffline,
                    listBranch
                ] = await Promise.all([
                    handleLoadLocation(totalPagesLocation),
                    handleLoadUseStatus(totalPagesUseStatus),
                    handleLoadCategory(totalPagesCategory),
                    handleLoadAssetNotFound(totalPagesAssetNotFound),
                    handleLoadDocumentLine(totalPagesDocumentLine),
                    handleLoadUserOffline(totalPagesUserOffline),
                    handleLoadBranch(totalPagesBranch)
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
                    listCategory?.length > 0 &&
                    listBranch?.length > 0
                ) {
                    await createTableLocation(db);
                    await createTableUseStatus(db);
                    await createTableCategory(db);
                    await createTableReportAssetNotFound(db);
                    await createTableReportDocumentLine(db);
                    await createTableUserOffline(db);
                    await createTableBranch(db);
                    await insertLocationData(db, listLocation);
                    await insertUseStatusData(db, listUseStatus);
                    await insertCategoryData(db, listCategory);
                    await insertBranchData(db, listBranch);
                    if (listAssetNotFound?.length > 0) {
                        await insertReportAssetNotFound(db, listAssetNotFound);
                    }
                    if (listDocumentLine?.length > 0) {
                        await insertReportDocumentLine(db, listDocumentLine);
                    }
                    if (listUserOffline?.length > 0) {
                        await insertUserOffline(db, listUserOffline);
                    }
                }
                setTimeout(() => {
                    setToast({ open: true, text: 'Download Successfully' });
                }, 0);
                clearStateDialog();
            } else {
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog(WARNING);
                setContentDialog(
                    `This device does not have permission to download`
                );
                setTypeDialog('warning');
            }
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
        handleCheckMacAddress,
        handleLoadAssetNotFound,
        handleLoadBranch,
        handleLoadCategory,
        handleLoadDocumentLine,
        handleLoadLocation,
        handleLoadUseStatus,
        handleLoadUserOffline,
        handleResponseError,
        setToast
    ]);

    const handleUpload = useCallback(async () => {
        try {
            const foundMacAddress = await handleCheckMacAddress();

            if (!foundMacAddress) {
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog(WARNING);
                setContentDialog(
                    `This device does not have permission to upload`
                );
                setTypeDialog('warning');
                return;
            }

            setDisableCloseDialog(true);
            setShowProgressBar(true);

            const db = await getDBConnection();
            const filterAsset = {
                is_sync_odoo: false
            };
            const listAsset = await getAsset(db, filterAsset, 1, 1000);

            for (const item of listAsset) {
                try {
                    let assetData: AssetData = {
                        default_code: item?.default_code,
                        name: item?.name,
                        category_id: item?.category_id,
                        quantity: 1,
                        location_id: item?.location_id,
                        user_id: loginValue?.uid,
                        purchase_price: 0,
                        branch_id: branchValue?.branchId
                    };

                    if (item?.image !== 'false') {
                        assetData.image = item?.image;
                    }

                    if (item?.new_img) {
                        assetData.new_img = item?.new_img;
                    }

                    const response = await CreateAsset({
                        asset_data: assetData
                    });

                    if (response?.error) {
                        throw new Error('Something went wrong create asset');
                    }

                    if (
                        response?.result?.message ===
                        'Asset created successfully'
                    ) {
                        const newAssetId = response?.result?.data?.id;

                        await updateAsset(db, {
                            asset_id: newAssetId,
                            is_sync_odoo: true,
                            id: item?.id
                        });

                        await updateDocumentLineData(db, {
                            asset_id_update: newAssetId,
                            code: item?.default_code
                        });
                    }
                } catch (error) {
                    console.error('Asset Upload Error:', error);
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog(error.message);
                    return;
                }
            }

            const sort = { date_order: true };
            const filterDocument = { state: STATE_DOCUMENT_NAME?.Draft };
            const listDocument = await getDocumentOffline(
                db,
                filterDocument,
                sort,
                1,
                1000
            );

            for (const item of listDocument) {
                try {
                    const responseCreateDocument = await CreateDocument({
                        location_id: item?.location_id,
                        date_order: parseDateStringTime(item?.date_order),
                        android_id: item?.id?.toString(),
                        branch_id: branchValue?.branchId
                    });

                    if (responseCreateDocument?.error) {
                        throw new Error(
                            'Something went wrong creating document'
                        );
                    }

                    const filterDocumentLine = { tracking_id: item?.id };
                    const listDocumentLine = await getDocumentLine(
                        db,
                        filterDocumentLine
                    );

                    const mappingValueDocumentLine = listDocumentLine.map(
                        (documentLine) => {
                            return {
                                id: documentLine?.asset_id,
                                state: documentLine?.state,
                                use_state: documentLine?.use_state_code,
                                new_img: documentLine?.new_img ? true : false,
                                branch_id: branchValue?.branchId,
                                date_check: parseDateStringTime(
                                    documentLine?.date_check
                                ),
                                ...(documentLine?.image !== 'false' && {
                                    image: documentLine?.image
                                })
                            };
                        }
                    );

                    const responseAddDocumentLine = await AddDocumentLine({
                        location_id: item?.location_id,
                        asset_tracking_id:
                            responseCreateDocument?.result?.data?.id,
                        asset_ids: mappingValueDocumentLine
                    });

                    if (
                        responseAddDocumentLine?.result?.message ===
                            RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND ||
                        responseAddDocumentLine?.error ||
                        responseAddDocumentLine?.result?.error
                    ) {
                        throw new Error(
                            'Something went wrong adding document line'
                        );
                    }

                    await updateDocument(db, {
                        id: item?.id,
                        state: STATE_DOCUMENT_NAME.Done
                    });
                } catch (error) {
                    console.error('Document Upload Error:', error);
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog(error.message);
                    return;
                }
            }

            setToast({ open: true, text: 'Upload Successfully' });
            clearStateDialog();
        } catch (err) {
            console.log(err);
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setContentDialog(`Something went wrong upload`);
            setTypeDialog('warning');
        }
    }, [
        branchValue?.branchId,
        clearStateDialog,
        handleCheckMacAddress,
        loginValue?.uid,
        setToast
    ]);

    const handleSelectBranch = useCallback(() => {
        navigation.navigate('BranchSelectScreen');
        clearStateDialog();
    }, [clearStateDialog, navigation]);

    const handleNavigateBranch = useCallback(() => {
        clearStateDialog();
        navigation.navigate('BranchSelectScreen', {
            onGoBack: async (branch_id: number) => {
                if (branch_id !== branchValue?.branchId && !onlineValue) {
                    const db = await getDBConnection();
                    const listDocumentDB = await getDocumentOffline(db, null);
                    listDocumentDB.map(async (item) => {
                        await removeDocumentLineOfflineByTrackingID(
                            db,
                            item?.id
                        );
                    });
                    await removeDocumentOffline(db);
                    clearStateDialog();
                    setVisibleDialog(true);
                    setTitleDialog(WARNING);
                    setContentDialog('Please download the data current branch');
                    setTypeDialog('download');
                    setDisableCloseDialog(true);
                }
            }
        });
    }, [branchValue?.branchId, clearStateDialog, navigation, onlineValue]);

    const handleConfirmDialog = useCallback(async () => {
        switch (typeDialog) {
            case 'download':
                await handleDownload();
                break;
            case 'upload':
                await handleUpload();
                break;
            case 'logout device':
                handleLogout(true);
                break;
            case 'warning':
                clearStateDialog();
                break;
            case 'warning branch':
                handleNavigateBranch();
                break;
            case 'branch':
                await handleSelectBranch();
                break;
            default:
                clearStateDialog();
                break;
        }
    }, [
        clearStateDialog,
        handleDownload,
        handleLogout,
        handleNavigateBranch,
        handleSelectBranch,
        handleUpload,
        typeDialog
    ]);

    const handleCheckUserLogin = useCallback(async () => {
        try {
            const intervalId = setInterval(async () => {
                if (onlineValue && isConnected) {
                    const settings = await AsyncStorage.getItem('Settings');
                    const jsonSettings: SettingParams = JSON.parse(settings);
                    const response = await CheckUserActive({
                        login: jsonSettings?.login,
                        password: jsonSettings?.password
                    });
                    if (response?.error) {
                        clearStateDialog();
                        setVisibleDialog(true);
                        setTitleDialog(WARNING);
                        setTypeDialog('warning');
                        return;
                    }
                    if (
                        response?.result?.data?.mac_address !==
                            jsonSettings?.mac_address &&
                        response?.result?.data?.is_login
                    ) {
                        clearStateDialog();
                        setVisibleDialog(true);
                        setTitleDialog('User Login Another Device');
                        setContentDialog(
                            `You have been logged out because there was a login from another device. If this wasn't you, please check the security of your account immediately.`
                        );
                        setTypeDialog('logout device');
                        setDisableCloseDialog(true);
                    }
                }
            }, 10000);
            return () => clearInterval(intervalId);
        } catch (err) {
            console.log(err);
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setTypeDialog('warning');
        }
    }, [clearStateDialog, isConnected, onlineValue]);

    const handleCheckBranchStorage = useCallback(async () => {
        if (!branchValue?.branchId) {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setDisableCloseDialog(true);
            setContentDialog('Please select a branch before starting.');
            setTypeDialog('branch');
        }
    }, [branchValue?.branchId, clearStateDialog]);

    const handleNavigateSelectBranch = useCallback(() => {
        if (isConnected) {
            if (!onlineValue) {
                setVisibleDialog(true);
                setShowCancelDialog(true);
                setTitleDialog(WARNING);
                setContentDialog(
                    `If you want to change the branch, all data from the old branch will be deleted. Are you sure?`
                );
                setTypeDialog('warning branch');
                return;
            }
            handleNavigateBranch();
        } else {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setContentDialog(
                `Network Disconnected, please open internet to select branch`
            );
            setTypeDialog('warning');
        }
    }, [clearStateDialog, handleNavigateBranch, isConnected, onlineValue]);

    useFocusEffect(
        useCallback(() => {
            handleCheckBranchStorage();
        }, [handleCheckBranchStorage])
    );

    useEffect(() => {
        handleCheckUserLogin();
    }, [handleCheckUserLogin]);

    useFocusEffect(
        useCallback(() => {
            const initState = async () => {
                try {
                    const db = await getDBConnection();
                    await createTableAsset(db);
                    await createTableLocation(db);
                    await createTableUseStatus(db);
                    await createTableCategory(db);
                    await createTableDocumentOffline(db);
                    await createTableDocumentLine(db);
                    await createTableReportAssetNotFound(db);
                    await createTableReportDocumentLine(db);
                    await createTableBranch(db);
                    if (branchValue?.branchId) {
                        const countAsset = await getTotalAssets(db);
                        if (countAsset === 0) {
                            clearStateDialog();
                            setVisibleDialog(true);
                            setTitleDialog('Data Not Found');
                            setContentDialog(
                                'Please download the current data'
                            );
                            setTypeDialog('download');
                            setDisableCloseDialog(true);
                        }
                    }
                } catch (err) {
                    console.log(err);
                    clearStateDialog();
                    setVisibleDialog(true);
                }
            };
            form?.setValue('online', onlineValue);
            const debounceInit = setTimeout(() => {
                if (onlineValue !== undefined && onlineValue === false) {
                    initState();
                }
            }, 500);

            return () => clearTimeout(debounceInit);
        }, [branchValue?.branchId, clearStateDialog, form, onlineValue])
    );

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
        <SafeAreaView style={[styles.container, { marginTop: top }]}>
            <KeepAwake />
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
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => handleLogout(false)}
                >
                    <View>
                        <FontAwesomeIcon
                            icon={faRightFromBracket}
                            size={isTablet ? 30 : 20}
                        />
                    </View>
                </TouchableOpacity>
            </View>
            <ImageSlider />
            <View style={styles.modeBranchWrap}>
                <TouchableOpacity onPress={() => handleNavigateSelectBranch()}>
                    <Button style={styles.searchBranchButton}>
                        <Text
                            style={styles.text}
                            variant={
                                isTablet
                                    ? 'headlineSmall'
                                    : isSmallMb
                                    ? 'bodySmall'
                                    : 'bodyLarge'
                            }
                        >
                            Select branch
                        </Text>
                    </Button>
                </TouchableOpacity>
            </View>

            <Text
                variant={
                    isTablet
                        ? 'headlineSmall'
                        : isSmallMb
                        ? 'bodyLarge'
                        : 'titleLarge'
                }
                style={styles.textBranch}
            >
                Branch : {branchValue?.branchName}
            </Text>

            <ShortcutMenu
                navigation={navigation}
                route={route}
                handleDownload={handleOpenDialogDownload}
                handleUpload={handleOpenDialogUpload}
                online={form.getValues('online')}
            />
            <ToastComponent />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: isSmallMb ? 10 : 20
    },
    modeSectionWrap: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: isSmallMb ? 5 : 10
    },
    modeSection: {
        display: 'flex',
        flexDirection: 'row'
    },
    text: {
        fontFamily: 'DMSans-Bold',
        color: theme.colors.black
    },
    searchBranchButton: {
        marginTop: isSmallMb ? 15 : 20,
        width: '100%',
        backgroundColor: theme.colors.warning,
        borderRadius: 10
    },
    textBranch: {
        fontFamily: 'DMSans-Bold',
        marginTop: isSmallMb ? 10 : 20
    },
    modeBranchWrap: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default HomeScreen;
