/* eslint-disable react-native/no-inline-styles */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import Button from '@src/components/core/button';
import AddAssetCard from '@src/components/views/addAssetCard';
import SearchButton from '@src/components/views/searchButton';
import {
    MOVEMENT_ASSET,
    MOVEMENT_ASSET_EN,
    USE_STATE_ASSET,
    USE_STATE_ASSET_NORMAL_EN,
    USE_STATE_ASSET_TH
} from '@src/constant';
import { GetAssetByCode } from '@src/services/asset';
import { AddDocumentLine } from '@src/services/document';
import { theme } from '@src/theme';
import { AssetData } from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC, useCallback, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

type DocumentCreateProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentCreate'
>;

const DocumentCreateScreen: FC<DocumentCreateProps> = (props) => {
    const { navigation, route } = props;
    const [assetSearch, setAssetSearch] = useState('');
    const [listAssetCreate, setListAssetCreate] = useState<AssetData[]>([]);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [showCancelDialog, setShowCancelDialog] = useState<boolean>(true);
    const [assetCodeNew, setAssetCodeNew] = useState<string>('');

    const clearStateDialog = useCallback(() => {
        setVisibleDialog(false);
        setTitleDialog('');
        setContentDialog('');
        setShowCancelDialog(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        clearStateDialog();
    }, [clearStateDialog]);

    const handleConfirmDialog = useCallback(async () => {
        switch (titleDialog) {
            case 'Asset not found in Master':
                setVisibleDialog(false);
                navigation.navigate('DocumentCreateAsset', {
                    id: route?.params?.id,
                    state: route?.params?.state,
                    location: route?.params?.location,
                    location_id: route?.params?.location_id,
                    code: assetCodeNew
                });
                break;
            case 'Asset Transfer':
                setVisibleDialog(false);
                break;
            case 'Duplicate Asset':
                setShowCancelDialog(false);
                setVisibleDialog(false);
                break;
            default:
                setVisibleDialog(false);
                break;
        }
    }, [
        assetCodeNew,
        navigation,
        route?.params?.id,
        route?.params?.location,
        route?.params?.location_id,
        route?.params?.state,
        titleDialog
    ]);

    const handleMapUseStateThToValue = useCallback((state: string): number => {
        switch (state) {
            case USE_STATE_ASSET_TH.Normal:
                return USE_STATE_ASSET.Normal;
            case USE_STATE_ASSET_TH.Damaged:
                return USE_STATE_ASSET.Damaged;
            case USE_STATE_ASSET_TH.Repair:
                return USE_STATE_ASSET.Repair;
            default:
                return USE_STATE_ASSET.Normal;
        }
    }, []);

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

    const handleSaveAsset = useCallback(async () => {
        try {
            const assetList = listAssetCreate.map((item) => {
                return {
                    id: item?.asset_id,
                    state: handleMapStateThToValue(item?.state),
                    use_state: handleMapUseStateThToValue(item?.use_state),
                    image: item?.image,
                    new_img: false
                };
            });
            const response = await AddDocumentLine({
                location_id: route?.params?.location_id,
                asset_tracking_id: route?.params?.id,
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
            navigation.replace('DocumentAssetStatus', {
                id: route?.params?.id,
                state: route?.params?.state,
                location: route?.params?.location,
                location_id: route?.params?.location_id
            });
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong save asset');
        }
    }, [
        clearStateDialog,
        handleMapStateThToValue,
        handleMapUseStateThToValue,
        listAssetCreate,
        navigation,
        route?.params?.id,
        route?.params?.location,
        route?.params?.location_id,
        route?.params?.state
    ]);

    const handleSearchAsset = useCallback(async () => {
        try {
            setAssetSearch('');
            if (assetSearch !== '') {
                if (
                    route?.params?.assetDocumentList?.filter(
                        (item) => item?.code === assetSearch
                    ).length > 0 ||
                    listAssetCreate.filter(
                        (item) => item?.default_code === assetSearch
                    ).length > 0
                ) {
                    setVisibleDialog(true);
                    setTitleDialog('Duplicate Asset');
                    setContentDialog(
                        `${assetSearch} is duplicate in Document ${route?.params?.id}`
                    );
                    setShowCancelDialog(false);
                    return;
                }

                const response = await GetAssetByCode(assetSearch);

                if (response?.error) {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong search asset');
                    return;
                }

                if (response?.result?.message === 'Asset not found') {
                    setAssetCodeNew(assetSearch);
                    setVisibleDialog(true);
                    setTitleDialog('Asset not found in Master');
                    setContentDialog('Do you want to add new asset?');
                    return;
                }

                if (
                    response?.result?.data?.asset?.use_state ===
                        USE_STATE_ASSET_NORMAL_EN ||
                    !response?.result?.data?.asset?.use_state
                ) {
                    response.result.data.asset.use_state =
                        USE_STATE_ASSET_TH.Normal;
                }

                if (
                    response?.result?.data?.asset?.location !==
                    route?.params?.location
                ) {
                    setVisibleDialog(true);
                    setTitleDialog('Asset Transfer');
                    setContentDialog(
                        `Asset transfer from ${response?.result?.data?.asset?.location} to ${route?.params?.location}`
                    );
                    setShowCancelDialog(false);
                    response.result.data.asset.state =
                        MOVEMENT_ASSET_EN.Transfer;
                    setListAssetCreate((prev) => {
                        return [response?.result?.data?.asset, ...prev];
                    });

                    return;
                }

                response.result.data.asset.state = MOVEMENT_ASSET_EN.Normal;
                setListAssetCreate((prev) => {
                    return [response?.result?.data?.asset, ...prev];
                });
                clearStateDialog();
            }
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong search asset');
        }
    }, [
        assetSearch,
        clearStateDialog,
        listAssetCreate,
        route?.params?.assetDocumentList,
        route?.params?.id,
        route?.params?.location
    ]);

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
                            navigation.navigate('DocumentAssetStatus', {
                                id: route?.params?.id,
                                state: route?.params?.state,
                                location: route?.params?.location,
                                location_id: route?.params?.location_id
                            });
                        }}
                    />
                </View>

                <View style={styles.containerText}>
                    <Text variant="headlineSmall" style={styles.textHeader}>
                        Add Asset
                    </Text>
                    <Text variant="headlineSmall" style={styles.textHeader}>
                        Document No : {route?.params?.id}
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        Location : {route?.params?.location}
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        value={assetSearch}
                        onChangeText={(text) => setAssetSearch(text)}
                        placeholder="Input Or Scan Asset"
                        placeholderTextColor={theme.colors.textBody}
                        onSubmitEditing={() => {
                            handleSearchAsset();
                        }}
                    />
                    <TouchableOpacity onPress={() => handleSearchAsset()}>
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
                            console.log('search on DocumentCreate')
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
                            <AddAssetCard
                                imageSource={item?.image}
                                assetCode={item?.default_code}
                                assetName={item?.name}
                                assetStatus={item?.use_state}
                                assetMovement={item?.state}
                            />
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
                                    ? '#2983BC'
                                    : theme.colors.disableSwitch
                        }
                    ]}
                    onPress={() => handleSaveAsset()}
                    disabled={listAssetCreate?.length === 0}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
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
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch'
    },
    searchButtonWrap: {
        position: 'absolute',
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
        color: '#FFFFFF'
    },
    containerText: {
        marginHorizontal: 20
    },
    textHeader: {
        color: '#FFFFFF',
        fontWeight: '700',
        marginBottom: 5
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
        color: 'white',
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
        width: '65%',
        marginRight: 10
    }
});
export default DocumentCreateScreen;
