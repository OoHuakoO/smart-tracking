import LocationCardDetail from '@src/components/core/locationCardDetail';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const Location = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineLarge">Auu kor tum This page </Text>
            <LocationCardDetail />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
});

export default Location;
