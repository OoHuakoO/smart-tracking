import { MOVEMENT_ASSET_EN } from '@src/constant';
import { theme } from '@src/theme';
import { AssetData, UseStatusData } from '@src/typings/downloadDB';
import React, { FC } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Modal, Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionButton from '../core/actionButton';
import PopUpDialog from './popupCameraDialog';

interface PopupScanAssetProp {
    visiblePopupScanAsset: boolean;
    visibleDialogCamera: boolean;
    onClosePopupScanAsset: () => void;
    onCloseDialogCamera: () => void;
    openImagePicker: () => void;
    handleCameraLaunch: () => void;
    toggleDialogCamera: () => void;
    selectedImage: string | null;
    listUseState: UseStatusData[];
    searchUseState: string;
    isFocusUseState: boolean;
    handleSetTrueIsFocusUseState: () => void;
    handleSetFalseIsFocusUseState: () => void;
    handleSetSearchUseState: (name: string) => void;
    handleSaveEditAsset: () => void;
    scanAssetData: AssetData;
    locationNew: string;
}

const PopupScanAsset: FC<PopupScanAssetProp> = (props) => {
    const {
        visiblePopupScanAsset,
        visibleDialogCamera,
        onClosePopupScanAsset,
        onCloseDialogCamera,
        openImagePicker,
        handleCameraLaunch,
        toggleDialogCamera,
        selectedImage,
        listUseState,
        searchUseState,
        isFocusUseState,
        handleSetTrueIsFocusUseState,
        handleSetFalseIsFocusUseState,
        handleSetSearchUseState,
        handleSaveEditAsset,
        scanAssetData,
        locationNew
    } = props;

    const renderItemUseState = (item: UseStatusData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    {item?.name}
                </Text>
            </View>
        );
    };

    return (
        <Modal
            visible={visiblePopupScanAsset}
            onDismiss={onClosePopupScanAsset}
        >
            <SafeAreaView>
                <View style={styles.topSectionList}>
                    <View style={styles.containerButton}>
                        <View style={styles.button}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={onClosePopupScanAsset}
                            >
                                <ActionButton
                                    icon={'close'}
                                    size="small"
                                    backgroundColor={theme.colors.white}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonCamera}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={toggleDialogCamera}
                            >
                                <ActionButton
                                    icon={'camera'}
                                    size="small"
                                    backgroundColor={theme.colors.actionButton}
                                    color={theme.colors.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.imagesContainer}>
                        <Image
                            style={styles.image}
                            source={
                                scanAssetData?.image?.toString() !== 'false' ||
                                selectedImage
                                    ? {
                                          uri: `data:image/png;base64,${
                                              selectedImage
                                                  ? selectedImage
                                                  : scanAssetData?.image
                                          }`
                                      }
                                    : require('../../../assets/images/default_image.jpg')
                            }
                            resizeMode="cover"
                        />
                    </View>
                </View>
                <View style={styles.assetDetailSection}>
                    <View style={styles.assetName}>
                        <Text
                            variant="headlineMedium"
                            style={styles.textAssetName}
                        >
                            {scanAssetData?.name || '-'}
                        </Text>
                        <Text variant="headlineSmall">
                            {scanAssetData?.default_code || '-'}
                        </Text>
                    </View>
                    <View style={styles.assetDetail}>
                        <View style={styles.rowText}>
                            <Text
                                variant="titleMedium"
                                style={styles.assetTitle}
                            >
                                Use State
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
                                onFocus={() => handleSetTrueIsFocusUseState()}
                                onBlur={() => handleSetFalseIsFocusUseState()}
                                onChange={(item) => {
                                    handleSetSearchUseState(item?.name);
                                }}
                                renderItem={renderItemUseState}
                            />
                        </View>

                        <View style={styles.rowText}>
                            <Text
                                variant="titleMedium"
                                style={styles.assetTitle}
                            >
                                Category
                            </Text>
                            <Text variant="bodyLarge" style={styles.assetDes}>
                                {scanAssetData?.category || '-'}
                            </Text>
                        </View>
                        <View style={styles.rowText}>
                            <Text
                                variant="titleMedium"
                                style={[
                                    styles.assetTitle,
                                    scanAssetData?.state ===
                                        MOVEMENT_ASSET_EN.Transfer && {
                                        color: theme.colors.documentCancel
                                    }
                                ]}
                            >
                                Movement
                            </Text>
                            <Text
                                variant="bodyLarge"
                                style={[
                                    styles.assetDes,
                                    scanAssetData?.state ===
                                        MOVEMENT_ASSET_EN.Transfer && {
                                        color: theme.colors.documentCancel
                                    }
                                ]}
                            >
                                {scanAssetData?.state || '-'}
                            </Text>
                        </View>
                        <View style={styles.rowText}>
                            <Text
                                variant="titleMedium"
                                style={styles.assetTitle}
                            >
                                Location
                            </Text>
                            <Text variant="bodyLarge" style={styles.assetDes}>
                                {scanAssetData?.location || '-'}
                            </Text>
                        </View>
                        {scanAssetData?.state ===
                            MOVEMENT_ASSET_EN.Transfer && (
                            <View style={styles.rowText}>
                                <Text
                                    variant="titleMedium"
                                    style={styles.assetNewLocation}
                                >
                                    New Location
                                </Text>
                                <Text
                                    variant="bodyLarge"
                                    style={styles.assetDesNewLocation}
                                >
                                    {locationNew || '-'}
                                </Text>
                            </View>
                        )}
                    </View>
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
                </View>
                <PopUpDialog
                    visible={visibleDialogCamera}
                    onClose={onCloseDialogCamera}
                    openImagePicker={openImagePicker}
                    handleCameraLaunch={handleCameraLaunch}
                />
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    topSectionList: {
        height: hp('30%'),
        width: wp('90%'),
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        alignSelf: 'center',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
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
        width: '80%',
        height: '100%',
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
        height: '100%',
        width: wp('90%'),
        backgroundColor: theme.colors.background,
        shadowColor: theme.colors.black,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
        alignSelf: 'center'
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
        alignItems: 'center'
    },

    assetDetail: {
        width: wp('80%'),
        alignSelf: 'center',
        display: 'flex',
        marginTop: 10
    },

    assetDetailDes: {
        width: '60%'
    },
    assetDetailTitle: {
        width: '40%'
    },
    assetTitle: {
        fontSize: 14,
        marginBottom: 15,
        width: '40%'
    },
    assetNewLocation: {
        fontSize: 14,
        marginBottom: 15,
        width: '40%',
        color: theme.colors.documentCancel
    },
    assetDes: {
        fontSize: 14,
        marginBottom: 15,
        width: '60%'
    },
    assetDesNewLocation: {
        fontSize: 14,
        marginBottom: 15,
        width: '60%',
        color: theme.colors.documentCancel
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
        marginBottom: 20
    },
    buttonText: {
        color: theme.colors.pureWhite,
        fontWeight: '600',
        fontSize: 16
    },
    rowText: {
        flexDirection: 'row',
        width: '100%'
    }
});

export default PopupScanAsset;
