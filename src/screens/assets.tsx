import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AssetCardDetail from '@src/components/core/assetCardDetail';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

type AssetsScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'Assets'
>;

const AssetsScreen: FC<AssetsScreenProps> = (props) => {
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
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <ActionButton
                            icon={'chevron-left'}
                            size="small"
                            backgroundColor={theme.colors.white}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.containerText}>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        Asset
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        สามารถดูทรัพย์สินทั้งหมดในระบบ
                    </Text>
                </View>
            </LinearGradient>
            <View style={styles.listSection}>
                <View style={styles.searchButtonWrap}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.searchButton}
                        onPress={() => console.log('Asset search')}
                    >
                        <ActionButton
                            icon={'magnify'}
                            size="medium"
                            backgroundColor={theme.colors.white}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <Text variant="bodyLarge" style={styles.textTotalAsset}>
                        Total Asset : 999
                    </Text>
                    <View style={styles.wrapDetailList}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('AssetDetail')}
                            style={styles.searchButton}
                        >
                            <AssetCardDetail
                                assetCode={'RB0001'}
                                assetName={'Table'}
                                assetLocation={'Location-01'}
                                imageSource={require('../../assets/images/img1.jpg')}
                            />
                        </TouchableOpacity>

                        <AssetCardDetail
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
                            imageSource={require('../../assets/images/img2.jpg')}
                        />
                        <AssetCardDetail
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
                            imageSource={require('../../assets/images/img3.jpg')}
                        />
                        <AssetCardDetail
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
                            imageSource={require('../../assets/images/img1.jpg')}
                        />
                        <AssetCardDetail
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
                            imageSource={require('../../assets/images/img2.jpg')}
                        />
                        <AssetCardDetail
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
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
        fontWeight: '700'
    },
    textDescription: {
        fontFamily: 'Sarabun',
        fontWeight: '500',
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
    wrapDetailList: {
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        marginTop: 20,
        marginBottom: 5
    },
    searchButtonWrap: {
        position: 'absolute',
        right: 25,
        top: -25
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

export default AssetsScreen;
