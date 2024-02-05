import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import LocationListAssetCard from '@src/components/views/locationListAssetCard';
import SearchButton from '@src/components/views/searchButton';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
type LocationListAssetProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'LocationListAsset'
>;

const LocationListAssetScreen: FC<LocationListAssetProps> = (props) => {
    const { navigation } = props;
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
                        handlePress={() => navigation.navigate('Location')}
                    />
                </View>
                <View style={styles.containerText}>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        Location-01
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        รายละเอียดทรัพย์สินภายในสถานที่นี้
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <View style={styles.searchButtonWrap}>
                    <SearchButton
                        handlePress={() => navigation.navigate('AssetSearch')}
                    />
                </View>
                <ScrollView>
                    <Text variant="bodyLarge" style={styles.textTotalAsset}>
                        Total Asset : 3
                    </Text>
                    <View style={styles.wrapDetailList}>
                        <LocationListAssetCard
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
                            imageSource={require('../../assets/images/img1.jpg')}
                        />
                        <LocationListAssetCard
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-02'}
                            imageSource={require('../../assets/images/img2.jpg')}
                        />
                        <LocationListAssetCard
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-03'}
                            imageSource={require('../../assets/images/img3.jpg')}
                        />
                    </View>
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
        zIndex: 1
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
        fontSize: 15
    }
});

export default LocationListAssetScreen;
