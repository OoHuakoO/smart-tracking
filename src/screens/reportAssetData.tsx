import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import ReportAssetDataCard from '@src/components/views/reportAssetDataCard';
import { ALL_LOCATION, MOVEMENT_ASSET, REPORT_TYPE } from '@src/constant';
import { getDBConnection } from '@src/db/config';
import { getLocations } from '@src/db/location';
import { getReport } from '@src/db/report';
import { GetAssetSearch } from '@src/services/asset';
import { GetLocation, GetReport } from '@src/services/downloadDB';
import { theme } from '@src/theme';
import {
    LocationData,
    ReportAssetData,
    ReportData
} from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
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

type ReportAssetDataProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'ReportAssetData'
>;
const ReportAssetDataScreen: FC<ReportAssetDataProps> = (props) => {
    const { navigation, route } = props;
    const [listLocation, setListLocation] = useState<LocationData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');

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

    const handleCountAssetInLocation = useCallback(
        (
            locationName: string,
            reportAssets: ReportAssetData[],
            title: string
        ): number => {
            const filterAssets = (asset) => {
                const isLocationMatch =
                    locationName === ALL_LOCATION ||
                    asset?.location === locationName;
                return isLocationMatch && handleFilterReport(asset, title);
            };
            return reportAssets?.filter(filterAssets).length;
        },
        [handleFilterReport]
    );

    const createLocationDataList = useCallback(
        (
            locations: LocationData[],
            reportAssets: ReportAssetData[],
            title: string
        ): LocationData[] => {
            return locations.map((location) => {
                const countAssetsInLocation = handleCountAssetInLocation(
                    location?.name,
                    reportAssets,
                    title
                );

                return {
                    ...location,
                    total_asset: countAssetsInLocation
                };
            });
        },
        [handleCountAssetInLocation]
    );

    const handleLoadReport = useCallback(
        async (totalPages: number): Promise<ReportAssetData[]> => {
            try {
                const promises = Array.from({ length: totalPages }, (_, i) =>
                    GetReport({ page: i + 1, limit: 1000 })
                );
                const results = await Promise.all(promises);
                const report = results.flatMap(
                    (result) =>
                        result?.result?.data?.asset?.flatMap(
                            (reportData: ReportData) => reportData?.assets
                        ) ?? []
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
            let listLocationData: LocationData[];

            if (isOnline) {
                const [locationResponse, reportResponse] = await Promise.all([
                    GetLocation({ page: 1, limit: 1000 }),
                    GetReport({ page: 1, limit: 1000 })
                ]);

                const listReport = await handleLoadReport(
                    reportResponse?.result?.data?.total_page
                );

                locationResponse?.result?.data?.data?.unshift({
                    asset_location_id: 0,
                    name: ALL_LOCATION
                });

                listLocationData = createLocationDataList(
                    locationResponse?.result?.data?.data || [],
                    listReport,
                    route?.params?.title
                );
            } else {
                const db = await getDBConnection();
                const listReportDB = await getReport(db);
                const listLocations = await getLocations(db, null, 1, 1000);
                listLocations?.unshift({
                    asset_location_id: 0,
                    name: ALL_LOCATION
                });

                listLocationData = createLocationDataList(
                    listLocations,
                    listReportDB,
                    route?.params?.title
                );
            }

            if (route?.params?.title === REPORT_TYPE.NotFound) {
                await Promise.all(
                    listLocationData.map(async (item) => {
                        const response = await GetAssetSearch({
                            page: 1,
                            limit: 10,
                            search_term: {
                                location:
                                    item?.name === ALL_LOCATION
                                        ? ''
                                        : item?.name
                            }
                        });
                        item.total_asset =
                            response?.result?.data?.total - item.total_asset;
                    })
                );
            }

            setListLocation(listLocationData);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch location');
        }
    }, [createLocationDataList, handleLoadReport, route?.params?.title]);

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
                    <BackButton
                        handlePress={() => navigation.navigate('Report')}
                    />
                </View>
                <View style={styles.containerText}>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        {route?.params?.title}
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        จำนวนทรัพย์สินในแต่ละสถานที่
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <FlatList
                    data={listLocation}
                    renderItem={({ item }) => (
                        <View style={styles.wrapDetailList}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() =>
                                    navigation.navigate(
                                        'LocationListReportAsset',
                                        {
                                            LocationData: item,
                                            title: route?.params?.title
                                        }
                                    )
                                }
                            >
                                <ReportAssetDataCard
                                    location={item?.name}
                                    totalAsset={item?.total_asset}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.asset_location_id.toString()}
                    onRefresh={() => console.log('refreshing')}
                    refreshing={loading}
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
        marginTop: 30,
        marginBottom: 5
    },

    searchButton: {
        zIndex: 2
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
    }
});

export default ReportAssetDataScreen;
