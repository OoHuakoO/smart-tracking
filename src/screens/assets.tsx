import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import AssetCardDetail from '@src/components/views/assetCardDetail';
import SearchButton from '@src/components/views/searchButton';
import { getAsset, getTotalAssets } from '@src/db/asset';
import { getDBConnection } from '@src/db/config';
import { GetAssets } from '@src/services/asset';
import { theme } from '@src/theme';
import { AssetData } from '@src/typings/asset';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

type AssetsScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'Assets'
>;

const AssetsScreen: FC<AssetsScreenProps> = (props) => {
    const { navigation } = props;

    const [countTotalAsset, setCountAsset] = useState<number>(0);
    const [listAsset, setListAsset] = useState<AssetData[]>([]);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [stopFetchMore, setStopFetchMore] = useState<boolean>(true);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleFetchAsset = useCallback(async () => {
        try {
            setLoading(true);
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const response = await GetAssets({
                    page: 1,
                    limit: 10
                });
                const totalPagesLocation = response?.result?.data?.total;
                setCountAsset(totalPagesLocation);
                setListAsset(response?.result?.data?.asset);
            } else {
                const db = await getDBConnection();
                const countAsset = await getTotalAssets(db);
                const listAssetDB = await getAsset(db);
                setCountAsset(countAsset);
                setListAsset(listAssetDB);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch location');
        }
    }, []);

    const handleOnEndReached = async () => {
        try {
            setLoading(true);
            if (!stopFetchMore) {
                const isOnline = await getOnlineMode();
                if (isOnline) {
                    const response = await GetAssets({
                        page: page + 1,
                        limit: 10
                    });

                    setListAsset([
                        ...listAsset,
                        ...response?.result?.data?.asset
                    ]);
                } else {
                    const db = await getDBConnection();
                    const listAssetDB = await getAsset(db, page + 1);
                    setListAsset([...listAsset, ...listAssetDB]);
                }
            }
            setPage(page + 1);
            setLoading(false);
        } catch (err) {
            setStopFetchMore(true);
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch more location');
        }
    };

    useEffect(() => {
        handleFetchAsset();
    }, [handleFetchAsset]);

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
                    <BackButton
                        handlePress={() => navigation.navigate('Home')}
                    />
                </View>
                <View style={styles.containerText}>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        Asset
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        สามารถดูทรัพย์สินทั้งหมดในระบบ
                    </Text>
                </View>
            </LinearGradient>
            <View style={styles.listSection}>
                <View style={styles.searchButtonWrap}>
                    <SearchButton
                        handlePress={() => navigation.navigate('AssetSearch')}
                    />
                </View>
                <Text variant="bodyLarge" style={styles.textTotalAsset}>
                    Total Asset : {countTotalAsset}
                </Text>

                <FlatList
                    data={listAsset}
                    renderItem={({ item }) => (
                        <View style={styles.wrapDetailList}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() =>
                                    navigation.navigate('AssetDetail')
                                }
                                style={styles.searchButton}
                            >
                                <AssetCardDetail
                                    assetCode={item?.default_code}
                                    assetName={item?.name}
                                    assetLocation={item?.location_id.toString()}
                                    imageSource={require('../../assets/images/img1.jpg')}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.asset_id.toString()}
                    onRefresh={() => console.log('refreshing')}
                    refreshing={loading}
                    onEndReached={handleOnEndReached}
                    onEndReachedThreshold={0.5}
                    onScrollBeginDrag={() => setStopFetchMore(false)}
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
        marginVertical: 25,
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
        zIndex: 1,
        marginBottom: 20
    },
    wrapDetailList: {
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        marginTop: 20,
        marginBottom: 5
    },
    searchButtonWrap: {
        position: 'absolute',
        right: 25,
        top: -20
    },
    searchButton: {
        zIndex: 2
    },
    textTotalAsset: {
        marginLeft: 20,
        marginTop: 20,
        fontWeight: '700',
        fontSize: 15,
        marginBottom: 20
    },
    drawer: {
        width: '80%'
    }
});

export default AssetsScreen;
