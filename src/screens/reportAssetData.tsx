import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import ReportAssetDataCard from '@src/components/views/reportAssetDataCard';
import { ALL_LOCATION, REPORT_TYPE, STATE_ASSET } from '@src/constant';
import { GetAssetNotFoundSearch } from '@src/services/asset';
import { GetDocumentLineSearch } from '@src/services/document';
import { GetLocation } from '@src/services/downloadDB';
import { theme } from '@src/theme';
import { LocationData } from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { LocationReportData, SearchQueryReport } from '@src/typings/report';
import { getOnlineMode, handleMapReportStateValue } from '@src/utils/common';
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
    const [listLocation, setListLocation] = useState<LocationReportData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    // const handleFilterReport = useCallback((title: string): boolean => {
    //     switch (title) {
    //         case REPORT_TYPE.New:
    //             return asset.state === MOVEMENT_ASSET.New;
    //         case REPORT_TYPE.Transfer:
    //             return asset.state === MOVEMENT_ASSET.Transfer;
    //         case REPORT_TYPE.Found:
    //             return true;
    //         case REPORT_TYPE.NotFound:
    //             return true;
    //         default:
    //             return false;
    //     }
    // }, []);

    // const handleCountAssetInLocation = useCallback(
    //     (
    //         locationName: string,
    //         reportAssets: ReportAssetData[],
    //         title: string
    //     ): number => {
    //         const filterAssets = (asset) => {
    //             const isLocationMatch =
    //                 locationName === ALL_LOCATION ||
    //                 asset?.location === locationName;
    //             return isLocationMatch && handleFilterReport(asset, title);
    //         };
    //         return reportAssets?.filter(filterAssets).length;
    //     },
    //     [handleFilterReport]
    // );

    const createLocationDataList = useCallback(
        async (
            locations: LocationData[],
            title: string
        ): Promise<LocationReportData[]> => {
            const results = await Promise.all(
                locations.map(async (item) => {
                    let response;
                    let searchQuery: SearchQueryReport = {};
                    if (item.location_id !== 0) {
                        searchQuery['location_id.id'] = item.location_id;
                    }
                    if (title === REPORT_TYPE.NotFound) {
                        searchQuery.state = STATE_ASSET;
                        response = await GetAssetNotFoundSearch({
                            page: 1,
                            limit: 10,
                            search_term: {
                                and: searchQuery
                            }
                        });
                    } else {
                        searchQuery.state = handleMapReportStateValue(title);
                        response = await GetDocumentLineSearch({
                            page: 1,
                            limit: 10,
                            search_term: {
                                and: searchQuery
                            }
                        });
                    }
                    return {
                        ...item,
                        total_asset:
                            response?.result?.data?.total ||
                            response?.result?.data?.count_ids ||
                            0
                    };
                })
            );
            return results;
        },
        []
    );

    const handleInitFetch = useCallback(async () => {
        try {
            setLoading(true);

            const isOnline = await getOnlineMode();
            let listLocationData;

            if (isOnline) {
                const locationResponse = await GetLocation({
                    page: 1,
                    limit: 1000
                });

                locationResponse?.result?.data?.asset?.unshift({
                    location_id: 0,
                    location_code: ALL_LOCATION,
                    location_name: ALL_LOCATION
                });

                listLocationData = await createLocationDataList(
                    locationResponse?.result?.data?.asset || [],
                    route?.params?.title
                );
            }

            setListLocation(listLocationData);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch location');
        }
    }, [createLocationDataList, route?.params?.title]);

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
                                    location={item?.location_name}
                                    totalAsset={item?.total_asset}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.location_id.toString()}
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
        color: theme.colors.pureWhite,
        fontWeight: '700',
        marginBottom: 10
    },
    textDescription: {
        fontFamily: 'Sarabun-Regular',
        color: theme.colors.pureWhite
    }
});

export default ReportAssetDataScreen;
