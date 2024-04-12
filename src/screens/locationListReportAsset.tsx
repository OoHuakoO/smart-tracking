/* eslint-disable @typescript-eslint/no-shadow */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import ReportAssetCard from '@src/components/views/reportAssetCard';
import { REPORT_TYPE, STATE_ASSET } from '@src/constant';
import { GetAssetNotFoundSearch } from '@src/services/asset';
import { GetDocumentLineSearch } from '@src/services/document';
import { theme } from '@src/theme';

import { PrivateStackParamsList } from '@src/typings/navigation';
import { ReportAssetData, SearchQueryReport } from '@src/typings/report';
import { getOnlineMode, handleMapReportStateValue } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

type LocationListReportAssetProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'LocationListReportAsset'
>;

const LocationListReportAssetScreen: FC<LocationListReportAssetProps> = (
    props
) => {
    const { navigation, route } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [listReportAsset, setListReportAsset] = useState<ReportAssetData[]>(
        []
    );
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [stopFetchMore, setStopFetchMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    // const handleFilterReportOnline = useCallback(
    //     (asset: ReportAssetData, title: string): boolean => {
    //         switch (title) {
    //             case REPORT_TYPE.New:
    //                 return asset.state === MOVEMENT_ASSET.New;
    //             case REPORT_TYPE.Transfer:
    //                 return asset.state === MOVEMENT_ASSET.Transfer;
    //             case REPORT_TYPE.Found:
    //                 return true;
    //             case REPORT_TYPE.NotFound:
    //                 return true;
    //             default:
    //                 return false;
    //         }
    //     },
    //     []
    // );

    // const handleCheckTitleToSetAssetState = useCallback(
    //     (title: string): undefined | string => {
    //         let state;
    //         switch (title) {
    //             case REPORT_TYPE.New:
    //                 state = MOVEMENT_ASSET.New;
    //                 break;
    //             case REPORT_TYPE.Transfer:
    //                 state = MOVEMENT_ASSET.Transfer;
    //                 break;
    //         }
    //         return state;
    //     },
    //     []
    // );

    // const fetchReportFromAPI = useCallback(
    //     async (locationName: string, pageReport: number) => {
    //         return await GetDocumentSearch({
    //             page: pageReport,
    //             limit: 10,
    //             search_term: {
    //                 location: locationName === ALL_LOCATION ? '' : locationName
    //             }
    //         });
    //     },
    //     []
    // );

    // const fetchAssetsFromAPI = async (
    //     locationName: string,
    //     pageAsset: number
    // ) => {
    //     return await GetAssetSearch({
    //         page: pageAsset,
    //         limit: 10,
    //         search_term: {
    //             location: locationName === ALL_LOCATION ? '' : locationName
    //         }
    //     });
    // };

    // const fetchReportAssetFromDB = useCallback(
    //     async (
    //         locationName: string,
    //         title: string,
    //         isPagination: boolean,
    //         pageReport: number
    //     ) => {
    //         const db = await getDBConnection();
    //         let filter = {
    //             location:
    //                 locationName === ALL_LOCATION ? undefined : locationName,
    //             state: handleCheckTitleToSetAssetState(title)
    //         };
    //         return await getReport(db, filter, isPagination, pageReport);
    //     },
    //     [handleCheckTitleToSetAssetState]
    // );

    // const fetchAssetsFromDB = async (
    //     locationName: string,
    //     pageAsset: number
    // ) => {
    //     const db = await getDBConnection();
    //     let filter =
    //         locationName !== ALL_LOCATION ? { location: locationName } : null;
    //     return await getAsset(db, filter, pageAsset);
    // };

    // const filterAssetsNotInReport = (
    //     assets: AssetData[],
    //     listAssetReport: ReportAssetData[]
    // ): AssetData[] => {
    //     const filterAsset = assets.filter(
    //         (asset) =>
    //             !listAssetReport.some(
    //                 (listAssetItem) => listAssetItem.code === asset.default_code
    //             )
    //     );

    //     return filterAsset;
    // };

    // const convertAssetToReportAssetData = (
    //     filteredAssets: AssetData[]
    // ): ReportAssetData[] => {
    //     return filteredAssets.map((item) => ({
    //         image: item.image,
    //         code: item.default_code,
    //         name: item.name,
    //         use_state: item.use_state,
    //         location: item.location,
    //         location_old: item.location,
    //         category: item.category,
    //         serial_no: item.serial_no,
    //         quantity: item.quantity,
    //         state: USE_STATE_ASSET_TH.Normal,
    //         new_img: item.new_img
    //     }));
    // };

    const createReportAssetListNotFound = useCallback(
        async (
            locationID: number,
            page: number
        ): Promise<ReportAssetData[]> => {
            let listReportAsset: ReportAssetData[] = [];
            let searchQuery: SearchQueryReport = {};
            if (locationID !== 0) {
                searchQuery['location_id.id'] = locationID;
            }
            searchQuery.state = STATE_ASSET;
            const response = await GetAssetNotFoundSearch({
                page: page,
                limit: 10,
                search_term: {
                    and: searchQuery
                }
            });
            response?.result?.data?.asset?.map((document) => {
                listReportAsset.push({
                    code: document?.default_code,
                    name: document?.name,
                    category: document?.category,
                    location: document?.location,
                    use_state: document?.use_state
                });
            });
            return listReportAsset;
        },
        []
    );

    const createReportAssetListFound = useCallback(
        async (
            locationID: number,
            title: string,
            page: number
        ): Promise<ReportAssetData[]> => {
            let listReportAsset: ReportAssetData[] = [];
            let searchQuery: SearchQueryReport = {};
            if (locationID !== 0) {
                searchQuery['location_id.id'] = locationID;
            }
            searchQuery.state = handleMapReportStateValue(title);
            const response = await GetDocumentLineSearch({
                page: page,
                limit: 10,
                search_term: {
                    and: searchQuery
                }
            });

            response?.result?.data?.document_item_line?.map((document) => {
                document?.assets.map((asset) => {
                    listReportAsset.push({
                        code: asset?.code,
                        name: asset?.name,
                        category: asset?.category,
                        location_old: asset?.location_old,
                        location: asset?.location,
                        use_state: asset?.use_state
                    });
                });
            });

            return listReportAsset;
        },
        []
    );

    const handleInitFetch = useCallback(async () => {
        try {
            setLoading(true);
            const isOnline = await getOnlineMode();
            const locationID = route?.params?.LocationData?.location_id;
            const title = route?.params?.title;
            let listAsset = [];

            if (isOnline) {
                if (route?.params?.title === REPORT_TYPE.NotFound) {
                    listAsset = await createReportAssetListNotFound(
                        locationID,
                        1
                    );
                } else {
                    listAsset = await createReportAssetListFound(
                        locationID,
                        title,
                        1
                    );
                }
            } else {
            }

            setListReportAsset(listAsset);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching asset data:', err);
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch asset');
        }
    }, [
        createReportAssetListFound,
        createReportAssetListNotFound,
        route?.params?.LocationData?.location_id,
        route?.params?.title
    ]);

    const handleOnEndReached = async () => {
        try {
            setLoading(true);
            if (!stopFetchMore) {
                const isOnline = await getOnlineMode();
                let listAsset = [];
                const locationID = route?.params?.LocationData?.location_id;
                const title = route?.params?.title;
                if (isOnline) {
                    if (route?.params?.title === REPORT_TYPE.NotFound) {
                        listAsset = await createReportAssetListNotFound(
                            locationID,
                            page + 1
                        );
                    } else {
                        listAsset = await createReportAssetListFound(
                            locationID,
                            title,
                            page + 1
                        );
                    }
                } else {
                }
                setListReportAsset([...listReportAsset, ...listAsset]);
            }
            setPage(page + 1);
            setLoading(false);
        } catch (err) {
            setStopFetchMore(true);
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch more asset');
        }
    };

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
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        {route?.params?.LocationData?.location_name}
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        รายละเอียดทรัพย์สินภายในสถานที่นี้
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                {/* <View style={styles.searchButtonWrap}>
                    <SearchButton
                        handlePress={() => navigation.navigate('AssetSearch')}
                    />
                </View> */}
                <Text variant="bodyLarge" style={styles.textTotalAsset}>
                    Total Asset: {route?.params?.LocationData?.total_asset}
                </Text>

                <FlatList
                    data={listReportAsset}
                    renderItem={({ item }) => (
                        <View style={styles.wrapDetailList}>
                            <ReportAssetCard
                                title={route?.params?.title}
                                assetCode={item?.code}
                                assetName={item?.name}
                                assetStatus={item?.use_state}
                                assetLocation={item?.location}
                                assetOldLocation={item?.location_old}
                            />
                        </View>
                    )}
                    onRefresh={() => console.log('refreshing')}
                    refreshing={loading}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleOnEndReached}
                    onEndReachedThreshold={0.1}
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
        zIndex: 1,
        marginBottom: 20
    },
    searchButtonWrap: {
        position: 'absolute',
        right: 25,
        top: -20
    },

    wrapDetailList: {
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        marginTop: 20,
        marginBottom: 5
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
    }
});

export default LocationListReportAssetScreen;
