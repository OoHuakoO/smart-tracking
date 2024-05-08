import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { STATE_DOCUMENT_NAME } from '@src/constant';
import { theme } from '@src/theme';
import React, { FC } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface DocumentAssetStatusProps {
    imageSource?: any;
    assetId: number;
    assetCode: string;
    assetName: string;
    assetStatus: string | number;
    assetMovement: string;
    assetDate: string;
    documentStatus: string;
    handleRemoveAsset: (id: number, code: string) => void;
}

const DocumentAssetStatusCard: FC<DocumentAssetStatusProps> = (props) => {
    const {
        imageSource,
        assetCode,
        assetName,
        assetStatus,
        assetMovement,
        assetDate,
        documentStatus,
        handleRemoveAsset,
        assetId
    } = props;

    return (
        <View style={styles.cardContainer}>
            {documentStatus === STATE_DOCUMENT_NAME.Draft && (
                <TouchableOpacity
                    onPress={() => handleRemoveAsset(assetId, assetCode)}
                    activeOpacity={0.5}
                    style={styles.deleteIconContainer}
                >
                    <FontAwesomeIcon
                        icon={faTrash}
                        color={theme.colors.documentCancel}
                    />
                </TouchableOpacity>
            )}

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
                <Text variant="bodyMedium">
                    Date {}
                    <Text style={styles.additionalText}>{assetDate}</Text>
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
        width: '55%'
    },
    assetCode: {
        fontWeight: 'bold',
        color: theme.colors.textPrimary
    },
    additionalText: {
        fontSize: 14,
        color: theme.colors.additionalText
    },
    deleteIconContainer: {
        position: 'absolute',
        right: 10,
        top: 10,
        padding: 10,
        backgroundColor: theme.colors.white,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: theme.colors.documentCancel
    },
    rowText: {
        flexDirection: 'row'
    }
});

export default DocumentAssetStatusCard;
