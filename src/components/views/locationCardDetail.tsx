import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface LocationDetailProps {
    location: string;
    locationId: string;
}
const LocationCardDetail: FC<LocationDetailProps> = (props) => {
    const { location, locationId } = props;
    return (
        <View style={styles.cardContainer}>
            <View style={styles.iconContainer}>
                <FontAwesomeIcon
                    icon={faLocationDot}
                    color="#DC3E3F"
                    size={20}
                />
                <Text variant="titleMedium" style={styles.locationText}>
                    {location}
                </Text>
            </View>
            <Text style={styles.locationId}> LocationID : {locationId}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: wp('90%'),
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
    locationId: {
        color: '#9999',
        fontSize: 14,
        fontWeight: '500'
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
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    locationText: {
        color: theme.colors.black,
        fontWeight: 'bold',
        marginLeft: 5
    }
});

export default LocationCardDetail;
