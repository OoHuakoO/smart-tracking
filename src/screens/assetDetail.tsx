import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AssetTagStatus from '@src/components/views/assetTagStatus';
import { USE_STATE_ASSET_TH } from '@src/constant';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC, useEffect } from 'react';
import {
    BackHandler,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import {
    SafeAreaView,
    useSafeAreaInsets
} from 'react-native-safe-area-context';

type AssetsDetailScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'AssetDetail'
>;

const AssetDetail: FC<AssetsDetailScreenProps> = (props) => {
    const { navigation, route } = props;
    const { top } = useSafeAreaInsets();

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
        <SafeAreaView style={{ marginTop: top }}>
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
                        source={
                            route?.params?.assetData?.image?.toString() !==
                            'false'
                                ? {
                                      uri: `data:image/png;base64,${route?.params?.assetData?.image}`
                                  }
                                : require('../../assets/images/default_image.jpg')
                        }
                        resizeMode="cover"
                    />
                </View>
            </View>
            <View style={styles.assetDetailSection}>
                <View style={styles.assetName}>
                    <Text variant="headlineMedium" style={styles.textAssetName}>
                        {route?.params?.assetData?.name || '-'}
                    </Text>
                    <Text variant="headlineSmall">
                        {route?.params?.assetData?.default_code || '-'}
                    </Text>
                </View>
                <View style={styles.assetStatus}>
                    <AssetTagStatus
                        status={
                            route?.params?.assetData?.use_state?.toString() !==
                            'false'
                                ? route?.params?.assetData?.use_state
                                : USE_STATE_ASSET_TH.Normal
                        }
                    />
                </View>
                <View style={styles.assetDetail}>
                    <View style={styles.rowText}>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            SerialNumber
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.serial_no || '-'}
                        </Text>
                    </View>
                    <View style={styles.rowText}>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            BrandName
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.brand_name || '-'}
                        </Text>
                    </View>
                    <View style={styles.rowText}>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Category
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.category || '-'}
                        </Text>
                    </View>
                    <View style={styles.rowText}>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Location
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.location || '-'}
                        </Text>
                    </View>

                    <View style={styles.rowText}>
                        <Text variant="titleMedium" style={styles.assetTitle}>
                            Owner
                        </Text>
                        <Text variant="bodyLarge" style={styles.assetDes}>
                            {route?.params?.assetData?.owner || '-'}
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
        height: '35%',
        width: wp('100%'),
        position: 'absolute',
        display: 'flex',
        backgroundColor: theme.colors.background,
        alignItems: 'center'
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
        width: hp('30%'),
        height: wp('50%'),
        backgroundColor: theme.colors.emptyPicture,
        borderRadius: 10,
        position: 'absolute',
        marginLeft: 20,
        marginTop: 15,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    assetDetailSection: {
        height: hp('100%'),
        width: wp('100%'),
        marginTop: '55%',
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: '#00000',
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
        lineHeight: 50
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
        marginTop: 30
    },
    assetTitle: {
        fontSize: 14,
        marginBottom: 15,
        width: '40%'
    },
    assetDes: {
        fontSize: 14,
        marginBottom: 15,
        width: '60%'
    },
    rowText: {
        flexDirection: 'row',
        width: '100%'
    }
});

export default AssetDetail;
