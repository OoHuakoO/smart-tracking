import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import LocationCardDetail from '@src/components/views/locationCardDetail';
import { getTotalAssets } from '@src/db/asset';
import { getDBConnection } from '@src/db/config';
import { getLocations, getTotalLocations } from '@src/db/location';
import { GetLocation } from '@src/services/downloadDB';
import { BranchState } from '@src/store';
import { theme } from '@src/theme';
import { LocationData } from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    BackHandler,
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { isTablet } from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecoilValue } from 'recoil';

type LocationScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'Location'
>;

const { width } = Dimensions.get('window');
const isSmallMb = width < 400;

const LocationScreen: FC<LocationScreenProps> = (props) => {
    const { navigation } = props;
    const { top } = useSafeAreaInsets();
    const [countTotalLocation, setCountLocation] = useState<number>(0);
    const [listLocation, setListLocation] = useState<LocationData[]>([]);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [stopFetchMore, setStopFetchMore] = useState<boolean>(true);
    const branchValue = useRecoilValue(BranchState);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleFetchLocation = useCallback(async () => {
        try {
            setLoading(true);
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const response = await GetLocation({
                    page: 1,
                    limit: 10
                });
                const totalPagesLocation = response?.result?.data?.total;
                setCountLocation(totalPagesLocation);
                setListLocation(response?.result?.data?.assets);
            } else {
                const newListLocation: LocationData[] = [];
                const db = await getDBConnection();
                const countLocation = await getTotalLocations(db);
                const listLocationDB = await getLocations(db);
                for (const item of listLocationDB) {
                    const filters = {
                        location_id: item?.location_id
                    };
                    const countAsset = await getTotalAssets(db, filters);
                    newListLocation.push({ ...item, total_assets: countAsset });
                }
                setCountLocation(countLocation);
                setListLocation(newListLocation);
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
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
                    const response = await GetLocation({
                        page: page + 1,
                        limit: 10
                    });

                    setListLocation([
                        ...listLocation,
                        ...response?.result?.data?.assets
                    ]);
                } else {
                    const newListLocation: LocationData[] = [];
                    const db = await getDBConnection();
                    const listLocationDB = await getLocations(
                        db,
                        null,
                        page + 1
                    );
                    for (const item of listLocationDB) {
                        const filters = {
                            location_id: item?.location_id
                        };
                        const countAsset = await getTotalAssets(db, filters);
                        newListLocation.push({
                            ...item,
                            total_assets: countAsset
                        });
                    }
                    setListLocation([...listLocation, ...newListLocation]);
                }
            }
            setPage(page + 1);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setStopFetchMore(true);
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch more location');
        }
    };

    useEffect(() => {
        handleFetchLocation();
    }, [handleFetchLocation]);

    useEffect(() => {
        const onBackPress = () => {
            navigation.goBack();
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
                    <BackButton handlePress={() => navigation.goBack()} />
                </View>
                <View style={styles.containerText}>
                    <Text
                        variant={isSmallMb ? 'headlineSmall' : 'headlineLarge'}
                        style={styles.textHeader}
                    >
                        Location
                    </Text>
                    <Text
                        variant={
                            isTablet()
                                ? 'titleLarge'
                                : isSmallMb
                                ? 'bodyMedium'
                                : 'bodyLarge'
                        }
                        style={styles.textDescription}
                    >
                        สามารถดูสถานที่ทั้งหมดในบริษัทของคุณ
                    </Text>
                    <Text
                        variant={
                            isTablet()
                                ? 'titleLarge'
                                : isSmallMb
                                ? 'bodyMedium'
                                : 'bodyLarge'
                        }
                        style={styles.textDescription}
                    >
                        Branch : {branchValue?.branchName}
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <Text variant="bodyLarge" style={styles.textTotalLocation}>
                    Total Location : {countTotalLocation}
                </Text>

                <FlatList
                    data={listLocation}
                    renderItem={({ item }) => (
                        <View style={styles.wrapDetailList}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() =>
                                    navigation.navigate('LocationListAsset', {
                                        LocationData: item,
                                        assetSearch: null
                                    })
                                }
                                style={styles.searchButton}
                            >
                                <LocationCardDetail
                                    location={item?.location_name}
                                    totalAsset={item?.total_assets}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.location_id?.toString()}
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
        marginVertical: isTablet() ? 0 : 15,
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
        marginTop: isTablet() ? '30%' : '50%',
        zIndex: 1,
        marginBottom: 20
    },
    textTotalLocation: {
        marginLeft: 20,
        marginTop: 20,
        fontFamily: 'DMSans-Bold',
        fontSize: 15,
        marginBottom: 20
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
        padding: isTablet() ? 5 : 0
    }
});

export default LocationScreen;
