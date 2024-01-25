import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph } from 'react-native-paper';

const ImageSlider = () => {
    return (
        // <Swiper style={styles.wrapper} showsButtons={true}>
        //     <View style={styles.slide1}>
        //         <Image source={require('./assets/TotalAsset.png')} />
        //     </View>
        //     <View style={styles.slide1}>
        //         <Image source={ImagesAssets.total} />
        //     </View>
        //     <View style={styles.slide1}>
        //         <Image source={ImagesAssets.total} />
        //     </View>
        // </Swiper>
        <View style={styles.wrapper}>
            <Paragraph>Advertisement section</Paragraph>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        height: 150,
        backgroundColor: 'red'
    }
});

export default ImageSlider;
