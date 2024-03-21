/* eslint-disable react-native/no-inline-styles */
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import InputText from '@src/components/core/inputText';
import PopUpDialog from '@src/components/views/popUpDialog';
import { MOVEMENT_ASSET_EN } from '@src/constant';
import { CreateAsset } from '@src/services/asset';
import { GetCategory, GetUseStatus } from '@src/services/downloadDB';
import { loginState, useRecoilValue } from '@src/store';
import { theme } from '@src/theme';
import { LoginState } from '@src/typings/common';
import {
    AssetData,
    CategoryData,
    UseStatusData
} from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Image,
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

type DocumentCreateAssetProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentCreateAsset'
>;

const DocumentCreateAsset: FC<DocumentCreateAssetProps> = (props) => {
    const { navigation, route } = props;
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
    const loginValue = useRecoilValue<LoginState>(loginState);
    const form = useForm<AssetData>({});
    const toggleDialog = () => {
        setDialogVisible(!dialogVisible);
    };

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const openImagePicker = () => {
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
    };

    const handleCameraLaunch = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
            } else {
                setSelectedImage(response?.assets?.[0]?.base64);
            }
        });
    };

    const renderItemCategory = (item: CategoryData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    {item?.category_name}
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
                const assetData = {
                    default_code: data?.default_code,
                    name: data?.name,
                    category_id: searchCategory?.category_id,
                    quantity: 1,
                    location_id: route?.params?.location_id,
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
                    response?.result?.message === 'Asset created successfully'
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
                              })
                    });
                    navigation.goBack();
                }
            } catch (err) {
                setVisibleDialog(true);
                setContentDialog('Something went wrong save asset');
            }
        },
        [
            loginValue?.uid,
            navigation,
            route?.params,
            searchCategory?.category_id,
            searchUseState,
            selectedImage
        ]
    );

    const handleInitFetch = useCallback(async () => {
        try {
            form?.setValue('default_code', route?.params?.code);
            const [responseUseStatus, responseCategory] = await Promise.all([
                GetUseStatus({ page: 1, limit: 1000 }),
                GetCategory({ page: 1, limit: 1000 })
            ]);
            setListUseState(responseUseStatus?.result?.data.data);
            setListCategory(responseCategory?.result?.data.asset);
        } catch (err) {
            setVisibleDialog(true);
            setContentDialog('Something went wrong init fetch');
        }
    }, [form, route?.params?.code]);

    useEffect(() => {
        handleInitFetch();
    }, [handleInitFetch]);

    return (
        <SafeAreaView style={styles.container}>
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
                        variant="headlineSmall"
                        style={styles.addAssetNewText}
                    >
                        Add Asset New
                    </Text>
                    <Text variant="headlineSmall" style={styles.textHeader}>
                        Document No : {route?.params?.id}
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        Location : {route?.params?.location}
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
                    <Text variant="bodyLarge" style={{ fontWeight: '700' }}>
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
                    <Text variant="bodyLarge" style={{ fontWeight: '700' }}>
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
                    <Text variant="bodyLarge" style={{ fontWeight: '700' }}>
                        Catagory
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

                    <Text variant="bodyLarge" style={{ fontWeight: '700' }}>
                        Status
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
                        placeholder={'Select UseState'}
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
                        style={[styles.button, { backgroundColor: '#2983BC' }]}
                        onPress={form?.handleSubmit(handleSaveAsset)}
                        activeOpacity={0.8}
                    >
                        <Text
                            variant="bodyLarge"
                            style={{
                                color: theme.colors.white,
                                fontWeight: '600'
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
        height: hp('30%'),
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
        color: '#FFFFFF',
        fontWeight: '700',
        marginBottom: 10
    },

    textDescription: {
        fontFamily: 'Sarabun-Regular',
        color: '#FFFFFF'
    },
    listSection: {
        flex: 1,
        height: hp('30%'),
        width: wp('100%'),
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: '50%',
        marginBottom: 2
        // alignItems: 'center'
    },

    containerMenu: {
        width: 105,
        height: 112,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F1F1',
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
        backgroundColor: 'blue',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    addAssetNewText: {
        color: theme.colors.white,
        fontWeight: '700'
    },
    dropdown: {
        height: 50,
        borderColor: theme.colors.borderAutocomplete,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: theme.colors.black,
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
        color: theme.colors.black,
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
        color: theme.colors.black,
        fontFamily: 'DMSans-Regular'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: theme.colors.black,
        fontFamily: 'DMSans-Regular'
    }
});

export default DocumentCreateAsset;
