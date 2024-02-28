import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import DocumentAssetStatusCard from '@src/components/views/documentAssetStatusCard';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC } from 'react';
import { Text } from 'react-native-paper';

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import ActionButton from '@src/components/core/actionButton';
import LinearGradient from 'react-native-linear-gradient';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

type DocumentAssetStatusScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentAssetStatus'
>;

const DocumentAssetStatusScreen: FC<DocumentAssetStatusScreenProps> = (
    props
) => {
    const { navigation } = props;
    let documentStatus = 'draft';
    let backgroundColor = 'black';

    switch (documentStatus) {
        case 'draft':
            backgroundColor = '#2E67A6';
            break;
        case 'done':
            backgroundColor = '#63CA7F';
            break;
        case 'canceled':
            backgroundColor = '#F0787A';
            break;
    }

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
                        handlePress={() => navigation.navigate('Document')}
                    />
                </View>
                {documentStatus === 'canceled' && (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.resetCancel}
                    >
                        <Text
                            variant="bodySmall"
                            style={{
                                fontWeight: 'bold',
                                color: '#F0787A'
                            }}
                        >
                            Reset to Inprogress
                        </Text>
                    </TouchableOpacity>
                )}
                <View style={styles.containerText}>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        Document
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        Location:
                    </Text>
                    <View style={[styles.statusIndicator, { backgroundColor }]}>
                        <Text variant="labelSmall" style={styles.statusText}>
                            {documentStatus}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <ScrollView>
                    <Text variant="bodyLarge" style={styles.textTotalDocument}>
                        Total Document : 3
                    </Text>
                    <View style={styles.wrapDetailList}>
                        <DocumentAssetStatusCard
                            imageSource={require('../../assets/images/img1.jpg')}
                            assetCode="RB0001"
                            assetName="Table"
                            assetStatus="ปกติ"
                            assetMovement="Normal"
                            assetDate="01/01/2567"
                            documentStatus="draft"
                        />

                        <DocumentAssetStatusCard
                            imageSource={require('../../assets/images/img2.jpg')}
                            assetCode="RB0001"
                            assetName="Table"
                            assetStatus="ปกติ"
                            assetMovement="Normal"
                            assetDate="01/01/2567"
                            documentStatus="draft"
                        />

                        <DocumentAssetStatusCard
                            imageSource={require('../../assets/images/img3.jpg')}
                            assetCode="RB0001"
                            assetName="Table"
                            assetStatus="ปกติ"
                            assetMovement="Normal"
                            assetDate="01/01/2567"
                            documentStatus="draft"
                        />
                        {documentStatus === 'draft' && (
                            <TouchableOpacity style={styles.summitButton}>
                                <Text style={styles.buttonText}>Summit</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </View>
            {documentStatus === 'draft' && (
                <TouchableOpacity activeOpacity={0.5} style={styles.button}>
                    <ActionButton icon="plus" color={theme.colors.white} />
                </TouchableOpacity>
            )}
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
    resetCancel: {
        position: 'absolute',
        right: 15,
        top: 30,
        borderWidth: 2,
        borderColor: '#F0787A',
        backgroundColor: theme.colors.white,
        borderRadius: 25,
        paddingVertical: 5,
        paddingHorizontal: 15
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
        color: '#FFFFFF'
    },
    containerText: {
        marginHorizontal: 20
    },
    textHeader: {
        color: '#FFFFFF',
        fontSize: RFPercentage(5.5),
        fontWeight: '700',
        marginBottom: 5
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
        marginTop: '50%'
    },
    wrapDetailList: {
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        marginTop: 20,
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
        backgroundColor: '#2983BC',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },

    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16
    }
});
export default DocumentAssetStatusScreen;
