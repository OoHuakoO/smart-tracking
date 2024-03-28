import { theme } from '@src/theme';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';

const ImageSlider = () => {
    return (
        <View style={styles.container}>
            <Swiper
                style={styles.wrapper}
                showsButtons={false}
                autoplay={true}
                autoplayTimeout={3}
            >
                <View style={styles.slide1}>
                    <Image
                        style={styles.image}
                        source={require('../../../assets/images/Ads1.jpg')}
                    />
                </View>
                <View style={styles.slide2}>
                    <Image
                        style={styles.image}
                        source={require('../../../assets/images/Ads2.jpg')}
                    />
                </View>
                <View style={styles.slide3}>
                    <Image
                        style={styles.image}
                        source={require('../../../assets/images/Ads3.jpg')}
                    />
                </View>
            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {},
    container: {
        height: 150
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
        overflow: 'hidden',
        borderRadius: 10
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
        overflow: 'hidden',
        borderRadius: 10
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
        overflow: 'hidden',
        borderRadius: 10
    },
    text: {
        color: theme.colors.pureWhite,
        fontSize: 30,
        fontWeight: 'bold'
    },
    image: {
        width: 400,
        height: 150,
        objectFit: 'fill'
    }
});

export default ImageSlider;
