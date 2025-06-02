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
import PopupDocumentDoneOdoo from '@src/components/views/popupDocumentDoneOdoo';
import ShortcutMenu from '@src/components/views/shortcutMenu';
import {
    MOVEMENT_ASSET_EN,
    RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND,
    RESPONSE_PUT_DOCUMENT_SUCCESS,
    SOMETHING_WENT_WRONG,
    STATE_ASSET,
    STATE_DOCUMENT_NAME,
    STATE_DOCUMENT_VALUE,
    WARNING
} from '@src/constant';
import {
    createTableAsset,
    getAsset,
    getTotalAssets,
    insertAssetData
} from '@src/db/asset';
import { createTableBranch, insertBranchData } from '@src/db/branch';
import { createTableCategory, insertCategoryData } from '@src/db/category';
import { clearDataAllTable, clearDocumentTable } from '@src/db/common';
import { getDBConnection } from '@src/db/config';
import {
    createTableDocumentLine,
    getDocumentLine,
    insertDocumentLineData
} from '@src/db/documentLineOffline';
import {
    createTableDocumentOffline,
    getDocumentOffline,
    insertListDocumentOfflineData
} from '@src/db/documentOffline';
import { createTableLocation, insertLocationData } from '@src/db/location';
import {
    createTableReportAssetNotFound,
    insertReportAssetNotFound
} from '@src/db/reportAssetNotFound';
import { insertUserOffline } from '@src/db/userOffline';
import { createTableUseStatus, insertUseStatusData } from '@src/db/useStatus';
import { GetAssetNotFoundSearch } from '@src/services/asset';
import { GetBranches } from '@src/services/branch';
import {
    AddDocumentLine,
    CreateDocument,
    DeleteDocumentLine,
    GetDocumentById,
    GetDocumentLineSearch,
    GetDocumentSearch,
    UpdateDocument,
    UpdateDocumentLine
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
import { DocumentAssetData, DocumentData } from '@src/typings/document';
import {
    AssetData,
    CategoryData,
    LocationData,
    UseStatusData
} from '@src/typings/downloadDB';
import { SettingParams, UserList } from '@src/typings/login';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { ErrorResponse } from '@src/utils/axios';
import {
    handleMapDocumentStateName,
    handleMapDocumentStateValue
} from '@src/utils/common';
import { parseDateStringTime } from '@src/utils/time-manager';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    BackHandler,
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { isTablet } from 'react-native-device-info';
import KeepAwake from 'react-native-keep-awake';
import { Button, Portal, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HomeScreenProps = NativeStackScreenProps<PrivateStackParamsList, 'Home'>;

const { width } = Dimensions.get('window');
const isSmallMb = width < 400;

const HomeScreen: FC<HomeScreenProps> = (props) => {
    const { navigation, route } = props;
    const { top } = useSafeAreaInsets();
    const form = useForm<SettingParams>({});
    const setLogin = useSetRecoilState<LoginState>(loginState);
    const setToast = useSetRecoilState<Toast>(toastState);
    const setBranch = useSetRecoilState<BranchStateProps>(BranchState);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [visibleDocumentDoneDialog, setVisibleDocumentDoneDialog] =
        useState<boolean>(false);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [contentDialog, setContentDialog] = useState<string>('');
    const [disableCloseDialog, setDisableCloseDialog] =
        useState<boolean>(false);
    const [typeDialog, setTypeDialog] = useState<string>('warning');
    const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const [showProgressBarDocumentDone, setShowProgressBarDocumentDone] =
        useState<boolean>(false);
    const [listTrackingID, setListTrackingId] = useState<number[]>([]);
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

    const showDialogWarning = useCallback(
        (message: string) => {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setContentDialog(message);
            setTypeDialog('warning');
        },
        [clearStateDialog]
    );

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
                const db = await getDBConnection();
                await clearDataAllTable(db);
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
            return showDialogWarning(
                'Network Disconnected, please open internet to download'
            );
        }
    }, [clearStateDialog, isConnected, showDialogWarning]);

    const handleOpenDialogUpload = useCallback(async () => {
        if (isConnected) {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog('Upload');
            setContentDialog('Do you want to upload document ?');
            setTypeDialog('upload');
            setShowCancelDialog(true);
        } else {
            return showDialogWarning(
                `Network disconnected, please open internet to download`
            );
        }
    }, [clearStateDialog, isConnected, showDialogWarning]);

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
                showDialogWarning('Something went wrong load location');
                return [];
            }
        },
        [showDialogWarning]
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
                showDialogWarning('Something went wrong load use status');
                return [];
            }
        },
        [showDialogWarning]
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
                showDialogWarning('Something went wrong load category');
                return [];
            }
        },
        [showDialogWarning]
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
                showDialogWarning('Something went wrong load asset not found');
                return [];
            }
        },
        [showDialogWarning]
    );

    const handleLoadDocumentLine = useCallback(
        async (totalPages: number): Promise<DocumentAssetData[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetDocumentLineSearch({
                        page: i + 1,
                        limit: 1000
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
                showDialogWarning('Something went wrong load documentLine');
                return [];
            }
        },
        [showDialogWarning]
    );

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
                showDialogWarning('Something went wrong load user offline');
                return [];
            }
        },
        [showDialogWarning]
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
                showDialogWarning('Something went wrong load branch');
                return [];
            }
        },
        [showDialogWarning]
    );

    const handleLoadDocument = useCallback(
        async (totalPages: number): Promise<DocumentData[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetDocumentSearch({
                        page: i + 1,
                        limit: 1000,
                        search_term: {
                            and: {
                                state: handleMapDocumentStateName(
                                    STATE_DOCUMENT_NAME.DocumentDownload
                                ),
                                branch_id: branchValue?.branchId
                            }
                        }
                    })
                );
                const results = await Promise.all(promises);
                const branches = results.flatMap(
                    (result) => result?.result?.data?.documents ?? []
                );
                return branches;
            } catch (err) {
                console.log(err);
                showDialogWarning('Something went wrong load document');
                return [];
            }
        },
        [branchValue?.branchId, showDialogWarning]
    );

    const handleDownload = useCallback(async () => {
        try {
            setShowProgressBar(true);
            const foundMacAddress = await handleCheckMacAddress();
            if (!foundMacAddress) {
                return showDialogWarning(
                    `This device does not have permission to download`
                );
            }

            setDisableCloseDialog(true);

            const [
                initialResponseAssets,
                initialResponseLocation,
                initialResponseUseStatus,
                initialResponseCategory,
                initialResponseAssetNotFound,
                initialDocumentLine,
                initialUserOffline,
                initialBranch,
                initialDocument
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
                    limit: 1000
                }),
                GetAllUserOffline({
                    page: 1,
                    limit: 1000
                }),
                GetBranches({
                    page: 1,
                    limit: 1000
                }),
                GetDocumentSearch({
                    page: 1,
                    limit: 10,
                    search_term: {
                        and: {
                            state: handleMapDocumentStateName(
                                STATE_DOCUMENT_NAME.DocumentDownload
                            ),
                            branch_id: branchValue?.branchId
                        }
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
            const errorUserOffline = handleResponseError(
                initialUserOffline?.error
            );
            const errorBranch = handleResponseError(initialBranch?.error);
            const errorDocument = handleResponseError(initialDocument?.error);

            if (
                errorAssets ||
                errorLocation ||
                errorUseStatus ||
                errorCategorys ||
                errorAssetNotFound ||
                errorDocumentLine ||
                errorUserOffline ||
                errorBranch ||
                errorDocument
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
            const totalPagesBranch = initialBranch?.result?.data?.total_page;
            const totalPagesDocument =
                initialDocument?.result?.data?.total_page;

            const [
                listLocation,
                listUseStatus,
                listCategory,
                listAssetNotFound,
                listDocumentLine,
                listUserOffline,
                listBranch,
                listDocument
            ] = await Promise.all([
                handleLoadLocation(totalPagesLocation),
                handleLoadUseStatus(totalPagesUseStatus),
                handleLoadCategory(totalPagesCategory),
                handleLoadAssetNotFound(totalPagesAssetNotFound),
                handleLoadDocumentLine(totalPagesDocumentLine),
                handleLoadUserOffline(totalPagesUserOffline),
                handleLoadBranch(totalPagesBranch),
                handleLoadDocument(totalPagesDocument)
            ]);

            const db = await getDBConnection();
            await clearDataAllTable(db);

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
                await insertLocationData(db, listLocation);
                await insertUseStatusData(db, listUseStatus);
                await insertCategoryData(db, listCategory);
                await insertBranchData(db, listBranch);
                if (listDocument?.length > 0) {
                    const newListDocumentLine = listDocument?.map(
                        (document) => {
                            return {
                                ...document,
                                state: handleMapDocumentStateValue(
                                    document.state
                                ),
                                is_sync_odoo: true
                            };
                        }
                    );
                    await insertListDocumentOfflineData(
                        db,
                        newListDocumentLine
                    );
                }
                if (listDocumentLine?.length > 0) {
                    const newListDocumentLine = await Promise.all(
                        listDocumentLine.map(async (documentLine) => {
                            const filter = {
                                default_code: documentLine?.code
                            };

                            const asset = await getAsset(db, filter);

                            let state: string;

                            if (asset.length === 0) {
                                state = MOVEMENT_ASSET_EN.New;
                            } else {
                                const isToday = asset?.[0]?.create_date
                                    ? moment(asset?.[0]?.create_date).isBetween(
                                          moment().startOf('day'),
                                          moment().endOf('day'),
                                          null,
                                          '[]'
                                      )
                                    : false;

                                state = isToday
                                    ? MOVEMENT_ASSET_EN.New
                                    : documentLine.location !==
                                      documentLine.location_old
                                    ? MOVEMENT_ASSET_EN.Transfer
                                    : MOVEMENT_ASSET_EN.Normal;
                            }

                            const filterUseStatus = listUseStatus.filter(
                                (item) => documentLine.use_state === item?.name
                            );

                            return {
                                ...documentLine,
                                is_sync_odoo: true,
                                name: documentLine?.asset_name,
                                use_state_code: filterUseStatus[0]?.id,
                                state: documentLine?.state
                                    ? documentLine?.state
                                    : state
                            };
                        })
                    );
                    await insertDocumentLineData(db, newListDocumentLine);
                }
                if (listAssetNotFound?.length > 0) {
                    await insertReportAssetNotFound(db, listAssetNotFound);
                }
                if (listUserOffline?.length > 0) {
                    await insertUserOffline(db, listUserOffline);
                }
            }
            setTimeout(() => {
                setToast({ open: true, text: 'Download Successfully' });
            }, 0);
            clearStateDialog();
        } catch (err) {
            console.log(err);
            showDialogWarning(`Something went wrong download`);
        }
    }, [
        branchValue?.branchId,
        clearStateDialog,
        handleCheckMacAddress,
        handleLoadAssetNotFound,
        handleLoadBranch,
        handleLoadCategory,
        handleLoadDocument,
        handleLoadDocumentLine,
        handleLoadLocation,
        handleLoadUseStatus,
        handleLoadUserOffline,
        handleResponseError,
        setToast,
        showDialogWarning
    ]);

    const mapUploadDocumentLines = useCallback(
        (documentLines) => {
            return documentLines.map((line) => ({
                default_code: line?.code,
                asset_name: line?.name,
                category_id: line?.category_id,
                state: line?.state,
                use_state: line?.use_state_code,
                new_img: line?.new_img ? true : false,
                branch_id: branchValue?.branchId,
                quantity: line?.quantity,
                date_check: parseDateStringTime(line?.date_check),
                ...(line?.image !== 'false' && { image: line?.image })
            }));
        },
        [branchValue?.branchId]
    );

    const mapUploadDeleteDocumentLines = useCallback((documentLines) => {
        return documentLines.map((line) => ({
            default_code: line?.code
        }));
    }, []);

    const checkIsEmptyDocument = useCallback(async (db): Promise<boolean> => {
        const filterDocument = {
            state: STATE_DOCUMENT_NAME?.Draft
        };
        const listDocument = await getDocumentOffline(
            db,
            filterDocument,
            null,
            1,
            1000
        );

        for (const item of listDocument) {
            try {
                const listDocumentLine = await getDocumentLine(
                    db,
                    {
                        tracking_id: item?.tracking_id,
                        is_cancel: false
                    },
                    null,
                    1,
                    1000
                );

                if (listDocumentLine.length === 0) {
                    return true;
                }
            } catch (error) {
                console.error('Document Upload Error:', error);
                throw error;
            }
        }
        return false;
    }, []);

    const checkIsEmptyUseStateInDocumentLine = useCallback(
        async (db): Promise<boolean> => {
            const listDocumentLine = await getDocumentLine(
                db,
                {
                    is_null_use_state: true
                },
                null,
                1,
                1000
            );

            if (listDocumentLine.length > 0) {
                return true;
            }

            return false;
        },
        []
    );

    const uploadNewDocuments = useCallback(
        async (db, isDocumentDone) => {
            const filterDocument = {
                ...(isDocumentDone
                    ? { tracking_ids: listTrackingID }
                    : { state: STATE_DOCUMENT_NAME?.Draft })
            };

            const listDocumentNew = (
                await getDocumentOffline(db, filterDocument, null, 1, 1000)
            ).filter((doc) => {
                if (!isDocumentDone) {
                    return !doc?.is_sync_odoo;
                }
                return true;
            });

            for (const item of listDocumentNew) {
                try {
                    const responseCreateDocument = await CreateDocument({
                        location_id: item?.location_id,
                        date_order: parseDateStringTime(item?.date_order),
                        android_id: item?.tracking_id?.toString(),
                        branch_id: branchValue?.branchId
                    });

                    if (responseCreateDocument?.error) {
                        throw new Error(
                            'Something went wrong creating document'
                        );
                    }

                    const listDocumentLine = await getDocumentLine(
                        db,
                        {
                            tracking_id: item?.tracking_id,
                            is_cancel: false
                        },
                        null,
                        1,
                        1000
                    );

                    if (listDocumentLine.length > 0) {
                        const asset_ids =
                            mapUploadDocumentLines(listDocumentLine);

                        const responseAddDocumentLine = await AddDocumentLine({
                            location_id: item?.location_id,
                            asset_tracking_id:
                                responseCreateDocument?.result?.data?.id,
                            asset_ids
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
                    }

                    const responseCheckDocument = await UpdateDocument({
                        document_data: {
                            id: responseCreateDocument?.result?.data?.id,
                            state: STATE_DOCUMENT_VALUE.Check
                        }
                    });

                    if (
                        responseCheckDocument?.result?.message !==
                        RESPONSE_PUT_DOCUMENT_SUCCESS
                    ) {
                        throw new Error(
                            'Something went wrong updating check document'
                        );
                    }
                    const responseDoneDocument = await UpdateDocument({
                        document_data: {
                            id: responseCreateDocument?.result?.data?.id,
                            state: STATE_DOCUMENT_VALUE.Done
                        }
                    });
                    if (
                        responseDoneDocument?.result?.message !==
                        RESPONSE_PUT_DOCUMENT_SUCCESS
                    ) {
                        throw new Error(
                            'Something went wrong updating done document'
                        );
                    }
                } catch (error) {
                    console.error('Document Upload Error:', error);
                    throw error;
                }
            }
        },
        [branchValue?.branchId, listTrackingID, mapUploadDocumentLines]
    );

    const updateExistingDocuments = useCallback(
        async (db): Promise<number[]> => {
            let listTrackingIDDocumentDone: number[] = [];
            const filterDraftDocument = {
                state: STATE_DOCUMENT_NAME?.Draft
            };
            const filterCheckDocument = {
                state: STATE_DOCUMENT_NAME?.Check
            };
            const filterCancelDocument = { state: STATE_DOCUMENT_NAME?.Cancel };
            const listDraftDocumentOdoo = (
                await getDocumentOffline(db, filterDraftDocument, null, 1, 1000)
            ).filter((doc) => doc?.is_sync_odoo);

            const listCheckDocumentOdoo = (
                await getDocumentOffline(db, filterCheckDocument, null, 1, 1000)
            ).filter((doc) => doc?.is_sync_odoo);

            const listCancelDocumentOdoo = (
                await getDocumentOffline(
                    db,
                    filterCancelDocument,
                    null,
                    1,
                    1000
                )
            ).filter((doc) => doc?.is_sync_odoo);

            for (const item of listCancelDocumentOdoo) {
                try {
                    const responseGetDocument = await GetDocumentById(
                        item?.tracking_id
                    );

                    if (
                        responseGetDocument?.result?.data?.asset?.state ===
                            STATE_DOCUMENT_VALUE.Done ||
                        responseGetDocument?.result?.data?.asset?.state ===
                            STATE_DOCUMENT_VALUE.Check
                    ) {
                        continue;
                    }

                    const responseCancelDocument = await UpdateDocument({
                        document_data: {
                            id: item?.tracking_id,
                            state: STATE_DOCUMENT_VALUE.Cancel
                        }
                    });
                    if (
                        responseCancelDocument?.result?.message !==
                        RESPONSE_PUT_DOCUMENT_SUCCESS
                    ) {
                        throw new Error(
                            'Something went wrong updating cancel document'
                        );
                    }
                } catch (error) {
                    console.error('Document Upload Error:', error);
                    throw error;
                }
            }

            for (const item of listDraftDocumentOdoo) {
                try {
                    const responseGetDocument = await GetDocumentById(
                        item?.tracking_id
                    );

                    if (
                        responseGetDocument?.result?.data?.asset?.state ===
                            STATE_DOCUMENT_VALUE.Done ||
                        responseGetDocument?.result?.data?.asset?.state ===
                            STATE_DOCUMENT_VALUE.Check
                    ) {
                        listTrackingIDDocumentDone.push(item?.tracking_id);
                        continue;
                    }

                    const listDeleteDocumentLine = await getDocumentLine(
                        db,
                        {
                            tracking_id: item?.tracking_id,
                            is_sync_odoo: true,
                            is_cancel: true
                        },
                        null,
                        1,
                        1000
                    );

                    if (listDeleteDocumentLine?.length > 0) {
                        const asset_ids_delete = mapUploadDeleteDocumentLines(
                            listDeleteDocumentLine
                        );

                        const responseDelete = await DeleteDocumentLine({
                            asset_tracking_id: item?.tracking_id,
                            asset_ids: asset_ids_delete
                        });

                        if (
                            responseDelete?.error ||
                            responseDelete?.result?.message ===
                                RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND
                        ) {
                            throw new Error(
                                'Something went wrong updating  delete document line'
                            );
                        }
                    }

                    const listNewDocumentLine = await getDocumentLine(
                        db,
                        {
                            tracking_id: item?.tracking_id,
                            is_sync_odoo: false,
                            is_cancel: false
                        },
                        null,
                        1,
                        1000
                    );

                    if (listNewDocumentLine.length > 0) {
                        const asset_ids =
                            mapUploadDocumentLines(listNewDocumentLine);

                        const responseAdd = await AddDocumentLine({
                            location_id: item?.location_id,
                            asset_tracking_id: item?.tracking_id,
                            asset_ids
                        });
                        if (
                            responseAdd?.result?.message ===
                                RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND ||
                            responseAdd?.error ||
                            responseAdd?.result?.error
                        ) {
                            throw new Error(
                                'Something went wrong updating add document line'
                            );
                        }
                    }

                    const listEditDocumentLine = await getDocumentLine(
                        db,
                        {
                            tracking_id: item?.tracking_id,
                            is_sync_odoo: true,
                            is_cancel: false
                        },
                        null,
                        1,
                        1000
                    );

                    if (listEditDocumentLine.length > 0) {
                        const asset_ids_edit =
                            mapUploadDocumentLines(listEditDocumentLine);
                        const responseUpdate = await UpdateDocumentLine({
                            location_id: item?.location_id,
                            asset_tracking_id: item?.tracking_id,
                            asset_ids: asset_ids_edit
                        });
                        if (
                            responseUpdate?.error ||
                            responseUpdate.result?.error
                        ) {
                            throw new Error(
                                'Something went wrong updating updated document line'
                            );
                        }
                    }

                    const responseCheckDocument = await UpdateDocument({
                        document_data: {
                            id: item?.tracking_id,
                            state: STATE_DOCUMENT_VALUE.Check
                        }
                    });
                    if (
                        responseCheckDocument?.result?.message !==
                        RESPONSE_PUT_DOCUMENT_SUCCESS
                    ) {
                        throw new Error(
                            'Something went wrong updating check document'
                        );
                    }

                    const responseDoneDocument = await UpdateDocument({
                        document_data: {
                            id: item?.tracking_id,
                            state: STATE_DOCUMENT_VALUE.Done
                        }
                    });
                    if (
                        responseDoneDocument?.result?.message !==
                        RESPONSE_PUT_DOCUMENT_SUCCESS
                    ) {
                        throw new Error(
                            'Something went wrong updating done document'
                        );
                    }
                } catch (error) {
                    console.error('Document Upload Error:', error);
                    throw error;
                }
            }

            for (const item of listCheckDocumentOdoo) {
                const responseDoneDocument = await UpdateDocument({
                    document_data: {
                        id: item?.tracking_id,
                        state: STATE_DOCUMENT_VALUE.Done
                    }
                });
                if (
                    responseDoneDocument?.result?.message !==
                    RESPONSE_PUT_DOCUMENT_SUCCESS
                ) {
                    throw new Error(
                        'Something went wrong updating done document'
                    );
                }
            }

            return listTrackingIDDocumentDone;
        },
        [mapUploadDeleteDocumentLines, mapUploadDocumentLines]
    );

    const handleDownloadDocument = useCallback(
        async (db) => {
            const [
                initialResponseAssets,
                initialResponseAssetNotFound,
                initialDocumentLine,
                initialDocument,
                initialResponseUseStatus
            ] = await Promise.all([
                GetAssets({ page: 1, limit: 200 }),
                GetAssetNotFoundSearch({
                    page: 1,
                    limit: 1000,
                    search_term: {
                        and: { state: STATE_ASSET }
                    }
                }),
                GetDocumentLineSearch({
                    page: 1,
                    limit: 1000
                }),
                GetDocumentSearch({
                    page: 1,
                    limit: 10,
                    search_term: {
                        and: {
                            state: handleMapDocumentStateName(
                                STATE_DOCUMENT_NAME.DocumentDownload
                            ),
                            branch_id: branchValue?.branchId
                        }
                    }
                }),
                GetUseStatus({ page: 1, limit: 1000 })
            ]);

            const errorAssets = handleResponseError(
                initialResponseAssets?.error
            );
            const errorAssetNotFound = handleResponseError(
                initialResponseAssetNotFound?.error
            );
            const errorDocumentLine = handleResponseError(
                initialDocumentLine?.error
            );
            const errorDocument = handleResponseError(initialDocument?.error);
            const errorUseStatus = handleResponseError(
                initialResponseUseStatus?.error
            );

            if (
                errorAssetNotFound ||
                errorDocumentLine ||
                errorDocument ||
                errorUseStatus ||
                errorAssets
            ) {
                return;
            }

            const totalPagesAssets =
                initialResponseAssets?.result?.data?.total_page;
            const totalPagesAssetNotFound =
                initialResponseAssetNotFound?.result?.data?.total_pages;
            const totalPagesDocumentLine =
                initialDocumentLine?.result?.data?.total_page;
            const totalPagesDocument =
                initialDocument?.result?.data?.total_page;
            const totalPagesUseStatus =
                initialResponseUseStatus?.result?.data?.total_page;

            const [
                listAssetNotFound,
                listDocumentLine,
                listDocument,
                listUseStatus
            ] = await Promise.all([
                handleLoadAssetNotFound(totalPagesAssetNotFound),
                handleLoadDocumentLine(totalPagesDocumentLine),
                handleLoadDocument(totalPagesDocument),
                handleLoadUseStatus(totalPagesUseStatus)
            ]);

            await clearDocumentTable(db);

            for (let index = 0; index < totalPagesAssets; index++) {
                const result = await GetAssets({
                    page: index + 1,
                    limit: 200
                });
                await insertAssetData(db, result?.result?.data?.asset);
            }

            if (listDocument?.length > 0) {
                const newListDocumentLine = listDocument?.map((document) => {
                    return {
                        ...document,
                        state: handleMapDocumentStateValue(document.state),
                        is_sync_odoo: true
                    };
                });
                await insertListDocumentOfflineData(db, newListDocumentLine);
            }
            if (listDocumentLine?.length > 0) {
                const newListDocumentLine = await Promise.all(
                    listDocumentLine.map(async (documentLine) => {
                        const filter = {
                            default_code: documentLine?.code
                        };

                        const asset = await getAsset(db, filter);

                        let state: string;

                        if (asset.length === 0) {
                            state = MOVEMENT_ASSET_EN.New;
                        } else {
                            const isToday = asset?.[0]?.create_date
                                ? moment(asset?.[0]?.create_date).isBetween(
                                      moment().startOf('day'),
                                      moment().endOf('day'),
                                      null,
                                      '[]'
                                  )
                                : false;

                            state = isToday
                                ? MOVEMENT_ASSET_EN.New
                                : documentLine.location !==
                                  documentLine.location_old
                                ? MOVEMENT_ASSET_EN.Transfer
                                : MOVEMENT_ASSET_EN.Normal;
                        }

                        const filterUseStatus = listUseStatus.filter(
                            (item) => documentLine.use_state === item?.name
                        );

                        return {
                            ...documentLine,
                            is_sync_odoo: true,
                            name: documentLine?.asset_name,
                            use_state_code: filterUseStatus[0]?.id,
                            state: documentLine?.state
                                ? documentLine?.state
                                : state
                        };
                    })
                );
                await insertDocumentLineData(db, newListDocumentLine);
            }
            if (listAssetNotFound?.length > 0) {
                await insertReportAssetNotFound(db, listAssetNotFound);
            }
        },
        [
            branchValue?.branchId,
            handleLoadAssetNotFound,
            handleLoadDocument,
            handleLoadDocumentLine,
            handleLoadUseStatus,
            handleResponseError
        ]
    );

    const handleCloseDocumentDoneDialog = useCallback(async () => {
        const db = await getDBConnection();
        setShowProgressBarDocumentDone(true);
        await handleDownloadDocument(db);
        setVisibleDocumentDoneDialog(false);
        setTimeout(() => {
            setToast({ open: true, text: 'Upload Successfully' });
        }, 0);
    }, [handleDownloadDocument, setToast]);

    const handleUpload = useCallback(async () => {
        try {
            setShowProgressBar(true);
            const foundMacAddress = await handleCheckMacAddress();
            if (!foundMacAddress) {
                return showDialogWarning(
                    `This device does not have permission to upload`
                );
            }

            setDisableCloseDialog(true);

            const db = await getDBConnection();
            if (await checkIsEmptyDocument(db)) {
                showDialogWarning(
                    'Some documents have no assets. Please cancel or add assets.'
                );
                return;
            }
            if (await checkIsEmptyUseStateInDocumentLine(db)) {
                showDialogWarning(
                    'Some documents are missing an asset use state. Please specify the use state.'
                );
                return;
            }
            await uploadNewDocuments(db, false);
            const listTrackingIDDocumentDone = await updateExistingDocuments(
                db
            );
            if (listTrackingIDDocumentDone?.length > 0) {
                setListTrackingId(listTrackingIDDocumentDone);
                setVisibleDocumentDoneDialog(true);
                clearStateDialog();
                return;
            }
            await handleDownloadDocument(db);
            setTimeout(() => {
                setToast({ open: true, text: 'Upload Successfully' });
            }, 0);
            clearStateDialog();
        } catch (err) {
            console.log(err);
            return showDialogWarning('Something went wrong upload');
        }
    }, [
        checkIsEmptyDocument,
        checkIsEmptyUseStateInDocumentLine,
        clearStateDialog,
        handleCheckMacAddress,
        handleDownloadDocument,
        setToast,
        showDialogWarning,
        updateExistingDocuments,
        uploadNewDocuments
    ]);

    const haveDocumentDraft = useCallback(async (): Promise<boolean> => {
        if (onlineValue) {
            return false;
        }
        const db = await getDBConnection();

        const listDraftDocumentOdoo = (
            await getDocumentOffline(db, null, null, 1, 1000)
        ).filter((doc) => doc?.is_sync_odoo);

        const filterDocument = {
            state: STATE_DOCUMENT_NAME?.Draft
        };

        const listDocumentDraftNew = (
            await getDocumentOffline(db, filterDocument, null, 1, 1000)
        ).filter((doc) => {
            return !doc?.is_sync_odoo;
        });

        if (
            listDraftDocumentOdoo?.length > 0 ||
            listDocumentDraftNew?.length > 0
        ) {
            return true;
        }
        return false;
    }, [onlineValue]);

    const handleSelectBranch = useCallback(() => {
        navigation.navigate('BranchSelectScreen');
        clearStateDialog();
    }, [clearStateDialog, navigation]);

    const handleNavigateBranch = useCallback(() => {
        clearStateDialog();
        navigation.navigate('BranchSelectScreen', {
            onGoBack: async (branch_id: number) => {
                if (branch_id !== branchValue?.branchId && !onlineValue) {
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

    const handleConfirmDocumentDoneDialog = useCallback(async () => {
        const db = await getDBConnection();
        setShowProgressBarDocumentDone(true);
        await uploadNewDocuments(db, true);
        await handleDownloadDocument(db);
        setVisibleDocumentDoneDialog(false);
        setShowProgressBarDocumentDone(false);
        setTimeout(() => {
            setToast({ open: true, text: 'Upload Successfully' });
        }, 0);
    }, [handleDownloadDocument, setToast, uploadNewDocuments]);

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
            showDialogWarning(SOMETHING_WENT_WRONG);
        }
    }, [clearStateDialog, isConnected, onlineValue, showDialogWarning]);

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
            showDialogWarning(
                `Network Disconnected, please open internet to select branch`
            );
        }
    }, [handleNavigateBranch, isConnected, onlineValue, showDialogWarning]);

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
                    handleClose={() =>
                        typeDialog === 'logout'
                            ? handleLogout(false)
                            : handleCloseDialog()
                    }
                    disableClose={disableCloseDialog}
                    showCloseDialog={showCancelDialog}
                    handleConfirm={handleConfirmDialog}
                    showProgressBar={showProgressBar}
                />
                <PopupDocumentDoneOdoo
                    showProgressBar={showProgressBarDocumentDone}
                    visible={visibleDocumentDoneDialog}
                    listTrackingID={listTrackingID}
                    handleClose={handleCloseDocumentDoneDialog}
                    handleConfirm={handleConfirmDocumentDoneDialog}
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
                    onPress={async () => {
                        if (await haveDocumentDraft()) {
                            clearStateDialog();
                            setDisableCloseDialog(true);
                            setTypeDialog('logout');
                            setVisibleDialog(true);
                            setContentDialog(
                                "There are documents that haven't been uploaded yet. Would you like to upload before logout?"
                            );
                            setTypeDialog('logout');
                            setShowCancelDialog(true);
                        } else {
                            handleLogout(false);
                        }
                    }}
                >
                    <View>
                        <FontAwesomeIcon
                            icon={faRightFromBracket}
                            size={isTablet() ? 30 : 20}
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
                                isTablet()
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
                    isTablet()
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
        borderRadius: 20
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
