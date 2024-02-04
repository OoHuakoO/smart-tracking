import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AssetTagStatus from '@src/components/core/assetTagStatus';
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
                            onPress={() => navigation.navigate('Assets')}
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
                    <View style={styles.detail}>
                        <Text variant="titleMedium">Serial Number</Text>
                        <Text variant="bodyLarge" style={{ marginLeft: 27 }}>
                            text
                        </Text>
                    </View>
                    <View style={styles.detail}>
                        <Text variant="titleMedium">Brand Name</Text>
                        <Text variant="bodyLarge" style={{ marginLeft: 40 }}>
                            text
                        </Text>
                    </View>
                    <View style={styles.detail}>
                        <Text variant="titleMedium">Category</Text>
                        <Text variant="bodyLarge" style={{ marginLeft: '20%' }}>
                            text
                        </Text>
                    </View>
                    <View style={styles.detail}>
                        <Text variant="titleMedium">Location</Text>
                        <Text variant="bodyLarge" style={{ marginLeft: '21%' }}>
                            text
                        </Text>
                    </View>
                    <View style={styles.detail}>
                        <Text variant="titleMedium">Owner</Text>
                        <Text
                            variant="bodyLarge"
                            style={{
                                marginLeft: '26%'
                            }}
                        >
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
        margin: 35
    },
    detail: {
        display: 'flex',
        flexDirection: 'row',
        fontSize: 14,
        padding: 10
    }
});

export default AssetDetail;
