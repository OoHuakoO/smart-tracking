import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { FC } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { widthPercentageToDP } from 'react-native-responsive-screen';

interface AddAssetCardProps {
    imageSource?: any;
    assetId: number;
    assetCode: string;
    assetName: string;
    assetStatus: string;
    assetMovement: string;
    handleRemoveAsset: (id: number) => void;
}

const AddAssetCard: FC<AddAssetCardProps> = (props) => {
    const {
        imageSource,
        assetId,
        assetCode,
        assetName,
        assetStatus,
        assetMovement,
        handleRemoveAsset
    } = props;

    return (
        <View style={styles.cardContainer}>
            <View style={styles.deleteIconContainer}>
                <TouchableOpacity
                    onPress={() => handleRemoveAsset(assetId)}
                    activeOpacity={0.5}
                >
                    <FontAwesomeIcon icon={faTrash} color="#F0787A" />
                </TouchableOpacity>
            </View>
            <View style={styles.imagesContainer}>
                {imageSource?.toString() !== 'false' ? (
                    <Image
                        style={styles.image}
                        source={{
                            uri: `data:image/png;base64,${imageSource}`
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <Image
                        style={styles.image}
                        source={require('../../../assets/images/default_image.jpg')}
                        resizeMode="cover"
                    />
                )}
            </View>
            <View style={styles.textContainer}>
                <View style={styles.rowText}>
                    <Text style={styles.assetCode}>{assetCode}</Text>
                </View>
                <View style={styles.rowText}>
                    <Text variant="bodyLarge">{assetName}</Text>
                </View>
                <Text variant="bodyMedium">
                    Status {}
                    <Text style={styles.additionalText}>{assetStatus}</Text>
                </Text>
                <Text variant="bodyMedium">
                    Movement {}
                    <Text style={styles.additionalText}>{assetMovement}</Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        width: widthPercentageToDP('90%'),

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
    },
    rowText: {
        flexDirection: 'row'
    }
});

export default AddAssetCard;
