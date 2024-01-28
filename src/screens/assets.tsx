import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AssetCardDetail from '@src/components/core/assetCardDetail';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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

const AssetsScreen: FC<AssetsScreenProps> = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topSectionList}>
                <View style={styles.backToPrevious}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() =>
                            console.log('Pressed back to previous page')
                        }
                    >
                        <ActionButton
                            icon={'chevron-left'}
                            size="small"
                            backgroundColor={'#E0E0E0'}
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
            </View>
            <View style={styles.listSection}>
                <View style={styles.searchButton}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.searchButtonTest}
                        onPress={() => console.log('Pressed search button')}
                    >
                        <ActionButton
                            icon={'magnify'}
                            size="medium"
                            backgroundColor={''}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <Text variant="bodyLarge" style={styles.textTotalAsset}>
                        Total Asset : 999
                    </Text>
                    <View style={styles.wrapDetailList}>
                        <AssetCardDetail
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
                        />
                        <AssetCardDetail
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
                        />
                        <AssetCardDetail
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
                        />
                        <AssetCardDetail
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
                        />
                        <AssetCardDetail
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
                        />
                        <AssetCardDetail
                            assetCode={'RB0001'}
                            assetName={'Table'}
                            assetLocation={'Location-01'}
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
        backgroundColor: theme.colors.primary,
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
        borderRadius: 20,
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
    searchButton: {
        position: 'absolute',
        right: 25,
        top: -25
    },
    searchButtonTest: {
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
