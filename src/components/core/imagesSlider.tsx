import { theme } from '@src/theme';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import Swiper from 'react-native-swiper';
const { width } = Dimensions.get('window');
const isSmallMb = width < 400;

const ImageSlider = () => {
    return (
        <View style={styles.container}>
            <Swiper showsButtons={false} autoplay={true} autoplayTimeout={3}>
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
                        resizeMode="cover"
                    />
                </View>
            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: isTablet() ? 300 : isSmallMb ? 120 : 150,
        marginTop: 10
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
        fontFamily: 'DMSans-Bold'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'fill'
    }
});

export default ImageSlider;
