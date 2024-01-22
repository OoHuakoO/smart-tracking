import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

const ActionButton = () => {
    return <FAB style={styles.fab} icon="cog" />;
};

const styles = StyleSheet.create({
    fab: {
        borderRadius: 25,
        backgroundColor: '#4499CE'
    }
});

export default ActionButton;
