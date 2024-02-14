import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AssetTagStatus from '@src/components/views/assetTagStatus';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

type AssetsDetailScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'AssetDetail'
>;

const AssetDetail: FC<AssetsDetailScreenProps> = (props) => {
    const { navigation } = props;
    return (
        <SafeAreaView>
            <View style={styles.topSectionList}>
                <View style={styles.containerButton}>
                    <View style={styles.button}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => navigation.goBack()}
                        >
                            <ActionButton
                                icon={'chevron-left'}
                                size="small"
                                backgroundColor={theme.colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.imagesContainer}>
                    <Image
                        style={styles.image}
                        source={require('../../assets/images/img1.jpg')}
                    />
                </View>
            </View>
            <View style={styles.assetDetailSection}>
                <View style={styles.assetName}>
                    <Text variant="headlineLarge" style={styles.textAssetName}>
                        เครื่องคิดเลข EL-782C
                    </Text>
                    <Text variant="headlineSmall">CFFASDER500012</Text>
                </View>
                <View style={styles.assetStatus}>
                    <AssetTagStatus status={'ปกติ'} />
                </View>
                <View style={styles.assetDetail}>
                    <View>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Serial Number
                        </Text>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Brand Name
                        </Text>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Category
                        </Text>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Location
                        </Text>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Owner
                        </Text>
                    </View>
                    <View style={styles.assetDetailDes}>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            text
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            text
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            text
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            text
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            text
                        </Text>
                    </View>
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
        height: hp('40%'),
        width: wp('100%'),
        position: 'absolute',
        display: 'flex',
        backgroundColor: theme.colors.background
    },
    containerButton: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'stretch',
        zIndex: 2
    },
    button: {
        marginVertical: 25,
        marginHorizontal: 15
    },
    imagesContainer: {
        width: '90%',
        height: '100%',
        backgroundColor: 'gray',
        borderRadius: 10,
        position: 'absolute',
        marginLeft: 20,
        marginTop: 15,
        zIndex: 1
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    assetDetailSection: {
        height: hp('70%'),
        width: wp('100%'),
        marginTop: '70%',
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11
    },
    assetName: {
        marginHorizontal: 20,
        marginVertical: 15
    },
    textAssetName: {
        fontFamily: 'Sarabun-Regular',
        lineHeight: 60
    },
    assetStatus: {
        display: 'flex',
        alignItems: 'center'
    },
    assetDetail: {
        height: hp('30%'),
        width: wp('80%'),
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 35,
        alignItems: 'baseline'
    },
    assetTitle: {
        fontSize: 18,
        marginBottom: 15
    },
    assetDetailDes: {
        marginLeft: 20
    },
    assetDes: {
        fontSize: 18,
        marginBottom: 15
    }
});

export default AssetDetail;
