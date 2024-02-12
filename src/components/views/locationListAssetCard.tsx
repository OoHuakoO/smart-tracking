import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

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
                    source={{
                        uri: `data:image/png;base64,${imageSource}`
                    }}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.assetCode}>{assetCode}</Text>
                <Text style={styles.additionalText}>{assetName}</Text>
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
        width: 370,
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
    iconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    locationText: {
        color: 'black',
        fontWeight: 'bold',
        alignContent: 'center',
        margin: 5
    }
});

export default LocationListAssetCard;
