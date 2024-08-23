import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import AssetTagStatus from '@src/components/views/assetTagStatus';
import PopupDialog from '@src/components/views/popupCameraDialog';
import {
    MOVEMENT_ASSET_EN,
    STATE_DOCUMENT_NAME,
    USE_STATE_ASSET_TH
} from '@src/constant';
import { getDBConnection } from '@src/db/config';
import { updateDocumentLineData } from '@src/db/documentLineOffline';
import { updateReportDocumentLine } from '@src/db/reportDocumentLine';
import { getUseStatus } from '@src/db/useStatus';
import { UpdateDocumentLine } from '@src/services/document';
import { GetUseStatus } from '@src/services/downloadDB';
import { documentState, useRecoilValue } from '@src/store';
import { theme } from '@src/theme';
import { DocumentState } from '@src/typings/common';
import { UseStatusData } from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode, handleMapMovementStateValue } from '@src/utils/common';
import { parseDateStringTime } from '@src/utils/time-manager';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    BackHandler,
    Image,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {
    MediaType,
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

type DocumentAssetDetailProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentAssetDetail'
>;

const DocumentAssetDetail: FC<DocumentAssetDetailProps> = (props) => {
    const { navigation, route } = props;
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [isFocusUseState, setIsFocusUseState] = useState<boolean>(false);
    const [listUseState, setListUseState] = useState<UseStatusData[]>([]);
    const [searchUseState, setSearchUseState] = useState<string>(
        route?.params?.assetData?.use_state as string
    );
    const documentValue = useRecoilValue<DocumentState>(documentState);

    const toggleDialog = () => {
        setDialogVisible(!dialogVisible);
    };

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const renderItemUseState = (item: UseStatusData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    {item?.name}
                </Text>
            </View>
        );
    };

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
            console.log(err);
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
            console.log(err);
            setVisibleDialog(true);
            setContentDialog('Something went wrong camera launch');
        }
    };

    const getImage = useCallback((): string => {
        if (
            route?.params?.assetData?.image.toString() !== 'false' &&
            selectedImage
        ) {
            return selectedImage;
        }
        if (
            route?.params?.assetData?.image.toString() === 'false' &&
            selectedImage
        ) {
            return selectedImage;
        }
        if (
            route?.params?.assetData?.image.toString() !== 'false' &&
            !selectedImage
        ) {
            return route?.params?.assetData?.image;
        }
        if (
            route?.params?.assetData?.image.toString() === 'false' &&
            !selectedImage
        ) {
            return 'false';
        }
    }, [route?.params?.assetData?.image, selectedImage]);

    const handleSaveEditAsset = useCallback(async () => {
        try {
            if (route?.params?.routeBefore === 'DocumentAssetStatus') {
                const filterUseStatus = listUseState.filter(
                    (item) => searchUseState === item?.name
                );
                const isOnline = await getOnlineMode();
                if (isOnline) {
                    const response = await UpdateDocumentLine({
                        location_id: documentValue?.location_id,
                        asset_tracking_id: documentValue?.id,
                        asset_ids: [
                            {
                                id: route?.params?.assetData?.asset_id,
                                state: handleMapMovementStateValue(
                                    route?.params?.assetData?.state
                                ),
                                ...(filterUseStatus?.length > 0 && {
                                    use_state: filterUseStatus[0]?.id
                                }),
                                ...(getImage() !== 'false' && {
                                    image: getImage()
                                }),
                                new_img: selectedImage ? true : false,
                                date_check: parseDateStringTime(
                                    new Date(Date.now()).toISOString()
                                )
                            }
                        ]
                    });
                    if (response?.error) {
                        setVisibleDialog(true);
                        setContentDialog('Something went wrong save asset');
                        return;
                    }
                    if (response?.result?.error) {
                        setVisibleDialog(true);
                        setContentDialog('Something went wrong save asset');
                        return;
                    }
                } else {
                    const db = await getDBConnection();
                    const documentLine = {
                        code: route?.params?.assetData?.code,
                        state: handleMapMovementStateValue(
                            route?.params?.assetData?.state
                        ),
                        use_state: searchUseState,
                        ...(filterUseStatus?.length > 0 && {
                            use_state_code: filterUseStatus[0]?.use_status_id
                        }),
                        ...(getImage() !== 'false' && {
                            image: getImage()
                        }),
                        new_img: selectedImage ? true : false,
                        asset_id: route?.params?.assetData?.asset_id,
                        tracking_id: documentValue?.id
                    };

                    await updateDocumentLineData(db, documentLine);
                    await updateReportDocumentLine(db, documentLine);
                }
                navigation.replace('DocumentAssetStatus');
                return;
            }
            if (route?.params?.routeBefore === 'DocumentCreate') {
                route?.params?.onGoBack({
                    asset_id: route?.params?.assetData?.asset_id,
                    default_code: route?.params?.assetData?.code,
                    name: route?.params?.assetData?.name,
                    use_state: searchUseState,
                    state: route?.params?.assetData?.state,
                    image: getImage() !== 'false' ? getImage() : false,
                    new_img: selectedImage ? true : false,
                    location: documentValue?.location
                });
                navigation.goBack();
            }
        } catch (err) {
            console.log(err);
            setVisibleDialog(true);
            setContentDialog('Something went wrong save asset');
        }
    }, [
        documentValue?.id,
        documentValue?.location,
        documentValue?.location_id,
        getImage,
        listUseState,
        navigation,
        route?.params,
        searchUseState,
        selectedImage
    ]);

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
            console.log(err);
            setVisibleDialog(true);
        }
    }, []);

    useEffect(() => {
        handleInitFetch();
    }, [handleInitFetch]);

    useEffect(() => {
        const onBackPress = () => {
            navigation.goBack();
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
        <SafeAreaView>
            <AlertDialog
                textContent={contentDialog}
                visible={visibleDialog}
                handleClose={handleCloseDialog}
                handleConfirm={handleCloseDialog}
            />
            <View style={styles.topSectionList}>
                <View style={styles.containerButton}>
                    <View style={styles.button}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => navigation.goBack()}
                        >
                            <ActionButton
                                icon={'chevron-left'}
                                size="small"
                                backgroundColor={theme.colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                    {documentValue?.state === STATE_DOCUMENT_NAME?.Draft && (
                        <View style={styles.buttonCamera}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={toggleDialog}
                            >
                                <ActionButton
                                    icon={'camera'}
                                    size="small"
                                    backgroundColor={theme.colors.actionButton}
                                    color={theme.colors.white}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.imagesContainer}>
                    <Image
                        style={styles.image}
                        source={
                            route?.params?.assetData?.image?.toString() !==
                                'false' || selectedImage
                                ? {
                                      uri: `data:image/png;base64,${
                                          selectedImage
                                              ? selectedImage
                                              : route?.params?.assetData?.image
                                      }`
                                  }
                                : require('../../assets/images/default_image.jpg')
                        }
                        resizeMode="cover"
                    />
                </View>
            </View>
            <View style={styles.assetDetailSection}>
                <View style={styles.assetName}>
                    <Text variant="headlineMedium" style={styles.textAssetName}>
                        {route?.params?.assetData?.name || '-'}
                    </Text>
                    <Text variant="headlineSmall">
                        {route?.params?.assetData?.code || '-'}
                    </Text>
                </View>
                {documentValue?.state !== STATE_DOCUMENT_NAME?.Draft && (
                    <View style={styles.assetStatus}>
                        <AssetTagStatus
                            status={
                                route?.params?.assetData?.use_state?.toString() !==
                                'false'
                                    ? route?.params?.assetData?.use_state
                                    : USE_STATE_ASSET_TH.Normal
                            }
                        />
                    </View>
                )}

                <View style={styles.assetDetail}>
                    {documentValue?.state === STATE_DOCUMENT_NAME?.Draft && (
                        <View style={styles.rowText}>
                            <Text
                                variant="titleMedium"
                                style={styles.assetTitle}
                            >
                                Use Status
                            </Text>
                            <Dropdown
                                style={[
                                    styles.dropdown,
                                    isFocusUseState && styles.dropdownSelect
                                ]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                data={listUseState}
                                maxHeight={300}
                                labelField="name"
                                valueField="name"
                                value={searchUseState}
                                onFocus={() => setIsFocusUseState(true)}
                                onBlur={() => setIsFocusUseState(false)}
                                onChange={(item) => {
                                    setSearchUseState(item?.name);
                                }}
                                renderItem={renderItemUseState}
                            />
                        </View>
                    )}

                    <View style={styles.rowText}>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Category
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.category || '-'}
                        </Text>
                    </View>
                    <View style={styles.rowText}>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Movement
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.state || '-'}
                        </Text>
                    </View>
                    <View style={styles.rowText}>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Location
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.location_old ||
                                route?.params?.assetData?.location ||
                                '-'}
                        </Text>
                    </View>
                    {route?.params?.assetData?.state ===
                        MOVEMENT_ASSET_EN.Transfer && (
                        <View style={styles.rowText}>
                            <Text
                                variant="titleMedium"
                                style={styles.assetTitle}
                            >
                                New Location
                            </Text>
                            <Text variant="bodyLarge" style={styles.assetDes}>
                                {documentValue?.location || '-'}
                            </Text>
                        </View>
                    )}
                </View>
                {documentValue?.state === STATE_DOCUMENT_NAME?.Draft && (
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            {
                                backgroundColor: theme.colors.primary
                            }
                        ]}
                        onPress={() => handleSaveEditAsset()}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                )}
            </View>
            <PopupDialog
                visible={dialogVisible}
                onClose={toggleDialog}
                openImagePicker={openImagePicker}
                handleCameraLaunch={handleCameraLaunch}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topSectionList: {
        height: '35%',
        width: wp('100%'),
        position: 'absolute',
        display: 'flex',
        backgroundColor: theme.colors.background,
        alignItems: 'center'
    },
    containerButton: {
        display: 'flex',
        flexDirection: 'row',
        zIndex: 2,
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 25
    },
    button: {
        marginHorizontal: 15
    },
    buttonCamera: {
        marginHorizontal: 15
    },
    imagesContainer: {
        width: hp('30%'),
        height: wp('50%'),
        backgroundColor: theme.colors.emptyPicture,
        borderRadius: 10,
        position: 'absolute',
        marginLeft: 20,
        marginTop: 15,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    assetDetailSection: {
        height: hp('80%'),
        width: wp('100%'),
        marginTop: '55%',
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: theme.colors.black,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11
    },
    assetName: {
        marginHorizontal: 20,
        marginVertical: 15,
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: theme.colors.divider
    },
    textAssetName: {
        fontFamily: 'Sarabun-Regular',
        lineHeight: 50
    },
    assetStatus: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 20
    },
    assetDetail: {
        width: wp('80%'),
        alignSelf: 'center',
        display: 'flex',
        marginTop: 30
    },
    assetTitle: {
        fontSize: 14,
        marginBottom: 15,
        width: '40%'
    },
    assetDes: {
        fontSize: 14,
        marginBottom: 15,
        width: '60%'
    },
    dropdown: {
        height: 35,
        borderColor: theme.colors.borderAutocomplete,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: theme.colors.blackGray,
        marginBottom: 11,
        width: '60%'
    },
    dropdownSelect: {
        borderColor: theme.colors.buttonConfirm
    },
    placeholderStyle: {
        fontFamily: 'DMSans-Regular',
        fontSize: 16,
        color: theme.colors.textBody
    },
    selectedTextStyle: {
        fontSize: 16,
        color: theme.colors.blackGray,
        fontFamily: 'DMSans-Regular'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: theme.colors.blackGray,
        fontFamily: 'DMSans-Regular'
    },
    dropdownItem: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dropdownItemText: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.blackGray,
        fontFamily: 'DMSans-Regular'
    },
    useStateDetail: {
        width: wp('80%'),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center'
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
    rowText: {
        flexDirection: 'row',
        width: '100%'
    }
});

export default DocumentAssetDetail;
