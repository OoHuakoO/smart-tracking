import { MOVEMENT_ASSET_NORMAL_TH } from '@src/constant';
import { theme } from '@src/theme';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface ReportAssetCardProps {
    assetCode: string;
    assetName: string;
    assetStatus: string;
    assetLocation: string;
    assetOldLocation?: string;
}

const ReportAssetCard: FC<ReportAssetCardProps> = (props) => {
    const {
        assetCode,
        assetName,
        assetStatus,
        assetLocation,
        assetOldLocation
    } = props;
    return (
        <View style={styles.cardContainer}>
            <View style={styles.imagesContainer}>
                <Image
                    style={styles.image}
                    source={require('../../../assets/images/default_image.jpg')}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.textContainer}>
                <View style={styles.rowText}>
                    <Text style={styles.assetCode}>{assetCode}</Text>
                </View>
                <View style={styles.rowText}>
                    <Text variant="bodyLarge" style={styles.assetName}>
                        {assetName || '-'}
                    </Text>
                </View>
                <Text variant="bodyMedium">
                    State: {}
                    <Text style={styles.additionalText}>
                        {assetStatus.toString() === 'false'
                            ? MOVEMENT_ASSET_NORMAL_TH
                            : assetStatus || '-'}
                    </Text>
                </Text>

                <Text variant="bodyMedium">
                    Old Location: {}
                    <Text style={styles.additionalText}>
                        {assetOldLocation || '-'}
                    </Text>
                </Text>

                <Text variant="bodyMedium">
                    Location: {}
                    <Text style={styles.additionalText}>
                        {assetLocation || '-'}
                    </Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        width: wp('90%'),
        backgroundColor: theme.colors.cardContainer,
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        shadowColor: theme.colors.black,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
    imagesContainer: {
        width: 80,
        height: 100,
        backgroundColor: 'gray',
        borderRadius: 10
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    textContainer: {
        marginLeft: 20,
        width: '60%'
    },
    assetCode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        width: 0,
        flexGrow: 1,
        flex: 1
    },
    assetName: { width: 0, flexGrow: 1, flex: 1 },
    additionalText: {
        fontSize: 14,
        color: theme.colors.additionalText
    },
    deleteIconContainer: {
        position: 'absolute',
        right: 20,
        top: 15
    },
    rowText: {
        flexDirection: 'row'
    }
});

export default ReportAssetCard;
