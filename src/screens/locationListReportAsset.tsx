/* eslint-disable @typescript-eslint/no-shadow */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import SearchButton from '@src/components/core/searchButton';
import ReportAssetCard from '@src/components/views/reportAssetCard';
import { ALL_LOCATION, REPORT_TYPE, STATE_ASSET } from '@src/constant';
import { getDBConnection } from '@src/db/config';
import {
    getReportAssetNotFound,
    getTotalReportAssetNotFound
} from '@src/db/reportAssetNotFound';
import {
    getReportDocumentLine,
    getTotalReportDocumentLine
} from '@src/db/reportDocumentLine';
import { GetAssetNotFoundSearch } from '@src/services/asset';
import { GetDocumentLineSearch } from '@src/services/document';
import { theme } from '@src/theme';

import { PrivateStackParamsList } from '@src/typings/navigation';
import { ReportAssetData, SearchQueryReport } from '@src/typings/report';
import {
    getOnlineMode,
    handleMapReportStateValue,
    removeKeyEmpty
} from '@src/utils/common';
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
    const [totalListReportAsset, setTotalListReportAsset] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const createReportAssetListNotFoundOnline = useCallback(
        async (
            locationID: number,
            page: number
        ): Promise<ReportAssetData[]> => {
            let listReportAsset: ReportAssetData[] = [];
            const assetSearch = removeKeyEmpty(route?.params?.assetSearch);
            let searchQuery: SearchQueryReport = { ...assetSearch };
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

            setTotalListReportAsset(response?.result?.data?.count_ids);
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
        [route?.params?.assetSearch]
    );

    const createReportAssetListNotFoundOffline = useCallback(
        async (
            locationName: string,
            page: number
        ): Promise<ReportAssetData[]> => {
            const db = await getDBConnection();
            let listReportAsset: ReportAssetData[] = [];
            const assetSearch = removeKeyEmpty(route?.params?.assetSearch);
            let searchQuery: SearchQueryReport = { ...assetSearch };

            if (locationName !== ALL_LOCATION) {
                searchQuery.location = locationName;
            }

            const listReportAssetNotFound = await getReportAssetNotFound(
                db,
                searchQuery,
                page
            );
            const totalAsset = await getTotalReportAssetNotFound(
                db,
                searchQuery
            );
            setTotalListReportAsset(totalAsset);
            listReportAssetNotFound?.map((report) => {
                listReportAsset.push({
                    code: report?.code,
                    name: report?.name,
                    category: report?.category,
                    location: report?.location,
                    use_state: report?.use_state
                });
            });
            return listReportAsset;
        },
        [route?.params?.assetSearch]
    );

    const createReportAssetListFoundOnline = useCallback(
        async (
            locationID: number,
            title: string,
            page: number
        ): Promise<ReportAssetData[]> => {
            let listReportAsset: ReportAssetData[] = [];
            const assetSearch = removeKeyEmpty(route?.params?.assetSearch);
            let searchQuery: SearchQueryReport = { ...assetSearch };
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

            setTotalListReportAsset(response?.result?.data?.total);
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
        [route?.params?.assetSearch]
    );

    const createReportAssetListFoundOffline = useCallback(
        async (
            locationName: string,
            title: string,
            page: number
        ): Promise<ReportAssetData[]> => {
            const db = await getDBConnection();
            let listReportAsset: ReportAssetData[] = [];
            const assetSearch = removeKeyEmpty(route?.params?.assetSearch);
            let searchQuery: SearchQueryReport = { ...assetSearch };
            if (locationName !== ALL_LOCATION) {
                searchQuery.location = locationName;
            }
            searchQuery.state = handleMapReportStateValue(title);

            const listReportDocumentLine = await getReportDocumentLine(
                db,
                searchQuery,
                page
            );
            const totalDocumentLine = await getTotalReportDocumentLine(
                db,
                searchQuery
            );

            setTotalListReportAsset(totalDocumentLine);
            listReportDocumentLine?.map((document) => {
                listReportAsset.push({
                    code: document?.code,
                    name: document?.name,
                    category: document?.category,
                    location_old: document?.location_old,
                    location: document?.location,
                    use_state: document?.use_state
                });
            });

            return listReportAsset;
        },
        [route?.params?.assetSearch]
    );

    const handleInitFetch = useCallback(async () => {
        try {
            setLoading(true);
            const isOnline = await getOnlineMode();
            const locationID = route?.params?.LocationData?.location_id;
            const locationName = route?.params?.LocationData?.location_name;
            const title = route?.params?.title;
            let listAsset = [];

            if (isOnline) {
                if (route?.params?.title === REPORT_TYPE.NotFound) {
                    listAsset = await createReportAssetListNotFoundOnline(
                        locationID,
                        1
                    );
                } else {
                    listAsset = await createReportAssetListFoundOnline(
                        locationID,
                        title,
                        1
                    );
                }
            } else {
                if (route?.params?.title === REPORT_TYPE.NotFound) {
                    listAsset = await createReportAssetListNotFoundOffline(
                        locationName,
                        1
                    );
                } else {
                    listAsset = await createReportAssetListFoundOffline(
                        locationName,
                        title,
                        1
                    );
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
        createReportAssetListFoundOffline,
        createReportAssetListFoundOnline,
        createReportAssetListNotFoundOffline,
        createReportAssetListNotFoundOnline,
        route?.params?.LocationData?.location_id,
        route?.params?.LocationData?.location_name,
        route?.params?.title
    ]);

    const handleOnEndReached = async () => {
        try {
            setLoading(true);
            if (!stopFetchMore) {
                const isOnline = await getOnlineMode();
                let listAsset = [];
                const locationID = route?.params?.LocationData?.location_id;
                const locationName = route?.params?.LocationData?.location_name;
                const title = route?.params?.title;
                if (isOnline) {
                    if (route?.params?.title === REPORT_TYPE.NotFound) {
                        listAsset = await createReportAssetListNotFoundOnline(
                            locationID,
                            page + 1
                        );
                    } else {
                        listAsset = await createReportAssetListFoundOnline(
                            locationID,
                            title,
                            page + 1
                        );
                    }
                } else {
                    if (route?.params?.title === REPORT_TYPE.NotFound) {
                        listAsset = await createReportAssetListNotFoundOffline(
                            locationName,
                            page + 1
                        );
                    } else {
                        listAsset = await createReportAssetListFoundOffline(
                            locationName,
                            title,
                            page + 1
                        );
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route?.params?.assetSearch]);

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
                <View style={styles.searchButtonWrap}>
                    <SearchButton
                        handlePress={() =>
                            navigation.navigate('ReportSearch', {
                                LocationData: route?.params?.LocationData,
                                title: route?.params?.title
                            })
                        }
                    />
                </View>
                <Text variant="bodyLarge" style={styles.textTotalAsset}>
                    Total Asset: {totalListReportAsset}
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
                                assetCategory={item?.category}
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
