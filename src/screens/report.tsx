import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import ReportAssetStatusButton from '@src/components/views/reportAssetStatusButton';
import { REPORT_TYPE } from '@src/constant';

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
type ReportScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'Report'
>;

const ReportScreen: FC<ReportScreenProps> = (props) => {
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
                        handlePress={() => navigation.navigate('Home')}
                    />
                </View>
                <View style={styles.containerText}>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        Report
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        สามารถดูจำนวนและรายการทรัพย์สินของแต่ละสถานะ Asset
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <ScrollView>
                    <View style={styles.wrapDetailList}>
                        <ReportAssetStatusButton
                            buttonText={REPORT_TYPE.New}
                            handlePress={() =>
                                navigation.navigate('ReportAssetData', {
                                    title: `${REPORT_TYPE.New}`
                                })
                            }
                        />
                        <ReportAssetStatusButton
                            buttonText={REPORT_TYPE.Found}
                            handlePress={() =>
                                navigation.navigate('ReportAssetData', {
                                    title: `${REPORT_TYPE.Found}`
                                })
                            }
                        />
                        <ReportAssetStatusButton
                            buttonText={REPORT_TYPE.NotFound}
                            handlePress={() =>
                                navigation.navigate('ReportAssetData', {
                                    title: `${REPORT_TYPE.NotFound}`
                                })
                            }
                        />
                        <ReportAssetStatusButton
                            buttonText={REPORT_TYPE.Transfer}
                            handlePress={() =>
                                navigation.navigate('ReportAssetData', {
                                    title: `${REPORT_TYPE.Transfer}`
                                })
                            }
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
        marginVertical: 15,
        marginHorizontal: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch'
    },
    statusIndicator: {
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 25,
        marginTop: 5,
        flexDirection: 'row'
    },
    statusText: {
        color: theme.colors.pureWhite
    },
    containerText: {
        marginHorizontal: 20,
        width: wp('60%')
    },
    textHeader: {
        color: theme.colors.pureWhite,
        fontWeight: '700',
        marginBottom: 5
    },
    textDescription: {
        fontFamily: 'Sarabun-Regular',
        color: theme.colors.pureWhite
    },
    listSection: {
        flex: 1,
        height: hp('30%'),
        width: wp('100%'),
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: '50%'
    },
    wrapDetailList: {
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        marginTop: 50,
        marginBottom: 5
    },

    textTotalDocument: {
        marginLeft: 20,
        marginTop: 20,
        fontWeight: '700',
        fontSize: 15
    },
    button: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    },

    summitButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },

    buttonText: {
        color: theme.colors.white,
        fontWeight: '600',
        fontSize: 16
    }
});

export default ReportScreen;
