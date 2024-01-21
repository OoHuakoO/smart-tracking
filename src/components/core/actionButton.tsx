import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

const ActionButton = () => (
    <FAB style={styles.fab} icon="cog" onPress={() => console.log('Pressed')} />
);

const styles = StyleSheet.create({
    fab: {
        borderRadius: 25,
        backgroundColor: '#4499CE',
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    }
});

export default ActionButton;
