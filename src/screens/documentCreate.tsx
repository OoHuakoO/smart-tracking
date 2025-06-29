import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import SearchButton from '@src/components/core/searchButton';
import AddAssetCard from '@src/components/views/addAssetCard';
import PopupScanAsset from '@src/components/views/popupScanAsset';
import {
    CONFIRM,
    MOVEMENT_ASSET_EN,
    RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND,
    USE_STATE_ASSET_TH,
    WARNING
} from '@src/constant';
import { getAsset } from '@src/db/asset';
import { getDBConnection } from '@src/db/config';
import {
    getDocumentLine,
    insertDocumentLineData
} from '@src/db/documentLineOffline';
import { removeReportAssetNotFoundByCode } from '@src/db/reportAssetNotFound';
import { getUseStatus } from '@src/db/useStatus';
import { GetAssetSearch } from '@src/services/asset';
import { AddDocumentLine, GetDocumentLineSearch } from '@src/services/document';
import { GetUseStatus } from '@src/services/downloadDB';
import { BranchState, documentState, loginState } from '@src/store';
import { theme } from '@src/theme';
import { AssetDataForPassParamsDocumentCreate } from '@src/typings/asset';
import { DocumentState, LoginState } from '@src/typings/common';
import { AssetData, UseStatusData } from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode, handleMapMovementStateValue } from '@src/utils/common';
import { parseDateStringTime } from '@src/utils/time-manager';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
    BackHandler,
    Dimensions,
    FlatList,
    LogBox,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { isTablet } from 'react-native-device-info';
import {
    MediaType,
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecoilValue } from 'recoil';

type DocumentCreateProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentCreate'
>;

const { width } = Dimensions.get('window');
const isSmallMb = width < 400;

const DocumentCreateScreen: FC<DocumentCreateProps> = (props) => {
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state'
    ]);
    const { navigation, route } = props;
    const { top } = useSafeAreaInsets();
    const [assetCode, setAssetCode] = useState('');
    const [listAssetCreate, setListAssetCreate] = useState<AssetData[]>([]);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
    const [assetCodeNew, setAssetCodeNew] = useState<string>('');
    const [assetCodeRemove, setAssetCodeRemove] = useState<string>('');
    const documentValue = useRecoilValue<DocumentState>(documentState);
    const [listUseState, setListUseState] = useState<UseStatusData[]>([]);
    const [searchUseState, setSearchUseState] = useState<string>('');
    const [quantityInput, setQuantityInput] = useState<string>('1');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isFocusUseState, setIsFocusUseState] = useState<boolean>(false);
    const [visiblePopupScanAsset, setVisiblePopupScanAsset] =
        useState<boolean>(false);
    const [visibleDialogCamera, setVisibleDialogCamera] =
        useState<boolean>(false);
    const [scanAssetData, setScanAssetData] = useState<AssetData>();
    const [online, setOnline] = useState<boolean>(false);
    const loginValue = useRecoilValue<LoginState>(loginState);
    const inputRef = useRef(null);
    const branchValue = useRecoilValue(BranchState);

    const clearStateDialog = useCallback(() => {
        setVisibleDialog(false);
        setTitleDialog('');
        setContentDialog('');
        setShowCancelDialog(false);
    }, []);

    const handleRemoveAsset = useCallback(async () => {
        try {
            setListAssetCreate((prev) => {
                const listAssetFilter = prev.filter(
                    (item) => item?.default_code !== assetCodeRemove
                );
                return listAssetFilter;
            });
            clearStateDialog();
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong remove asset');
        }
    }, [clearStateDialog, assetCodeRemove]);

    const toggleDialogCamera = () => {
        setVisibleDialogCamera(!visibleDialogCamera);
    };

    const handleCloseDialogCamera = useCallback(() => {
        setVisibleDialogCamera(false);
    }, []);

    const handleClosePopupScanAsset = useCallback(() => {
        inputRef.current.focus();
        setVisiblePopupScanAsset(false);
    }, []);

    const handleSetTrueIsFocusUseState = useCallback(() => {
        setIsFocusUseState(true);
    }, []);

    const handleSetFalseIsFocusUseState = useCallback(() => {
        setIsFocusUseState(false);
    }, []);

    const handleSetSearchUseState = useCallback((name: string) => {
        setSearchUseState(name);
    }, []);

    const handleSetQuantityInput = useCallback((value: string) => {
        setQuantityInput(value);
    }, []);

    const handleSaveAsset = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const assetList = listAssetCreate.map((assetCreate) => {
                    const listUseStateFilter = listUseState.filter(
                        (item) => item?.name === assetCreate?.use_state
                    );
                    return {
                        default_code: assetCreate?.default_code,
                        state: handleMapMovementStateValue(assetCreate?.state),
                        asset_name: assetCreate?.name,
                        category_id: assetCreate?.category_id,
                        use_state:
                            listUseStateFilter.length > 0
                                ? listUseStateFilter[0].id
                                : 2,
                        image: assetCreate?.image,
                        new_img: assetCreate?.new_img,
                        branch_id: branchValue?.branchId,
                        date_check: parseDateStringTime(
                            new Date(Date.now()).toISOString()
                        ),
                        quantity: parseInt(assetCreate?.quantityInput, 10)
                    };
                });
                const response = await AddDocumentLine({
                    location_id: documentValue?.location_id,
                    asset_tracking_id: documentValue?.id,
                    asset_ids: assetList
                });

                if (
                    response?.result?.message ===
                    RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND
                ) {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong add document line');
                    return;
                }
                if (response?.error) {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong add document line');
                    return;
                }
                if (response?.result?.error) {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong add document line');
                    return;
                }
            } else {
                const documentLine = [];
                const db = await getDBConnection();
                listAssetCreate.forEach(async (assetCreate) => {
                    const listUseStateFilter = listUseState.filter(
                        (item) => item?.name === assetCreate?.use_state
                    );
                    documentLine.push({
                        tracking_id: documentValue?.id,
                        code: assetCreate?.default_code,
                        name: assetCreate?.name,
                        category: assetCreate?.category,
                        category_id: assetCreate?.category_id,
                        location_id: documentValue?.location_id,
                        location_old: assetCreate?.location,
                        location: documentValue?.location,
                        state: handleMapMovementStateValue(assetCreate?.state),
                        use_state: assetCreate?.use_state,
                        use_state_code:
                            listUseStateFilter.length > 0
                                ? listUseStateFilter[0].use_status_id
                                : 2,
                        image: assetCreate?.image,
                        new_img: assetCreate?.new_img,
                        is_sync_odoo: false,
                        quantity: parseInt(assetCreate?.quantityInput, 10)
                    });
                    await removeReportAssetNotFoundByCode(
                        db,
                        assetCreate?.default_code
                    );
                });
                await insertDocumentLineData(db, documentLine);
            }
            navigation.navigate('DocumentAssetStatus');
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong save asset');
        }
    }, [
        branchValue?.branchId,
        clearStateDialog,
        documentValue?.id,
        documentValue?.location,
        documentValue?.location_id,
        listAssetCreate,
        listUseState,
        navigation
    ]);

    const handleDismissDialog = useCallback(() => {
        clearStateDialog();
    }, [clearStateDialog]);

    const handleCloseDialog = useCallback(() => {
        switch (titleDialog) {
            case WARNING:
                navigation.goBack();
                break;
            default:
                clearStateDialog();
                break;
        }
    }, [clearStateDialog, navigation, titleDialog]);

    const handleConfirmDialog = useCallback(async () => {
        switch (titleDialog) {
            case 'Asset not found in Master':
                clearStateDialog();
                navigation.navigate('DocumentCreateNewAsset', {
                    code: assetCodeNew,
                    onGoBack: (
                        assetData: AssetDataForPassParamsDocumentCreate
                    ) => {
                        setListAssetCreate((prev) => {
                            return [assetData as AssetData, ...prev];
                        });
                    }
                });
                break;
            case 'Duplicate Asset':
                inputRef.current.focus();
                clearStateDialog();
                break;
            case CONFIRM:
                handleRemoveAsset();
                break;
            case WARNING:
                handleSaveAsset();
                break;
            default:
                clearStateDialog();
                break;
        }
    }, [
        assetCodeNew,
        clearStateDialog,
        handleRemoveAsset,
        handleSaveAsset,
        navigation,
        titleDialog
    ]);

    const handleOpenDialogConfirmRemoveAsset = useCallback(
        (code: string) => {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(CONFIRM);
            setContentDialog('Do you want to remove this asset ?');
            setShowCancelDialog(true);
            setAssetCodeRemove(code);
        },
        [clearStateDialog]
    );

    const handleOpenDialogWarningBackScreen = useCallback(() => {
        clearStateDialog();
        setVisibleDialog(true);
        setTitleDialog(WARNING);
        setContentDialog(
            'Do you want to save asset before back previous screen ?'
        );
        setShowCancelDialog(true);
    }, [clearStateDialog]);

    const openImagePicker = async () => {
        try {
            const options = {
                mediaType: 'photo' as MediaType,
                includeBase64: true,
                maxHeight: 400,
                maxWidth: 400
            };

            launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    console.log('Image picker error: ', response.errorMessage);
                } else {
                    setSelectedImage(response?.assets?.[0]?.base64);
                }
            });
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong image library launch');
        }
    };

    const handleCameraLaunch = async () => {
        try {
            const options = {
                mediaType: 'photo' as MediaType,
                includeBase64: true,
                maxHeight: 400,
                maxWidth: 400
            };
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'App Camera Permission',
                        message: 'App needs access to your camera ',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK'
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Camera permission given');
                    launchCamera(options, (response) => {
                        if (response.didCancel) {
                            console.log('User cancelled camera');
                        } else if (response.errorCode) {
                            console.log(
                                'Camera Error: ',
                                response.errorMessage
                            );
                        } else {
                            setSelectedImage(response?.assets?.[0]?.base64);
                        }
                    });
                } else {
                    console.log('Camera permission denied');
                }
            } else {
                launchCamera(options, (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled camera');
                    } else if (response.errorCode) {
                        console.log('Camera Error: ', response.errorMessage);
                    } else {
                        setSelectedImage(response?.assets?.[0]?.base64);
                    }
                });
            }
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong camera launch');
        }
    };

    const handleGoBackDocumentAssetDetail = useCallback(
        (assetData: AssetDataForPassParamsDocumentCreate) => {
            setListAssetCreate((prev) => {
                return prev.map((item) => {
                    if (item?.default_code === assetData?.default_code) {
                        return {
                            ...item,
                            image: assetData?.image as string,
                            new_img: assetData?.new_img,
                            use_state: assetData?.use_state,
                            quantityInput: assetData?.quantityInput
                        };
                    }
                    return item;
                });
            });
        },
        []
    );

    const handleMapValueToSetAssetData = useCallback(
        (asset: AssetData) => {
            const use_state =
                asset.use_state?.toString() === 'false'
                    ? USE_STATE_ASSET_TH.Normal
                    : asset.use_state;

            const isToday = asset.create_date
                ? moment(asset.create_date).isBetween(
                      moment().startOf('day'),
                      moment().endOf('day'),
                      null,
                      '[]'
                  )
                : false;

            const state = isToday
                ? MOVEMENT_ASSET_EN.New
                : asset.location !== documentValue?.location
                ? MOVEMENT_ASSET_EN.Transfer
                : MOVEMENT_ASSET_EN.Normal;

            setScanAssetData({ ...asset, state, use_state });
            setSearchUseState(use_state);
            setQuantityInput(asset?.quantity?.toString());
            setVisiblePopupScanAsset(true);
            clearStateDialog();
        },
        [clearStateDialog, documentValue?.location]
    );

    const handleCheckDuplicateOnline = useCallback(
        async (code: string) => {
            const responseDocumentLine = await GetDocumentLineSearch({
                page: 1,
                limit: 10,
                search_term: {
                    and: {
                        name: code,
                        user_id: loginValue?.uid
                    }
                }
            });
            const isDuplicateAssetInDocumentLine =
                responseDocumentLine?.result?.data?.document_item_line?.length >
                0;
            const isDuplicateAssetInListAssetCreate = listAssetCreate.some(
                (item) => item?.default_code === code
            );

            if (
                isDuplicateAssetInDocumentLine ||
                isDuplicateAssetInListAssetCreate
            ) {
                setAssetCode('');
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog('Duplicate Asset');
                if (isDuplicateAssetInDocumentLine) {
                    setContentDialog(
                        `${code} is duplicate in document ${responseDocumentLine?.result?.data?.document_item_line[0]?.assets[0]?.tracking_id}`
                    );
                }
                if (isDuplicateAssetInListAssetCreate) {
                    setContentDialog(
                        `${code} is duplicate in document ${documentValue?.id}`
                    );
                }

                setShowCancelDialog(false);
                return true;
            }
            return false;
        },
        [clearStateDialog, documentValue?.id, listAssetCreate, loginValue?.uid]
    );

    const handleOnlineSearch = useCallback(
        async (code: string) => {
            if (await handleCheckDuplicateOnline(code)) return;

            const response = await GetAssetSearch({
                page: 1,
                limit: 10,
                search_term: {
                    and: {
                        default_code: code
                    }
                }
            });

            setAssetCode('');

            if (response?.error) {
                clearStateDialog();
                setVisibleDialog(true);
                setContentDialog('Something went wrong search asset');
                return;
            }

            if (response?.result?.data?.total === 0) {
                clearStateDialog();
                setAssetCodeNew(code);
                setVisibleDialog(true);
                setShowCancelDialog(true);
                setTitleDialog('Asset not found in Master');
                setContentDialog('Do you want to add new asset?');
                return;
            }

            if (response?.result?.data?.total > 0) {
                handleMapValueToSetAssetData(response?.result?.data?.asset[0]);
            }
        },
        [
            clearStateDialog,
            handleCheckDuplicateOnline,
            handleMapValueToSetAssetData
        ]
    );

    const handleCheckDuplicateOffline = useCallback(
        async (code: string) => {
            const db = await getDBConnection();
            let isDuplicateAssetInListDocumentLineDB = false;

            const isDuplicateAssetInListAssetCreate = listAssetCreate.some(
                (item) => item?.default_code === code
            );

            const filterDocumentLine = {
                default_code: code
            };

            const listDocumentLineDB = await getDocumentLine(
                db,
                filterDocumentLine,
                null,
                1,
                1000
            );

            const duplicateDocumentLine = listDocumentLineDB?.filter(
                (documentLine) => !documentLine.is_cancel
            );

            if (duplicateDocumentLine?.length > 0) {
                isDuplicateAssetInListDocumentLineDB = true;
            }

            if (
                isDuplicateAssetInListDocumentLineDB ||
                isDuplicateAssetInListAssetCreate
            ) {
                setAssetCode('');
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog('Duplicate Asset');

                if (isDuplicateAssetInListDocumentLineDB) {
                    setContentDialog(
                        `${code} is duplicate in document ${duplicateDocumentLine[0]?.tracking_id}`
                    );
                }
                if (isDuplicateAssetInListAssetCreate) {
                    setContentDialog(
                        `${code} is duplicate in document ${documentValue?.id}`
                    );
                }
                setShowCancelDialog(false);
                return true;
            }
            return false;
        },
        [clearStateDialog, documentValue?.id, listAssetCreate]
    );

    const handleOfflineSearch = useCallback(
        async (code: string) => {
            const db = await getDBConnection();
            if (await handleCheckDuplicateOffline(code)) return;

            const filter = {
                default_code: code
            };

            const asset = await getAsset(db, filter);

            setAssetCode('');

            if (asset.length === 0) {
                clearStateDialog();
                setAssetCodeNew(code);
                setVisibleDialog(true);
                setShowCancelDialog(true);
                setTitleDialog('Asset not found in Master');
                setContentDialog('Do you want to add new asset?');
                return;
            }
            handleMapValueToSetAssetData(asset[0]);
        },
        [
            clearStateDialog,
            handleCheckDuplicateOffline,
            handleMapValueToSetAssetData
        ]
    );

    const handleSearchAsset = useCallback(
        async (code: string) => {
            try {
                if (code === '' || code === undefined || code === null) return;
                if (code.toLowerCase().includes('error')) {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog(
                        'Cannot find the code. Please try Scan again.'
                    );
                    return;
                }

                inputRef.current.focus();
                setSelectedImage(null);
                const isOnline = await getOnlineMode();
                if (isOnline) {
                    handleOnlineSearch(code);
                } else {
                    handleOfflineSearch(code);
                }
                navigation.setParams({ codeFromAssetSearch: null });
            } catch (err) {
                clearStateDialog();
                setVisibleDialog(true);
                setContentDialog('Something went wrong search asset');
            }
        },
        [clearStateDialog, handleOfflineSearch, handleOnlineSearch, navigation]
    );

    const getImage = useCallback((): string => {
        if (scanAssetData?.image?.toString() !== 'false' && selectedImage) {
            return selectedImage;
        }
        if (scanAssetData?.image?.toString() === 'false' && selectedImage) {
            return selectedImage;
        }
        if (scanAssetData?.image?.toString() !== 'false' && !selectedImage) {
            return scanAssetData?.image;
        }
        if (scanAssetData?.image?.toString() === 'false' && !selectedImage) {
            return 'false';
        }
    }, [scanAssetData?.image, selectedImage]);

    const handleSaveEditAsset = useCallback(async () => {
        try {
            inputRef.current.focus();
            const updatedScanAssetData = {
                ...scanAssetData,
                use_state: searchUseState,
                image: getImage() !== 'false' ? getImage() : false,
                new_img: selectedImage ? true : false,
                quantityInput: quantityInput
            };
            setListAssetCreate((prev) => {
                return [updatedScanAssetData as AssetData, ...prev];
            });
            setVisiblePopupScanAsset(false);
            setScanAssetData(null);
        } catch (err) {
            clearStateDialog();
            setVisiblePopupScanAsset(false);
            setScanAssetData(null);
            setVisibleDialog(true);
            setContentDialog('Something went wrong save edit asset');
        }
    }, [
        clearStateDialog,
        getImage,
        quantityInput,
        scanAssetData,
        searchUseState,
        selectedImage
    ]);

    const handleFetchListUseState = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            setOnline(isOnline);
            if (isOnline) {
                const responseUseStatus = await GetUseStatus({
                    page: 1,
                    limit: 1000
                });
                setListUseState(responseUseStatus?.result?.data.data);
            } else {
                const db = await getDBConnection();
                const listUseStatusDB = await getUseStatus(db, 1, 1000);
                setListUseState(listUseStatusDB);
            }
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
        }
    }, [clearStateDialog]);

    useEffect(() => {
        handleSearchAsset(route?.params?.codeFromAssetSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route?.params?.codeFromAssetSearch]);

    useEffect(() => {
        handleFetchListUseState();
    }, [handleFetchListUseState]);

    useEffect(() => {
        const onBackPress = () => {
            if (listAssetCreate.length > 0) {
                handleOpenDialogWarningBackScreen();
            } else {
                navigation.goBack();
            }
            return true;
        };
        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        return () => {
            subscription.remove();
        };
    }, [
        handleOpenDialogWarningBackScreen,
        handleSearchAsset,
        listAssetCreate.length,
        navigation
    ]);

    return (
        <SafeAreaView style={[styles.container, { marginTop: top }]}>
            <AlertDialog
                textTitle={titleDialog}
                textContent={contentDialog}
                visible={visibleDialog}
                handleClose={handleCloseDialog}
                handleConfirm={handleConfirmDialog}
                handleDismiss={handleDismissDialog}
                showCloseDialog={showCancelDialog}
            />
            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#2C86BF', '#2C86BF', '#8DC4E6']}
                style={styles.topSectionList}
            >
                <View style={styles.backToPrevious}>
                    <BackButton
                        handlePress={() => {
                            if (listAssetCreate.length > 0) {
                                handleOpenDialogWarningBackScreen();
                            } else {
                                navigation.goBack();
                            }
                        }}
                    />
                </View>
                <View style={styles.containerText}>
                    <Text
                        variant={isSmallMb ? 'titleMedium' : 'headlineMedium'}
                        style={styles.textHeader}
                    >
                        Add Asset
                    </Text>
                    <Text
                        variant={isSmallMb ? 'titleMedium' : 'headlineMedium'}
                        style={styles.textHeader}
                    >
                        {online
                            ? `${documentValue?.name} - ${documentValue?.id}`
                            : `Document : ${documentValue?.id}`}
                    </Text>
                    <Text
                        variant={
                            isTablet()
                                ? 'titleLarge'
                                : isSmallMb
                                ? 'bodyMedium'
                                : 'bodyLarge'
                        }
                        style={styles.textDescription}
                    >
                        Location : {documentValue?.location || '-'}
                    </Text>
                    <Text
                        variant={
                            isTablet()
                                ? 'titleLarge'
                                : isSmallMb
                                ? 'bodyMedium'
                                : 'bodyLarge'
                        }
                        style={styles.textDescription}
                    >
                        Branch : {branchValue?.branchName}
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <View style={styles.searchContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('DocumentScanAsset', {
                                onGoBack: (code: string) => {
                                    setAssetCode(code);
                                    handleSearchAsset(code);
                                }
                            });
                        }}
                        activeOpacity={0.5}
                    >
                        <ActionButton
                            icon="camera"
                            size="small"
                            backgroundColor={theme.colors.actionButton}
                            color={theme.colors.white}
                        />
                    </TouchableOpacity>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        value={assetCode}
                        autoFocus
                        onChangeText={(text) => setAssetCode(text)}
                        placeholder="Input Code Or Scan"
                        placeholderTextColor={theme.colors.textBody}
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                            handleSearchAsset(assetCode);
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => handleSearchAsset(assetCode)}
                    >
                        <ActionButton
                            icon="plus"
                            size="small"
                            backgroundColor={theme.colors.actionButton}
                            color={theme.colors.white}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchButtonWrap}>
                    <SearchButton
                        handlePress={() => {
                            navigation.navigate('DocumentAssetSearch');
                        }}
                    />
                </View>
                <Text variant="bodyLarge" style={styles.textTotalDocument}>
                    Count Asset : {listAssetCreate?.length}
                </Text>
                <FlatList
                    data={listAssetCreate}
                    renderItem={({ item }) => (
                        <View style={styles.wrapDetailList}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() =>
                                    navigation.navigate('DocumentAssetDetail', {
                                        assetData: {
                                            code: item?.default_code,
                                            name: item?.name,
                                            category: item?.category,
                                            serial_no: item?.serial_no,
                                            location: item?.location,
                                            state: item?.state,
                                            use_state: item?.use_state,
                                            new_img: item?.new_img,
                                            image: item?.image,
                                            quantityInput: item?.quantityInput
                                        },
                                        routeBefore: route?.name,
                                        onGoBack:
                                            handleGoBackDocumentAssetDetail
                                    })
                                }
                                style={styles.searchButton}
                            >
                                <AddAssetCard
                                    imageSource={item?.image}
                                    assetCode={item?.default_code}
                                    assetName={item?.name}
                                    assetStatus={item?.use_state}
                                    assetMovement={item?.state}
                                    assetLocation={item?.location}
                                    assetNewLocation={documentValue?.location}
                                    handleRemoveAsset={
                                        handleOpenDialogConfirmRemoveAsset
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.default_code?.toString()}
                />
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        {
                            backgroundColor:
                                listAssetCreate?.length > 0
                                    ? theme.colors.primary
                                    : theme.colors.disableSwitch
                        }
                    ]}
                    onPress={() => handleSaveAsset()}
                    disabled={listAssetCreate?.length === 0}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <PopupScanAsset
                    visiblePopupScanAsset={visiblePopupScanAsset}
                    visibleDialogCamera={visibleDialogCamera}
                    onClosePopupScanAsset={handleClosePopupScanAsset}
                    onCloseDialogCamera={handleCloseDialogCamera}
                    toggleDialogCamera={toggleDialogCamera}
                    openImagePicker={openImagePicker}
                    handleCameraLaunch={handleCameraLaunch}
                    selectedImage={selectedImage}
                    listUseState={listUseState}
                    searchUseState={searchUseState}
                    isFocusUseState={isFocusUseState}
                    handleSetTrueIsFocusUseState={handleSetTrueIsFocusUseState}
                    handleSetFalseIsFocusUseState={
                        handleSetFalseIsFocusUseState
                    }
                    handleSetSearchUseState={handleSetSearchUseState}
                    handleSetQuantityInput={handleSetQuantityInput}
                    handleSaveEditAsset={handleSaveEditAsset}
                    scanAssetData={scanAssetData}
                    locationNew={documentValue?.location}
                    quantityInput={quantityInput}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topSectionList: {
        height: hp('45%'),
        width: wp('100%'),
        position: 'absolute',
        display: 'flex'
    },
    backToPrevious: {
        marginVertical: isTablet() ? 0 : 15,
        marginBottom: 10,
        marginHorizontal: 15,
        display: 'flex',
        flexDirection: 'row'
    },

    searchButtonWrap: {
        position: 'absolute',
        zIndex: 0,
        right: 25,
        top: -20
    },

    searchContainer: {
        marginTop: 30,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    statusText: {
        color: theme.colors.pureWhite
    },
    containerText: {
        marginHorizontal: 20
    },
    textHeader: {
        color: theme.colors.pureWhite,
        fontFamily: 'DMSans-Bold',
        marginBottom: 5
    },
    textDescription: {
        fontFamily: 'Sarabun-Regular',
        color: theme.colors.pureWhite,
        padding: isTablet() ? 5 : 0
    },
    listSection: {
        flex: 1,
        height: hp('30%'),
        width: wp('100%'),
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: isTablet() ? '30%' : '50%'
    },
    wrapDetailList: {
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        marginTop: 20,
        marginBottom: 5
    },

    textTotalDocument: {
        marginLeft: 20,
        marginTop: 10,
        fontFamily: 'DMSans-Bold',
        fontSize: 15,
        marginBottom: 20
    },

    saveButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20
    },

    buttonText: {
        color: theme.colors.pureWhite,
        fontFamily: 'DMSans-Bold',
        fontSize: 16
    },
    dialogActionConfirm: {
        paddingVertical: 2,
        backgroundColor: theme.colors.buttonConfirm,
        borderRadius: 10,
        height: 48
    },
    textActionConfirm: {
        fontFamily: 'DMSans-Medium',
        color: theme.colors.white
    },
    input: {
        height: 48,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 10,
        fontFamily: 'DMSans-Bold',
        color: theme.colors.textBody,
        width: '60%',
        marginRight: 15,
        marginLeft: 15
    },
    searchButton: {
        zIndex: 2
    },
    button: {
        height: 60,
        borderRadius: 30,
        marginVertical: 12,
        width: '100%',
        backgroundColor: '#dddddd',
        justifyContent: 'center'
    }
});
export default DocumentCreateScreen;
