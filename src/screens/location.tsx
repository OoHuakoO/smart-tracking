import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import LocationCardDetail from '@src/components/views/locationCardDetail';
import { getDBConnection } from '@src/db/config';
import { getAllLocations, getTotalLocations } from '@src/db/location';
import { GetLocation } from '@src/services/asset';
import { theme } from '@src/theme';
import { LocationData } from '@src/typings/asset';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
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

type LocationScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'Location'
>;

const LocationScreen: FC<LocationScreenProps> = (props) => {
    const { navigation } = props;

    const [countTotalLocation, setCountLocation] = useState<number>(0);
    const [listLocation, setListLocation] = useState<LocationData[]>([]);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleFetchLocation = useCallback(async () => {
        try {
            const online = await AsyncStorage.getItem('Online');
            const onlineValue = JSON.parse(online);
            if (onlineValue) {
                const response = await GetLocation({
                    page: 1,
                    limit: 1000
                });
                const totalPagesLocation = response?.result?.data?.total;
                setCountLocation(totalPagesLocation);
                setListLocation(response?.result?.data?.data);
            } else {
                const db = await getDBConnection();
                const countLocation = await getTotalLocations(db);
                const listLocationDB = await getAllLocations(db);
                setCountLocation(countLocation);
                setListLocation(listLocationDB);
            }
        } catch (err) {
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch location');
        }
    }, []);

    useEffect(() => {
        handleFetchLocation();
    }, [handleFetchLocation]);

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
                        Location
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        สามารถดูสถานที่ทั้งหมดในบริษัทของคุณ
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <Text variant="bodyLarge" style={styles.textTotalLocation}>
                    Total Location : {countTotalLocation}
                </Text>
                <ScrollView>
                    {listLocation?.length > 0 &&
                        listLocation.map((item) => (
                            <View
                                style={styles.wrapDetailList}
                                key={item.asset_location_id}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() =>
                                        navigation.navigate('LocationListAsset')
                                    }
                                    style={styles.searchButton}
                                >
                                    <LocationCardDetail
                                        location={item?.name}
                                        locationId={item?.asset_location_id?.toString()}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}
                </ScrollView>
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
    listSection: {
        flex: 1,
        height: hp('30%'),
        width: wp('100%'),
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: '50%',
        zIndex: 1
    },
    textTotalLocation: {
        marginLeft: 20,
        marginTop: 20,
        fontWeight: '700',
        fontSize: 15
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
        color: '#FFFFFF',
        fontWeight: '700',
        marginBottom: 10
    },
    textDescription: {
        fontFamily: 'Sarabun-Regular',
        color: '#FFFFFF'
    }
});

export default LocationScreen;
