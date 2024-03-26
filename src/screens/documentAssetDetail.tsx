import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import PopUpDialog from '@src/components/views/popUpDialog';
import { MOVEMENT_ASSET, MOVEMENT_ASSET_EN } from '@src/constant';
import { getDBConnection } from '@src/db/config';
import { getUseStatus } from '@src/db/useStatus';
import { UpdateDocumentLine } from '@src/services/document';
import { GetUseStatus } from '@src/services/downloadDB';
import { theme } from '@src/theme';
import { UseStatusData } from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    Image,
    PermissionsAndroid,
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
        route?.params?.assetData?.use_state
    );

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

    const handleMapStateThToValue = useCallback((state: string): string => {
        switch (state) {
            case MOVEMENT_ASSET_EN.Normal:
                return MOVEMENT_ASSET.Normal;
            case MOVEMENT_ASSET_EN.Transfer:
                return MOVEMENT_ASSET.Transfer;
            case MOVEMENT_ASSET_EN.New:
                return MOVEMENT_ASSET.New;
            default:
                return MOVEMENT_ASSET.Normal;
        }
    }, []);

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

    const handleSave = useCallback(async () => {
        try {
            const filterUseStatus = listUseState.filter(
                (item) => searchUseState === item?.name
            );
            const response = await UpdateDocumentLine({
                location_id: route?.params?.locationID,
                asset_tracking_id: route?.params?.documentID,
                asset_ids: [
                    {
                        id: route?.params?.assetData?.asset_id,
                        state: handleMapStateThToValue(
                            route?.params?.assetData?.state
                        ),
                        ...(filterUseStatus?.length > 0 && {
                            use_state: filterUseStatus[0]?.id
                        }),
                        ...(getImage() !== 'false' && {
                            image: getImage()
                        }),
                        ...(getImage() !== 'false' && { new_img: true })
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
            if (route?.params?.routeBefore === 'DocumentAssetStatus') {
                navigation.replace('DocumentAssetStatus', {
                    id: route?.params?.documentID,
                    state: route?.params?.state,
                    location: route?.params?.location,
                    location_id: route?.params?.locationID
                });
            }
            route?.params?.onGoBack({
                asset_id: route?.params?.assetData?.asset_id,
                default_code: route?.params?.assetData?.code,
                name: route?.params?.assetData?.name,
                use_state: searchUseState,
                state: route?.params?.assetData?.state,
                image: getImage() !== 'false' ? getImage() : false,
                new_img: getImage() !== 'false'
            });
            navigation.goBack();
        } catch (err) {
            setVisibleDialog(true);
            setContentDialog('Something went wrong save asset');
        }
    }, [
        getImage,
        handleMapStateThToValue,
        listUseState,
        navigation,
        route?.params,
        searchUseState
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
            setVisibleDialog(true);
        }
    }, []);

    useEffect(() => {
        handleInitFetch();
    }, [handleInitFetch]);

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
                    <View style={styles.buttonCamera}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={toggleDialog}
                        >
                            <ActionButton
                                icon={'camera'}
                                size="small"
                                backgroundColor={theme.colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.imagesContainer}>
                    {route?.params?.assetData?.image?.toString() !== 'false' ||
                    selectedImage ? (
                        <Image
                            style={styles.image}
                            source={{
                                uri: `data:image/png;base64,${
                                    selectedImage
                                        ? selectedImage
                                        : route?.params?.assetData?.image
                                }`
                            }}
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            style={styles.image}
                            source={require('../../assets/images/default_image.jpg')}
                            resizeMode="cover"
                        />
                    )}
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

                <View style={styles.assetDetail}>
                    <View style={styles.assetDetailTitle}>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Use State
                        </Text>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Serial Number
                        </Text>
                        {/* <Text variant="titleMedium" style={styles.assetTitle}>
                            Brand Name
                        </Text> */}
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Category
                        </Text>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Location
                        </Text>
                        {/* <Text variant="titleMedium" style={styles.assetTitle}>
                            Owner
                        </Text> */}
                    </View>
                    <View style={styles.assetDetailDes}>
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
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.serial_no || '-'}
                        </Text>
                        {/* <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.brand_name || '-'}
                        </Text> */}

                        <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.category || '-'}
                        </Text>

                        <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.location || '-'}
                        </Text>
                        {/* <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.owner || '-'}
                        </Text> */}
                    </View>
                </View>
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        {
                            backgroundColor: theme.colors.primary
                        }
                    ]}
                    onPress={() => handleSave()}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
            <PopUpDialog
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
        height: hp('30%'),
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
        width: '60%',
        height: '100%',
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
        shadowColor: '#00000',
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
        lineHeight: 40
    },
    assetStatus: {
        display: 'flex',
        alignItems: 'center'
    },
    assetDetail: {
        height: hp('30%'),
        width: wp('80%'),
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'baseline'
    },
    assetTitle: {
        fontSize: 14,
        marginBottom: 15
    },
    assetDetailDes: {
        width: '60%'
    },
    assetDetailTitle: {
        width: '40%'
    },
    assetDes: {
        fontSize: 14,
        marginBottom: 15
    },
    dropdown: {
        height: 35,
        borderColor: theme.colors.borderAutocomplete,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: theme.colors.black,
        marginBottom: 11,
        width: '100%'
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
        color: theme.colors.black,
        fontFamily: 'DMSans-Regular'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: theme.colors.black,
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
        color: theme.colors.black,
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
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16
    }
});

export default DocumentAssetDetail;
