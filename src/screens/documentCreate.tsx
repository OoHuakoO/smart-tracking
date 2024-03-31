import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import Button from '@src/components/core/button';
import AddAssetCard from '@src/components/views/addAssetCard';
import PopupScanAsset from '@src/components/views/popupScanAsset';
import SearchButton from '@src/components/views/searchButton';
import { MOVEMENT_ASSET_EN, USE_STATE_ASSET_NORMAL_EN } from '@src/constant';
import { getDBConnection } from '@src/db/config';
import { getUseStatus } from '@src/db/useStatus';
import { GetAssetByCode } from '@src/services/asset';
import { AddDocumentLine } from '@src/services/document';
import { GetUseStatus } from '@src/services/downloadDB';
import { documentAssetListState, documentState } from '@src/store';
import { theme } from '@src/theme';
import { AssetDataForPassParamsDocumentCreate } from '@src/typings/asset';
import { DocumentState } from '@src/typings/common';
import { DocumentAssetData } from '@src/typings/document';
import { AssetData, UseStatusData } from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode, handleMapMovementStateValue } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    LogBox,
    PermissionsAndroid,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
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
import { useRecoilValue } from 'recoil';

type DocumentCreateProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentCreate'
>;

const DocumentCreateScreen: FC<DocumentCreateProps> = (props) => {
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state'
    ]);
    const { navigation, route } = props;
    const [assetCode, setAssetCode] = useState('');
    const [listAssetCreate, setListAssetCreate] = useState<AssetData[]>([]);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
    const [assetCodeNew, setAssetCodeNew] = useState<string>('');
    const [idAsset, setIdAsset] = useState<number>(0);
    const documentValue = useRecoilValue<DocumentState>(documentState);
    const documentAssetListValue = useRecoilValue<DocumentAssetData[]>(
        documentAssetListState
    );
    const [listUseState, setListUseState] = useState<UseStatusData[]>([]);
    const [searchUseState, setSearchUseState] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isFocusUseState, setIsFocusUseState] = useState<boolean>(false);
    const [visiblePopupScanAsset, setVisiblePopupScanAsset] =
        useState<boolean>(false);
    const [visibleDialogCamera, setVisibleDialogCamera] =
        useState<boolean>(false);

    const [scanAssetData, setScanAssetData] = useState<AssetData>();

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
                    (item) => item?.asset_id !== idAsset
                );
                return listAssetFilter;
            });
            clearStateDialog();
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong remove asset');
        }
    }, [clearStateDialog, idAsset]);

    const handleCloseDialog = useCallback(() => {
        clearStateDialog();
    }, [clearStateDialog]);

    const toggleDialogCamera = () => {
        setVisibleDialogCamera(!visibleDialogCamera);
    };

    const handleCloseDialogCamera = useCallback(() => {
        setVisibleDialogCamera(false);
    }, []);

    const handleClosePopupScanAsset = useCallback(() => {
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

    const handleConfirmDialog = useCallback(async () => {
        switch (titleDialog) {
            case 'Asset not found in Master':
                clearStateDialog();
                navigation.navigate('DocumentCreateAsset', {
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
                clearStateDialog();
                break;
            case 'Confirm':
                await handleRemoveAsset();
                break;
            default:
                clearStateDialog();
                break;
        }
    }, [
        assetCodeNew,
        clearStateDialog,
        handleRemoveAsset,
        navigation,
        titleDialog
    ]);

    const handleOpenDialogConfirmRemoveAsset = useCallback(
        (id: number) => {
            setVisibleDialog(true);
            setTitleDialog('Confirm');
            setContentDialog('Do you want to remove this asset ?');
            setIdAsset(id);
            clearStateDialog();
        },
        [clearStateDialog]
    );

    const openImagePicker = async () => {
        try {
            const options = {
                mediaType: 'photo' as MediaType,
                includeBase64: true,
                maxHeight: 2000,
                maxWidth: 2000
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
            setVisibleDialog(true);
            setContentDialog('Something went wrong image library launch');
        }
    };

    const handleCameraLaunch = async () => {
        try {
            const options = {
                mediaType: 'photo' as MediaType,
                includeBase64: true,
                maxHeight: 2000,
                maxWidth: 2000
            };
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
                        console.log('Camera Error: ', response.errorMessage);
                    } else {
                        setSelectedImage(response?.assets?.[0]?.base64);
                    }
                });
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            setVisibleDialog(true);
            setContentDialog('Something went wrong camera launch');
        }
    };

    const handleGoBackDocumentAssetDetail = useCallback(
        (assetData: AssetDataForPassParamsDocumentCreate) => {
            setListAssetCreate((prev) => {
                return prev.map((item) => {
                    if (item?.asset_id === assetData?.asset_id) {
                        return {
                            ...item,
                            image: assetData?.image as string,
                            use_state: assetData?.use_state
                        };
                    }
                    return item;
                });
            });
        },
        []
    );

    const handleSaveAsset = useCallback(async () => {
        try {
            const assetList = listAssetCreate.map((assetCreate) => {
                listUseState.filter(
                    (item) => item?.name === assetCreate?.use_state
                );
                return {
                    id: assetCreate?.asset_id,
                    state: handleMapMovementStateValue(assetCreate?.state),
                    use_state: listUseState.length > 0 ? listUseState[0].id : 2,
                    image: assetCreate?.image,
                    new_img: false
                };
            });
            const response = await AddDocumentLine({
                location_id: documentValue?.location_id,
                asset_tracking_id: documentValue?.id,
                asset_ids: assetList
            });
            if (response?.error) {
                clearStateDialog();
                setVisibleDialog(true);
                setContentDialog('Something went wrong save asset');
                return;
            }
            if (response?.result?.error) {
                clearStateDialog();
                setVisibleDialog(true);
                setContentDialog('Something went wrong save asset');
                return;
            }
            navigation.replace('DocumentAssetStatus');
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong save asset');
        }
    }, [
        clearStateDialog,
        documentValue?.id,
        documentValue?.location_id,
        listAssetCreate,
        listUseState,
        navigation
    ]);

    const handleSearchAsset = useCallback(
        async (code: string) => {
            try {
                setAssetCode('');
                console.log(code);
                if (code !== '' && code !== undefined) {
                    if (
                        documentAssetListValue?.filter(
                            (item) => item?.code === code
                        ).length > 0 ||
                        listAssetCreate.filter(
                            (item) => item?.default_code === code
                        ).length > 0
                    ) {
                        clearStateDialog();
                        setVisibleDialog(true);
                        setTitleDialog('Duplicate Asset');
                        setShowCancelDialog(true);
                        setContentDialog(
                            `${code} is duplicate in Document ${documentValue?.id}`
                        );
                        setShowCancelDialog(false);
                        return;
                    }

                    const response = await GetAssetByCode(code);

                    if (response?.error) {
                        clearStateDialog();
                        setVisibleDialog(true);
                        setContentDialog('Something went wrong search asset');
                        return;
                    }

                    if (response?.result?.message === 'Asset not found') {
                        clearStateDialog();
                        setAssetCodeNew(code);
                        setVisibleDialog(true);
                        setShowCancelDialog(true);
                        setTitleDialog('Asset not found in Master');
                        setContentDialog('Do you want to add new asset?');
                        return;
                    }

                    if (!response?.result?.data?.asset?.use_state) {
                        response.result.data.asset.use_state =
                            USE_STATE_ASSET_NORMAL_EN;
                    }

                    if (
                        response?.result?.data?.asset?.location !==
                        documentValue?.location
                    ) {
                        response.result.data.asset.state =
                            MOVEMENT_ASSET_EN.Transfer;
                        setScanAssetData(response?.result?.data?.asset);
                        setSearchUseState(
                            response?.result?.data?.asset?.use_state
                        );
                        setVisiblePopupScanAsset(true);
                        clearStateDialog();
                        return;
                    }
                    response.result.data.asset.state = MOVEMENT_ASSET_EN.Normal;
                    setScanAssetData(response.result.data.asset);
                    setSearchUseState(response?.result?.data?.asset?.use_state);
                    setVisiblePopupScanAsset(true);
                    clearStateDialog();
                }
            } catch (err) {
                clearStateDialog();
                setVisibleDialog(true);
                setContentDialog('Something went wrong search asset');
            }
        },
        [
            clearStateDialog,
            documentAssetListValue,
            documentValue?.id,
            documentValue?.location,
            listAssetCreate
        ]
    );

    const getImage = useCallback((): string => {
        if (scanAssetData?.image.toString() !== 'false' && selectedImage) {
            return selectedImage;
        }
        if (scanAssetData?.image.toString() === 'false' && selectedImage) {
            return selectedImage;
        }
        if (scanAssetData?.image.toString() !== 'false' && !selectedImage) {
            return scanAssetData?.image;
        }
        if (scanAssetData?.image.toString() === 'false' && !selectedImage) {
            return 'false';
        }
    }, [scanAssetData?.image, selectedImage]);

    const handleSaveEditAsset = useCallback(async () => {
        try {
            const updatedScanAssetData = {
                ...scanAssetData,
                use_state: searchUseState,
                image: getImage() !== 'false' ? getImage() : false,
                new_img: getImage() !== 'false'
            };

            setListAssetCreate((prev) => {
                return [updatedScanAssetData as AssetData, ...prev];
            });
            setVisiblePopupScanAsset(false);
            setScanAssetData(null);
        } catch (err) {
            setVisiblePopupScanAsset(false);
            setScanAssetData(null);
            setVisibleDialog(true);
            setContentDialog('Something went wrong save asset');
        }
    }, [getImage, scanAssetData, searchUseState]);

    const handleInitFetch = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
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
            setVisibleDialog(true);
        }
    }, []);

    useEffect(() => {
        handleSearchAsset(route?.params?.codeFromAssetSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route?.params?.codeFromAssetSearch]);

    useEffect(() => {
        handleInitFetch();
    }, [handleInitFetch]);

    return (
        <SafeAreaView style={styles.container}>
            <AlertDialog
                textTitle={titleDialog}
                textContent={contentDialog}
                visible={visibleDialog}
                handleClose={handleCloseDialog}
                handleConfirm={handleConfirmDialog}
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
                            navigation.goBack();
                        }}
                    />
                </View>
                <View style={styles.containerText}>
                    <Text variant="headlineSmall" style={styles.textHeader}>
                        Add Asset
                    </Text>
                    <Text variant="headlineSmall" style={styles.textHeader}>
                        Document No : {documentValue?.id || '-'}
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        Location : {documentValue?.location || '-'}
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <View style={styles.searchContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('DocumentScanAsset', {
                                onGoBack: (code: string) => {
                                    handleSearchAsset(code);
                                }
                            });
                        }}
                        activeOpacity={0.5}
                    >
                        <ActionButton
                            icon="barcode-scan"
                            size="small"
                            backgroundColor={theme.colors.white}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        value={assetCode}
                        onChangeText={(text) => setAssetCode(text)}
                        placeholder="Input Or Scan Asset"
                        placeholderTextColor={theme.colors.textBody}
                        onSubmitEditing={() => {
                            handleSearchAsset(assetCode);
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => handleSearchAsset(assetCode)}
                    >
                        <Button style={styles.dialogActionConfirm}>
                            <Text
                                style={styles.textActionConfirm}
                                variant="bodyLarge"
                            >
                                Search
                            </Text>
                        </Button>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchButtonWrap}>
                    <SearchButton
                        handlePress={() =>
                            navigation.navigate('DocumentAssetSearch')
                        }
                    />
                </View>
                <Text variant="bodyLarge" style={styles.textTotalDocument}>
                    Total Document : {listAssetCreate?.length}
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
                                            asset_id: item?.asset_id,
                                            code: item?.default_code,
                                            name: item?.name,
                                            category: item?.category,
                                            serial_no: item?.serial_no,
                                            location: item?.location,
                                            quantity: item?.quantity,
                                            state: item?.state,
                                            use_state: item?.use_state,
                                            new_img: item?.new_img,
                                            image: item?.image
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
                                    assetId={item?.asset_id}
                                    assetNewLocation={documentValue?.location}
                                    handleRemoveAsset={
                                        handleOpenDialogConfirmRemoveAsset
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.asset_id.toString()}
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
                    handleSaveEditAsset={handleSaveEditAsset}
                    scanAssetData={scanAssetData}
                    locationNew={documentValue?.location}
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
        height: hp('30%'),
        width: wp('100%'),
        position: 'absolute',
        display: 'flex'
    },
    backToPrevious: {
        marginTop: 15,
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
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    },
    statusText: {
        color: theme.colors.pureWhite
    },
    containerText: {
        marginHorizontal: 20
    },
    textHeader: {
        color: theme.colors.pureWhite,
        fontWeight: '700',
        marginBottom: 5
    },
    textDescription: {
        fontFamily: 'Sarabun-Regular',
        color: theme.colors.pureWhite
    },
    listSection: {
        flex: 1,
        height: hp('30%'),
        width: wp('100%'),
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: '50%'
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
        fontWeight: '700',
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
        fontWeight: '600',
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
        width: '50%',
        marginRight: 10,
        marginLeft: 10
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
