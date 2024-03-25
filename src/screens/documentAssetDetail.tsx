import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import AssetTagStatus from '@src/components/views/assetTagStatus';
import PopUpDialog from '@src/components/views/popUpDialog';
import { USE_STATE_ASSET_NORMAL_EN } from '@src/constant';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC, useCallback, useState } from 'react';
import {
    Image,
    PermissionsAndroid,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
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

    const toggleDialog = () => {
        setDialogVisible(!dialogVisible);
    };

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

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
                    {route?.params?.assetData?.image?.toString() !== 'false' ? (
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
                <View style={styles.assetStatus}>
                    <AssetTagStatus
                        status={
                            route?.params?.assetData?.use_state?.toString() !==
                            'false'
                                ? route?.params?.assetData?.use_state
                                : USE_STATE_ASSET_NORMAL_EN
                        }
                    />
                </View>
                <View style={styles.assetDetail}>
                    <View>
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
        height: hp('100%'),
        width: wp('100%'),
        marginTop: '55%',
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: '#000',
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
        marginVertical: 15
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
        marginTop: 30,
        alignItems: 'baseline'
    },
    assetTitle: {
        fontSize: 14,
        marginBottom: 15
    },
    assetDetailDes: {
        marginLeft: 20
    },
    assetDes: {
        fontSize: 14,
        marginBottom: 15
    }
});

export default DocumentAssetDetail;
