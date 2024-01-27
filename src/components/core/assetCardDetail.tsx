import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const AssetCardDetail = () => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.imagesContainer}>
                <View>
                    <Image
                        style={styles.image}
                        source={require('../../../assets/images/img3.jpg')}
                    />
                </View>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.assetCode}>RB0001</Text>
                <Text style={styles.additionalText}>Table</Text>
                <View>
                    <FontAwesomeIcon icon={faLocationDot} color="red" />
                    <Text style={styles.locationText}>Location-01</Text>
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
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4
    },
    imagesContainer: {
        width: 75,
        height: 75,
        backgroundColor: 'red',
        borderRadius: 15
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 15
    },
    textContainer: {
        marginLeft: 20
    },
    assetCode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'blue'
    },
    additionalText: {
        fontSize: 14,
        color: '#777'
    },

    locationText: {
        color: 'black',
        fontWeight: 'bold',
        marginTop: 6
    }
});

export default AssetCardDetail;
