import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import ReportAssetDataCard from '@src/components/views/reportAssetDataCard';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
    return (
        <SafeAreaView style={styles.container}>
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
                        {route?.params?.ReportAssetData?.title}
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        จำนวนทรัพย์สินในแต่ละสถานที่
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <View style={styles.wrapDetailList}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() =>
                            navigation.navigate('LocationListReportAsset')
                        }
                    >
                        <ReportAssetDataCard
                            location="All location"
                            totalAsset={20}
                        />
                    </TouchableOpacity>
                    <ReportAssetDataCard
                        location="Location-01"
                        totalAsset={10}
                    />
                    <ReportAssetDataCard
                        location="Location-02"
                        totalAsset={7}
                    />
                    <ReportAssetDataCard
                        location="Location-03"
                        totalAsset={3}
                    />
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.searchButton}
                    />
                </View>
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
