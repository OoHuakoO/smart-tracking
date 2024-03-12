import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import ReportAssetCard from '@src/components/views/reportAssetCard';
import { ALL_LOCATION, MOVEMENT_ASSET, REPORT_TYPE } from '@src/constant';
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
    const [
        listReportForOnlineNotFoundAsset,
        setListReportForOnlineNotFoundAsset
    ] = useState<ReportAssetData[]>([]);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [stopFetchMore, setStopFetchMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleFilterReport = useCallback(
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

    const fetchDocumentSearch = async (locationName) => {
        return await GetDocumentSearch({
            page: 1,
            limit: 10,
            search_term: {
                location: locationName === ALL_LOCATION ? '' : locationName
            }
        });
    };

    const fetchReportAssetFromDB = async (locationName) => {
        const db = await getDBConnection();
        let filter =
            locationName !== ALL_LOCATION ? { location: locationName } : null;
        return await getReport(db, filter);
    };

    const fetchAssetsFromDB = async (locationName) => {
        const db = await getDBConnection();
        let filter =
            locationName !== ALL_LOCATION ? { location: locationName } : null;
        return await getAsset(db, filter);
    };

    const fetchAssetsFromAPI = async (locationName, pageCount) => {
        return await GetAssetSearch({
            page: pageCount,
            limit: 10,
            search_term: {
                location: locationName === ALL_LOCATION ? '' : locationName
            }
        });
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
        console.log('filterAsset', filterAsset);
        return filterAsset;
    };

    const convertToReportAssetData = (
        filteredAssets: AssetData[]
    ): ReportAssetData[] => {
        return filteredAssets.map((item) => ({
            image: item.image,
            code: item.default_code,
            name: item.name,
            use_state: item.use_state,
            location: item.location,
            category: item.category_id,
            serial_no: item.serial_no,
            location_old: item.location,
            quantity: item.quantity,
            state: 'Normal',
            new_img: item.new_img
        }));
    };

    const createAssetList = useCallback(
        (
            documents: DocumentData[],
            reportAssets: ReportAssetData[],
            title: string,
            online: boolean
        ): ReportAssetData[] => {
            const assets = online
                ? documents.flatMap((document) => document.assets || [])
                : reportAssets;

            return assets.filter((asset) => {
                return handleFilterReport(asset, title);
            });
        },
        [handleFilterReport]
    );

    const handleLoadDocument = useCallback(
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
                setContentDialog('Something went wrong load document');
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

            if (route?.params?.title !== REPORT_TYPE.NotFound) {
                if (isOnline) {
                    const documentSearchResponse = await fetchDocumentSearch(
                        locationName
                    );
                    listAsset = createAssetList(
                        documentSearchResponse?.result?.data?.documents,
                        [],
                        route?.params?.title,
                        isOnline
                    );
                } else {
                    const listReportDB = await fetchReportAssetFromDB(
                        locationName
                    );
                    listAsset = createAssetList(
                        [],
                        listReportDB,
                        route?.params?.title,
                        isOnline
                    );
                }
            }
            if (route?.params?.title === REPORT_TYPE.NotFound) {
                if (isOnline) {
                    let pageCount = 1;
                    let endLoop = false;
                    if (route?.params?.LocationData?.total_asset > 0) {
                        while (!endLoop) {
                            const [documentSearchResponse, assetResponse] =
                                await Promise.all([
                                    fetchDocumentSearch(locationName),
                                    fetchAssetsFromAPI(locationName, pageCount)
                                ]);

                            const listLoadDocument = await handleLoadDocument(
                                documentSearchResponse?.result?.data?.total_page
                            );

                            const listAssetReport = createAssetList(
                                listLoadDocument,
                                [],
                                route?.params?.title,
                                isOnline
                            );

                            setListReportForOnlineNotFoundAsset(
                                listAssetReport
                            );

                            const filteredAssets = filterAssetsNotInReport(
                                assetResponse?.result?.data?.asset,
                                listAssetReport
                            );

                            if (filteredAssets.length <= 6) {
                                pageCount++;
                                listAsset = [
                                    ...listAsset,
                                    convertToReportAssetData(filteredAssets)
                                ];
                            }
                            if (filteredAssets.length > 6) {
                                listAsset = [
                                    ...listAsset,
                                    convertToReportAssetData(filteredAssets)
                                ];
                                endLoop = true;
                                setPage(pageCount);
                            }
                        }
                    }
                } else {
                    const [listReportDB, listAssetDB] = await Promise.all([
                        fetchReportAssetFromDB(locationName),
                        fetchAssetsFromDB(locationName)
                    ]);

                    const listAssetReport = createAssetList(
                        [],
                        listReportDB,
                        route?.params?.title,
                        isOnline
                    );

                    setListReportForOnlineNotFoundAsset(listAssetReport);

                    const filteredAssets = filterAssetsNotInReport(
                        listAssetDB,
                        listAssetReport
                    );

                    listAsset = convertToReportAssetData(filteredAssets);
                }
            }
            console.log(page);
            setListReportAsset(listAsset);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching asset data:', err);
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch asset');
        }
    }, [
        createAssetList,
        handleLoadDocument,
        page,
        route?.params?.LocationData?.name,
        route?.params?.LocationData?.total_asset,
        route?.params?.title
    ]);

    const handleOnEndReached = async () => {
        try {
            setLoading(true);
            if (!stopFetchMore) {
                const isOnline = await getOnlineMode();
                if (route?.params?.title !== REPORT_TYPE.NotFound) {
                    if (isOnline) {
                        const documentSearchResponse = await GetDocumentSearch({
                            page: page + 1,
                            limit: 10,
                            search_term: {
                                location:
                                    route?.params?.LocationData?.name ===
                                    'All Location'
                                        ? ''
                                        : route?.params?.LocationData?.name
                            }
                        });
                        const listAsset = createAssetList(
                            documentSearchResponse?.result?.data?.documents,
                            [],
                            route?.params?.title,
                            isOnline
                        );
                        setListReportAsset([...listReportAsset, ...listAsset]);
                    }
                }
                if (route?.params?.title === REPORT_TYPE.NotFound) {
                    const assetResponse = await GetAssetSearch({
                        page: page + 1,
                        limit: 10,
                        search_term: {
                            location:
                                route?.params?.LocationData?.name ===
                                'All Location'
                                    ? ''
                                    : route?.params?.LocationData?.name
                        }
                    });

                    const filteredAssets = filterAssetsNotInReport(
                        assetResponse?.result?.data?.asset,
                        listReportForOnlineNotFoundAsset
                    );

                    setListReportAsset([
                        ...listReportAsset,
                        ...convertToReportAssetData(filteredAssets)
                    ]);
                }
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
