/* eslint-disable react-native/no-inline-styles */
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import InputText from '@src/components/core/inputText';
import PopUpDialog from '@src/components/views/popupCameraDialog';
import { MOVEMENT_ASSET_EN } from '@src/constant';
import { getLastAsset, insertNewAssetData } from '@src/db/asset';
import { getCategory } from '@src/db/category';
import { getDBConnection } from '@src/db/config';
import { getUseStatus } from '@src/db/useStatus';
import { CreateAsset } from '@src/services/asset';
import { GetCategory, GetUseStatus } from '@src/services/downloadDB';
import {
    BranchState,
    documentState,
    loginState,
    useRecoilValue
} from '@src/store';
import { theme } from '@src/theme';
import { DocumentState, LoginState } from '@src/typings/common';
import {
    AssetData,
    CategoryData,
    UseStatusData
} from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    BackHandler,
    Dimensions,
    Image,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    ScrollView,
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
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type DocumentCreateNewAssetProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentCreateNewAsset'
>;

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768 && height >= 768;

const DocumentCreateNewAsset: FC<DocumentCreateNewAssetProps> = (props) => {
    const { navigation, route } = props;
    const { top } = useSafeAreaInsets();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [listUseState, setListUseState] = useState<UseStatusData[]>([]);
    const [searchUseState, setSearchUseState] = useState<string>('');
    const [listCategory, setListCategory] = useState<CategoryData[]>([]);
    const [searchCategory, setSearchCategory] =
        useState<CategoryData>(undefined);
    const [isFocusUseState, setIsFocusUseState] = useState<boolean>(false);
    const [isFocusCategory, setIsFocusCategory] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [online, setOnline] = useState<boolean>(false);
    const loginValue = useRecoilValue<LoginState>(loginState);
    const documentValue = useRecoilValue<DocumentState>(documentState);
    const branchValue = useRecoilValue(BranchState);
    const form = useForm<AssetData>({});
    const toggleDialog = () => {
        setDialogVisible(!dialogVisible);
    };

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const openImagePicker = () => {
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

    const renderItemCategory = (item: CategoryData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    [{item?.category_code}] {item?.category_name}
                </Text>
            </View>
        );
    };

    const renderItemUseState = (item: UseStatusData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    {item?.name}
                </Text>
            </View>
        );
    };

    const handleSaveAsset = useCallback(
        async (data: AssetData) => {
            try {
                const isOnline = await getOnlineMode();
                if (isOnline) {
                    const assetData = {
                        default_code: data?.default_code,
                        name: data?.name,
                        category_id: searchCategory?.category_id,
                        quantity: 1,
                        location_id: documentValue?.location_id,
                        user_id: loginValue?.uid,
                        purchase_price: 0,
                        ...(selectedImage && {
                            image: selectedImage,
                            new_img: true
                        })
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
                        response?.result?.message ===
                        'Asset created successfully'
                    ) {
                        route?.params?.onGoBack({
                            asset_id: response?.result?.data?.id,
                            default_code: data?.default_code,
                            name: data?.name,
                            use_state: searchUseState,
                            state: MOVEMENT_ASSET_EN.New,
                            ...(selectedImage
                                ? {
                                      image: selectedImage,
                                      new_img: true
                                  }
                                : {
                                      image: false,
                                      new_img: false
                                  }),
                            location: documentValue?.location,
                            category: searchCategory?.category_name
                        });
                        navigation.goBack();
                    }
                } else {
                    const db = await getDBConnection();
                    const lastAsset = await getLastAsset(db);
                    const assetID =
                        lastAsset.length > 0 ? lastAsset[0].asset_id + 1 : 1;
                    const assetData = [
                        {
                            asset_id: assetID,
                            default_code: data?.default_code,
                            name: data?.name,
                            description: '',
                            category_id: searchCategory?.category_id,
                            category: searchCategory?.category_name,
                            quantity: 1,
                            serial_no: '',
                            brand_name: '',
                            use_state: searchUseState,
                            location_id: documentValue?.location_id,
                            location: documentValue?.location,
                            purchase_price: 0,
                            image: selectedImage ? selectedImage : 'false',
                            new_img: selectedImage ? true : false,
                            owner: '',
                            is_sync_odoo: false
                        }
                    ];
                    await insertNewAssetData(db, assetData);
                    route?.params?.onGoBack({
                        asset_id: assetID,
                        default_code: data?.default_code,
                        name: data?.name,
                        use_state: searchUseState,
                        state: MOVEMENT_ASSET_EN.New,
                        ...(selectedImage
                            ? {
                                  image: selectedImage,
                                  new_img: true
                              }
                            : {
                                  image: false,
                                  new_img: false
                              }),
                        location: documentValue?.location,
                        category: searchCategory?.category_name
                    });
                    navigation.goBack();
                }
            } catch (err) {
                console.log(err);
                setVisibleDialog(true);
                setContentDialog('Something went wrong save asset');
            }
        },
        [
            documentValue?.location,
            documentValue?.location_id,
            loginValue?.uid,
            navigation,
            route?.params,
            searchCategory?.category_id,
            searchCategory?.category_name,
            searchUseState,
            selectedImage
        ]
    );

    const isDisableSaveButton = useCallback(() => {
        if (
            form.watch('default_code') === '' ||
            form.watch('name') === '' ||
            searchUseState === '' ||
            !searchCategory
        ) {
            return true;
        }
        return false;
    }, [form, searchCategory, searchUseState]);

    const handleInitFetch = useCallback(async () => {
        try {
            form?.setValue('default_code', route?.params?.code);
            const isOnline = await getOnlineMode();
            setOnline(isOnline);
            if (isOnline) {
                const [responseUseStatus, responseCategory] = await Promise.all(
                    [
                        GetUseStatus({ page: 1, limit: 1000 }),
                        GetCategory({ page: 1, limit: 1000 })
                    ]
                );
                setListUseState(responseUseStatus?.result?.data.data);
                setListCategory(responseCategory?.result?.data.asset);
            } else {
                const db = await getDBConnection();
                const [listUseStatusDB, listCategoryDB] = await Promise.all([
                    getUseStatus(db, 1, 1000),
                    getCategory(db, 1, 1000)
                ]);

                setListUseState(listUseStatusDB);
                setListCategory(listCategoryDB);
            }
        } catch (err) {
            console.log(err);
            setVisibleDialog(true);
            setContentDialog('Something went wrong init fetch');
        }
    }, [form, route?.params?.code]);

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
        <SafeAreaView style={[styles.container, { marginTop: top }]}>
            <AlertDialog
                textContent={contentDialog}
                visible={visibleDialog}
                handleClose={handleCloseDialog}
                handleConfirm={handleCloseDialog}
            />
            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#2C86BF', '#2C86BF', '#8DC4E6']}
                style={styles.topSectionList}
            >
                <View style={styles.backToPrevious}>
                    <BackButton handlePress={() => navigation.goBack()} />
                </View>
                <View style={styles.containerText}>
                    <Text
                        variant="headlineMedium"
                        style={styles.addAssetNewText}
                    >
                        Add Asset New
                    </Text>
                    <Text variant="headlineSmall" style={styles.textHeader}>
                        {online
                            ? `${documentValue?.name} - ${documentValue?.id}`
                            : `Document : ${documentValue?.id}`}
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        Location : {documentValue?.location || '-'}
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        Branch : {branchValue?.branchName}
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.listSection}
                contentContainerStyle={{ alignItems: 'center' }}
            >
                <TouchableOpacity
                    style={styles.containerMenu}
                    activeOpacity={0.8}
                    onPress={toggleDialog}
                >
                    {selectedImage ? (
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.selectedImage}
                                source={{
                                    uri: `data:image/png;base64,${selectedImage}`
                                }}
                            />
                            <View style={styles.deSelectButton}>
                                <FontAwesomeIcon
                                    icon={faCamera}
                                    size={15}
                                    color={theme.colors.white}
                                />
                            </View>
                        </View>
                    ) : (
                        <FontAwesomeIcon icon={faCamera} size={34} />
                    )}
                </TouchableOpacity>

                <View style={styles.inputWraper}>
                    <Text
                        variant="bodyLarge"
                        style={{ fontFamily: 'DMSans-Bold' }}
                    >
                        Code
                    </Text>
                    <Controller
                        name="default_code"
                        defaultValue=""
                        control={form?.control}
                        render={({ field }) => (
                            <InputText
                                {...field}
                                borderColor="#828282"
                                onChangeText={(value) => field?.onChange(value)}
                            />
                        )}
                    />
                    <Text
                        variant="bodyLarge"
                        style={{ fontFamily: 'DMSans-Bold' }}
                    >
                        Name
                    </Text>
                    <Controller
                        name="name"
                        defaultValue=""
                        control={form?.control}
                        render={({ field }) => (
                            <InputText
                                {...field}
                                borderColor="#828282"
                                onChangeText={(value) => field?.onChange(value)}
                            />
                        )}
                    />
                    <Text
                        variant="bodyLarge"
                        style={{ fontFamily: 'DMSans-Bold' }}
                    >
                        Category
                    </Text>

                    <Dropdown
                        style={[
                            styles.dropdown,
                            isFocusCategory && styles.dropdownSelect
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={listCategory}
                        labelField="category_name"
                        valueField="category_name"
                        placeholder={'Select Category'}
                        value={searchCategory}
                        onFocus={() => setIsFocusCategory(true)}
                        onBlur={() => setIsFocusCategory(false)}
                        onChange={(item) => {
                            setSearchCategory(item);
                        }}
                        renderItem={renderItemCategory}
                    />

                    <Text
                        variant="bodyLarge"
                        style={{ fontFamily: 'DMSans-Bold' }}
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
                        placeholder={'Select Use Status'}
                        value={searchUseState}
                        onFocus={() => setIsFocusUseState(true)}
                        onBlur={() => setIsFocusUseState(false)}
                        onChange={(item) => {
                            setSearchUseState(item?.name);
                        }}
                        renderItem={renderItemUseState}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: isDisableSaveButton()
                                    ? theme.colors.disableSwitch
                                    : theme.colors.primary
                            }
                        ]}
                        onPress={form?.handleSubmit(handleSaveAsset)}
                        activeOpacity={0.8}
                        disabled={isDisableSaveButton()}
                    >
                        <Text
                            variant="bodyLarge"
                            style={{
                                color: theme.colors.white,
                                fontFamily: 'DMSans-Bold'
                            }}
                        >
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

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
        height: '35%',
        width: wp('100%'),
        position: 'absolute',
        display: 'flex'
    },
    backToPrevious: {
        marginVertical: 15,
        marginHorizontal: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch'
    },
    containerText: {
        marginHorizontal: 20
    },
    textHeader: {
        color: theme.colors.pureWhite,
        fontFamily: 'DMSans-Bold',
        marginBottom: 10
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
        marginTop: isTablet ? '30%' : '50%',
        marginBottom: 2
    },
    containerMenu: {
        width: 105,
        height: 112,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.greySoft,
        marginTop: 25,
        borderRadius: 12
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 17
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
        width: 80,
        height: 100
    },
    deSelectButton: {
        position: 'absolute',
        bottom: -10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 60,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    deselectText: {
        color: theme.colors.white,
        fontSize: 12
    },

    inputWraper: {
        width: wp('100%'),
        paddingHorizontal: 40
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10
    },

    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    addAssetNewText: {
        color: theme.colors.white,
        fontFamily: 'DMSans-Bold'
    },
    dropdown: {
        height: 50,
        borderColor: theme.colors.borderAutocomplete,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: theme.colors.blackGray,
        marginVertical: 8
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
    }
});

export default DocumentCreateNewAsset;
