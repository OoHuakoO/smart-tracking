import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { theme } from '@src/theme';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface LocationListAssetProps {
    assetCode: string;
    assetName: string;
    assetLocation: string;
    imageSource?: any;
}

const LocationListAssetCard: FC<LocationListAssetProps> = (props) => {
    const { assetCode, assetName, assetLocation, imageSource } = props;
    return (
        <View style={styles.cardContainer}>
            <View style={styles.imagesContainer}>
                <Image
                    style={styles.image}
                    source={
                        imageSource?.toString() !== 'false'
                            ? {
                                  uri: `data:image/png;base64,${imageSource}`
                              }
                            : require('../../../assets/images/default_image.jpg')
                    }
                    resizeMode="cover"
                />
            </View>
            <View style={styles.textContainer}>
                <View style={styles.rowText}>
                    <Text variant="titleMedium" style={styles.assetCode}>
                        {assetCode}
                    </Text>
                </View>
                <View style={styles.rowText}>
                    <Text style={styles.additionalText}>{assetName}</Text>
                </View>
                <View style={styles.iconContainer}>
                    <FontAwesomeIcon icon={faLocationDot} color="#DC3E3F" />
                    <Text style={styles.locationText}>{assetLocation}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        width: wp('90%'),
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
        marginLeft: 20,
        width: '60%'
    },
    assetCode: {
        fontWeight: 'bold',
        color: '#404040'
    },
    additionalText: {
        fontSize: 14,
        color: theme.colors.additionalText
    },
    iconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    locationText: {
        color: theme.colors.black,
        fontWeight: 'bold',
        alignContent: 'center',
        margin: 5
    },
    rowText: {
        flexDirection: 'row'
    }
});

export default LocationListAssetCard;
