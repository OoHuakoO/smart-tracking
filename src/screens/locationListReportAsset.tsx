import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import ReportAssetCard from '@src/components/views/reportAssetCard';
import {
    ALL_LOCATION,
    MOVEMENT_ASSET,
    REPORT_TYPE,
    USE_STATE_ASSET_TH
} from '@src/constant';
import { getAsset } from '@src/db/asset';
import { getDBConnection } from '@src/db/config';
import { getReport } from '@src/db/report';
import { GetAssetSearch } from '@src/services/asset';
import { GetDocumentSearch } from '@src/services/document';
import { theme } from '@src/theme';
import { DocumentData } from '@src/typings/document';
import { AssetData, ReportAssetData } from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
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
    const [listReportForNotFoundAsset, setListReportForNotFoundAsset] =
        useState<ReportAssetData[]>([]);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [stopFetchMore, setStopFetchMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleFilterReportOnline = useCallback(
        (asset: ReportAssetData, title: string): boolean => {
            switch (title) {
                case REPORT_TYPE.New:
                    return asset.state === MOVEMENT_ASSET.New;
                case REPORT_TYPE.Transfer:
                    return asset.state === MOVEMENT_ASSET.Transfer;
                case REPORT_TYPE.Found:
                    return true;
                case REPORT_TYPE.NotFound:
                    return true;
                default:
                    return false;
            }
        },
        []
    );

    const handleCheckTitleToSetAssetState = useCallback(
        (title: string): undefined | string => {
            let state;
            switch (title) {
                case REPORT_TYPE.New:
                    state = MOVEMENT_ASSET.New;
                    break;
                case REPORT_TYPE.Transfer:
                    state = MOVEMENT_ASSET.Transfer;
                    break;
            }
            return state;
        },
        []
    );

    const fetchReportFromAPI = useCallback(
        async (locationName: string, pageReport: number) => {
            return await GetDocumentSearch({
                page: pageReport,
                limit: 10,
                search_term: {
                    location: locationName === ALL_LOCATION ? '' : locationName
                }
            });
        },
        []
    );

    const fetchAssetsFromAPI = async (
        locationName: string,
        pageAsset: number
    ) => {
        return await GetAssetSearch({
            page: pageAsset,
            limit: 10,
            search_term: {
                location: locationName === ALL_LOCATION ? '' : locationName
            }
        });
    };

    const fetchReportAssetFromDB = useCallback(
        async (
            locationName: string,
            title: string,
            isPagination: boolean,
            pageReport: number
        ) => {
            const db = await getDBConnection();
            let filter = {
                location:
                    locationName === ALL_LOCATION ? undefined : locationName,
                state: handleCheckTitleToSetAssetState(title)
            };
            return await getReport(db, filter, isPagination, pageReport);
        },
        [handleCheckTitleToSetAssetState]
    );

    const fetchAssetsFromDB = async (
        locationName: string,
        pageAsset: number
    ) => {
        const db = await getDBConnection();
        let filter =
            locationName !== ALL_LOCATION ? { location: locationName } : null;
        return await getAsset(db, filter, pageAsset);
    };

    const filterAssetsNotInReport = (
        assets: AssetData[],
        listAssetReport: ReportAssetData[]
    ): AssetData[] => {
        const filterAsset = assets.filter(
            (asset) =>
                !listAssetReport.some(
                    (listAssetItem) => listAssetItem.code === asset.default_code
                )
        );

        return filterAsset;
    };

    const convertAssetToReportAssetData = (
        filteredAssets: AssetData[]
    ): ReportAssetData[] => {
        return filteredAssets.map((item) => ({
            image: item.image,
            code: item.default_code,
            name: item.name,
            use_state: item.use_state,
            location: item.location,
            location_old: item.location,
            category: item.category,
            serial_no: item.serial_no,
            quantity: item.quantity,
            state: USE_STATE_ASSET_TH.Normal,
            new_img: item.new_img
        }));
    };

    const createReportAssetList = useCallback(
        (
            documents: DocumentData[],
            reportAssets: ReportAssetData[],
            title: string,
            online: boolean
        ): ReportAssetData[] => {
            let assets = [];
            if (online) {
                assets = documents
                    .flatMap((document) => document.assets || [])
                    .filter((asset) => {
                        return handleFilterReportOnline(asset, title);
                    });
            } else {
                assets = reportAssets;
            }
            return assets;
        },
        [handleFilterReportOnline]
    );

    const handleLoadReport = useCallback(
        async (totalPages: number): Promise<DocumentData[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetDocumentSearch({ page: i + 1, limit: 1000 })
                );
                const results = await Promise.all(promises);
                const report = results.flatMap(
                    (result) => result?.result?.data?.documents ?? []
                );
                return report;
            } catch (err) {
                setVisibleDialog(true);
                setContentDialog('Something went wrong load report');
                return [];
            }
        },
        []
    );

    const handleInitFetch = useCallback(async () => {
        try {
            setLoading(true);
            const isOnline = await getOnlineMode();
            const locationName = route?.params?.LocationData?.name;
            let listAsset = [];

            if (isOnline) {
                const documentSearchResponse = await fetchReportFromAPI(
                    locationName,
                    1
                );
                if (route?.params?.title !== REPORT_TYPE.NotFound) {
                    listAsset = createReportAssetList(
                        documentSearchResponse?.result?.data?.documents,
                        [],
                        route?.params?.title,
                        isOnline
                    );
                }
                if (route?.params?.title === REPORT_TYPE.NotFound) {
                    let pageCount = 1;
                    let isCountListAssetMoreThanSix = false;
                    if (route?.params?.LocationData?.total_asset > 0) {
                        const listLoadDocument = await handleLoadReport(
                            documentSearchResponse?.result?.data?.total_page
                        );

                        const listAssetReport = createReportAssetList(
                            listLoadDocument,
                            [],
                            route?.params?.title,
                            isOnline
                        );

                        setListReportForNotFoundAsset(listAssetReport);

                        while (!isCountListAssetMoreThanSix) {
                            const assetResponse = await fetchAssetsFromAPI(
                                locationName,
                                pageCount
                            );

                            const filteredAssets = filterAssetsNotInReport(
                                assetResponse?.result?.data?.asset,
                                listAssetReport
                            );

                            if (listAsset.length <= 6) {
                                pageCount++;
                                listAsset = [
                                    ...listAsset,
                                    ...convertAssetToReportAssetData(
                                        filteredAssets
                                    )
                                ];
                            }
                            if (listAsset.length > 6) {
                                listAsset = [
                                    ...listAsset,
                                    ...convertAssetToReportAssetData(
                                        filteredAssets
                                    )
                                ];
                                isCountListAssetMoreThanSix = true;
                                setPage(pageCount);
                            }
                        }
                    }
                }
            } else {
                if (route?.params?.title !== REPORT_TYPE.NotFound) {
                    const listReportDB = await fetchReportAssetFromDB(
                        locationName,
                        route?.params?.title,
                        true,
                        1
                    );

                    listAsset = createReportAssetList(
                        [],
                        listReportDB,
                        route?.params?.title,
                        isOnline
                    );
                }
                if (route?.params?.title === REPORT_TYPE.NotFound) {
                    let pageCount = 1;
                    let isCountListAssetMoreThanSix = false;
                    if (route?.params?.LocationData?.total_asset > 0) {
                        const listReportDB = await fetchReportAssetFromDB(
                            locationName,
                            route?.params?.title,
                            false,
                            1
                        );

                        const listAssetReport = createReportAssetList(
                            [],
                            listReportDB,
                            route?.params?.title,
                            isOnline
                        );

                        setListReportForNotFoundAsset(listAssetReport);

                        while (!isCountListAssetMoreThanSix) {
                            const listAssetDB = await fetchAssetsFromDB(
                                locationName,
                                pageCount
                            );

                            const filteredAssets = filterAssetsNotInReport(
                                listAssetDB,
                                listAssetReport
                            );

                            if (listAsset.length <= 6) {
                                pageCount++;
                                listAsset = [
                                    ...listAsset,
                                    ...convertAssetToReportAssetData(
                                        filteredAssets
                                    )
                                ];
                            }
                            if (listAsset.length > 6) {
                                listAsset = [
                                    ...listAsset,
                                    ...convertAssetToReportAssetData(
                                        filteredAssets
                                    )
                                ];
                                isCountListAssetMoreThanSix = true;
                                setPage(pageCount);
                            }
                        }
                    }
                }
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
        route?.params?.LocationData?.name,
        route?.params?.LocationData?.total_asset,
        route?.params?.title,
        fetchReportFromAPI,
        createReportAssetList,
        handleLoadReport,
        fetchReportAssetFromDB
    ]);

    const handleOnEndReached = async () => {
        try {
            setLoading(true);
            if (!stopFetchMore) {
                const isOnline = await getOnlineMode();
                let listAsset = [];
                const locationName = route?.params?.LocationData?.name;
                const title = route?.params?.title;
                if (isOnline) {
                    if (title !== REPORT_TYPE.NotFound) {
                        const documentSearchResponse = await fetchReportFromAPI(
                            locationName,
                            page + 1
                        );

                        listAsset = createReportAssetList(
                            documentSearchResponse?.result?.data?.documents,
                            [],
                            title,
                            isOnline
                        );
                    }
                    if (title === REPORT_TYPE.NotFound) {
                        const assetResponse = await fetchAssetsFromAPI(
                            locationName,
                            page + 1
                        );

                        const filteredAssets = filterAssetsNotInReport(
                            assetResponse?.result?.data?.asset,
                            listReportForNotFoundAsset
                        );

                        listAsset = [
                            ...listAsset,
                            ...convertAssetToReportAssetData(filteredAssets)
                        ];
                    }
                } else {
                    if (title !== REPORT_TYPE.NotFound) {
                        const listReportDB = await fetchReportAssetFromDB(
                            locationName,
                            title,
                            true,
                            page + 1
                        );

                        listAsset = createReportAssetList(
                            [],
                            listReportDB,
                            title,
                            isOnline
                        );
                    }
                    if (title === REPORT_TYPE.NotFound) {
                        const listAssetDB = await fetchAssetsFromDB(
                            locationName,
                            page + 1
                        );
                        const filteredAssets = filterAssetsNotInReport(
                            listAssetDB,
                            listReportForNotFoundAsset
                        );
                        listAsset = [
                            ...listAsset,
                            ...convertAssetToReportAssetData(filteredAssets)
                        ];
                    }
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
                        {route?.params?.LocationData?.name}
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
                                imageSource={item?.image}
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
