import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import AssetCardDetail from '@src/components/views/assetCardDetail';
import { getAsset, getTotalAssets } from '@src/db/asset';
import { getDBConnection } from '@src/db/config';
import { GetAssetSearch } from '@src/services/asset';
import { GetAssets } from '@src/services/downloadDB';
import { theme } from '@src/theme';
import { SearchAsset } from '@src/typings/asset';
import { AssetData } from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode, removeKeyEmpty } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    BackHandler,
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import {
    SafeAreaView,
    useSafeAreaInsets
} from 'react-native-safe-area-context';

type DocumentCreateSelectSearchProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentCreateSelectSearch'
>;

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768 && height >= 768;

const DocumentCreateSelectSearch: FC<DocumentCreateSelectSearchProps> = (
    props
) => {
    const { navigation, route } = props;
    const { top } = useSafeAreaInsets();
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
            let searchTerm = {
                and: {} as SearchAsset,
                or: {} as SearchAsset
            };
            const assetSearch = removeKeyEmpty(route?.params?.assetSearch);
            let searchQuery: SearchAsset = assetSearch && { ...assetSearch };

            if (searchQuery?.['location_id.name'] !== undefined) {
                searchTerm.and['location_id.name'] =
                    searchQuery['location_id.name'];
            }

            if (searchQuery?.['category_id.name'] !== undefined) {
                searchTerm.and['category_id.name'] =
                    searchQuery['category_id.name'];
            }

            if (searchQuery?.use_state !== undefined) {
                searchTerm.and.use_state = searchQuery.use_state;
            }

            if (searchQuery?.name !== undefined) {
                searchTerm.or.name = searchQuery?.name;
                searchTerm.or.default_code = searchQuery?.name;
            }

            if (isOnline) {
                let responseAsset;
                let totalPagesAsset;
                if (assetSearch) {
                    responseAsset = await GetAssetSearch({
                        page: 1,
                        limit: 10,
                        search_term: searchTerm
                    });
                    totalPagesAsset = responseAsset?.result?.data?.total;
                } else {
                    responseAsset = await GetAssets({
                        page: 1,
                        limit: 10
                    });
                    totalPagesAsset = responseAsset?.result?.data?.total;
                }
                setCountAsset(totalPagesAsset);
                setListAsset(responseAsset?.result?.data?.asset);
            } else {
                const filter = {
                    default_code_for_or: searchQuery?.name,
                    name: searchQuery?.name,
                    use_state: searchQuery?.use_state,
                    'location_id.name': searchQuery?.['location_id.name'],
                    'category_id.name': searchQuery?.['category_id.name']
                };
                const db = await getDBConnection();
                const [countAsset, listAssetDB] = await Promise.all([
                    getTotalAssets(db, filter),
                    getAsset(db, filter)
                ]);
                setCountAsset(countAsset);
                setListAsset(listAssetDB);
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch asset');
        }
    }, [route?.params?.assetSearch]);

    const handleOnEndReached = async () => {
        try {
            setLoading(true);
            if (!stopFetchMore) {
                const isOnline = await getOnlineMode();
                let searchTerm = {
                    and: {} as SearchAsset,
                    or: {} as SearchAsset
                };
                const assetSearch = removeKeyEmpty(route?.params?.assetSearch);
                let searchQuery: SearchAsset = assetSearch && {
                    ...assetSearch
                };

                if (searchQuery?.['location_id.name'] !== undefined) {
                    searchTerm.and['location_id.name'] =
                        searchQuery['location_id.name'];
                }

                if (searchQuery?.['category_id.name'] !== undefined) {
                    searchTerm.and['category_id.name'] =
                        searchQuery['category_id.name'];
                }

                if (searchQuery?.use_state !== undefined) {
                    searchTerm.and.use_state = searchQuery.use_state;
                }

                if (searchQuery?.name !== undefined) {
                    searchTerm.or.name = searchQuery?.name;
                    searchTerm.or.default_code = searchQuery?.name;
                }

                if (isOnline) {
                    const response = await GetAssetSearch({
                        page: page + 1,
                        limit: 10,
                        search_term: searchTerm
                    });

                    setListAsset([
                        ...listAsset,
                        ...response?.result?.data?.asset
                    ]);
                } else {
                    const filter = {
                        default_code_for_or: searchQuery?.name,
                        name: searchQuery?.name,
                        use_state: searchQuery?.use_state,
                        'location_id.name': searchQuery?.['location_id.name'],
                        'category_id.name': searchQuery?.['category_id.name']
                    };
                    const db = await getDBConnection();
                    const listAssetDB = await getAsset(db, filter, page + 1);
                    setListAsset([...listAsset, ...listAssetDB]);
                }
            }
            setPage(page + 1);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setStopFetchMore(true);
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch more asset');
        }
    };

    useEffect(() => {
        handleFetchAsset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route?.params?.assetSearch]);

    useEffect(() => {
        const onBackPress = () => {
            navigation.navigate('DocumentCreate');
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
                    <BackButton
                        handlePress={() =>
                            navigation.navigate('DocumentCreate')
                        }
                    />
                </View>
                <View style={styles.containerText}>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        Select Asset
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        เลือกทรัพย์สินจากการค้นหา
                    </Text>
                </View>
            </LinearGradient>
            <View style={styles.listSection}>
                <Text
                    variant={isTablet ? 'titleLarge' : 'bodyLarge'}
                    style={styles.textTotalAsset}
                >
                    Total Asset : {countTotalAsset}
                </Text>

                <FlatList
                    data={listAsset}
                    renderItem={({ item }) => (
                        <View style={styles.wrapDetailList}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {
                                    navigation.navigate('DocumentCreate', {
                                        codeFromAssetSearch: item?.default_code
                                    });
                                }}
                                style={styles.searchButton}
                            >
                                <AssetCardDetail
                                    assetCode={item?.default_code}
                                    assetName={item?.name}
                                    assetLocation={item?.location}
                                    imageSource={item?.image}
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
        height: '37%',
        width: wp('100%'),
        position: 'absolute',
        display: 'flex'
    },
    backToPrevious: {
        marginVertical: isTablet ? 0 : 15,
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
        color: theme.colors.pureWhite,
        padding: isTablet ? 5 : 0
    },
    listSection: {
        flex: 1,
        height: hp('30%'),
        width: wp('100%'),
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: isTablet ? '30%' : '50%',
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
        fontFamily: 'DMSans-Bold',
        marginBottom: 20
    },
    drawer: {
        width: '80%'
    }
});

export default DocumentCreateSelectSearch;
