import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { theme } from '@src/theme';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
interface AssetCardDetailProps {
    assetCode: string;
    assetName: string;
    assetLocation: string;
    imageSource?: any;
}

const AssetCardDetail: FC<AssetCardDetailProps> = (props) => {
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
                        {assetCode || '-'}
                    </Text>
                </View>
                <View style={styles.rowText}>
                    <Text style={styles.additionalText}>
                        {assetName || '-'}
                    </Text>
                </View>
                <View style={styles.iconContainer}>
                    <FontAwesomeIcon icon={faLocationDot} color="#DC3E3F" />
                    <Text style={styles.locationText}>
                        {assetLocation || '-'}
                    </Text>
                </View>
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
        backgroundColor: theme.colors.emptyPicture,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
        // fontSize: 18,
        fontWeight: 'bold'
        // color: theme.colors.textPrimary,
        // width: 0,
        // flexGrow: 1,
        // flex: 1
    },
    additionalText: {
        fontSize: 14,
        color: theme.colors.additionalText,
        width: 0,
        flexGrow: 1,
        flex: 1
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

export default AssetCardDetail;
