import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { widthPercentageToDP } from 'react-native-responsive-screen';

interface ReportAssetCardProps {
    imageSource?: any;
    assetCode: string;
    assetName: string;
    assetStatus: string;
    assetLocation: string;
}

const ReportAssetCard: FC<ReportAssetCardProps> = (props) => {
    const { imageSource, assetCode, assetName, assetStatus, assetLocation } =
        props;
    return (
        <View style={styles.cardContainer}>
            <View style={styles.imagesContainer}>
                <Image style={styles.image} source={imageSource} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.assetCode}>{assetCode}</Text>
                <Text variant="bodyLarge">{assetName}</Text>
                <Text variant="bodyMedium">
                    Status: {}
                    <Text style={styles.additionalText}>{assetStatus}</Text>
                </Text>
                <Text variant="bodyMedium">
                    Location: {}
                    <Text style={styles.additionalText}>{assetLocation}</Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        width: widthPercentageToDP('90%'),
        height: 130,
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
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
        marginLeft: 20
    },
    assetCode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#404040'
    },
    additionalText: {
        fontSize: 14,
        color: '#777'
    },
    deleteIconContainer: {
        position: 'absolute',
        right: 20,
        top: 15
    }
});

export default ReportAssetCard;
