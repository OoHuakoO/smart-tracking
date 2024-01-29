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
                        source={require('../../../assets/images/10103065.jpg')}
                    />
                </View>
                <View style={styles.slide2}>
                    <Image
                        style={styles.image}
                        source={require('../../../assets/images/img1.jpg')}
                    />
                </View>
                <View style={styles.slide3}>
                    <Image
                        style={styles.image}
                        source={require('../../../assets/images/img3.jpg')}
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
        backgroundColor: 'red'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
        borderRadius: 20
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
        borderRadius: 20
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    image: {
        width: 500,
        height: 200,
        objectFit: 'fill'
    }
});

export default ImageSlider;
