import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';

interface ReportAssetDataCardProps {
    location: string;
    totalAsset: number;
}
const ReportAssetDataCard: FC<ReportAssetDataCardProps> = (props) => {
    const { location, totalAsset } = props;
    return (
        <View style={styles.cardContainer}>
            <View style={styles.iconContainer}>
                <FontAwesomeIcon
                    icon={faLocationDot}
                    color="#DC3E3F"
                    size={20}
                />
                <Text style={styles.locationText}>{location}</Text>
            </View>
            <Text style={styles.locationId}> Total Asset : {totalAsset}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: widthPercentageToDP('90'),
        height: 80,
        backgroundColor: '#f7f7f7',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 15,
        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginBottom: 15
    },
    locationId: {
        color: '#9999',
        fontSize: 14,
        fontWeight: '500'
    },
    buttonContainer: {
        position: 'absolute',
        right: 20,
        top: 18
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

    locationText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 5
    }
});

export default ReportAssetDataCard;
