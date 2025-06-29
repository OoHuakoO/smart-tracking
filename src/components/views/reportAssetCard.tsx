import { REPORT_TYPE } from '@src/constant';
import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface ReportAssetCardProps {
    title: string;
    assetCode: string;
    assetName: string;
    assetStatus: string | number;
    assetLocation: string;
    assetOldLocation?: string;
    assetCategory?: string;
}

const ReportAssetCard: FC<ReportAssetCardProps> = (props) => {
    const {
        title,
        assetCode,
        assetName,
        assetStatus,
        assetLocation,
        assetOldLocation,
        assetCategory
    } = props;
    return (
        <View style={styles.cardContainer}>
            <View style={styles.textContainer}>
                <View style={styles.rowText}>
                    <Text variant="titleMedium" style={styles.assetCode}>
                        {assetCode || '-'}
                    </Text>
                </View>
                <View style={styles.rowText}>
                    <Text variant="bodyLarge" style={styles.assetName}>
                        {assetName || '-'}
                    </Text>
                </View>
                <Text variant="bodyMedium">
                    Status: {}
                    <Text style={styles.additionalText}>
                        {assetStatus?.toString() === 'false'
                            ? '-'
                            : assetStatus || '-'}
                    </Text>
                </Text>
                {title !== REPORT_TYPE.NotFound && (
                    <Text variant="bodyMedium">
                        Old Location: {}
                        <Text style={styles.additionalText}>
                            {assetOldLocation || '-'}
                        </Text>
                    </Text>
                )}
                <Text variant="bodyMedium">
                    Location: {}
                    <Text style={styles.additionalText}>
                        {assetLocation || '-'}
                    </Text>
                </Text>
                <Text variant="bodyMedium">
                    Category: {}
                    <Text style={styles.additionalText}>
                        {assetCategory || '-'}
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
        fontFamily: 'DMSans-Bold',
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

    rowText: {
        flexDirection: 'row'
    }
});

export default ReportAssetCard;
