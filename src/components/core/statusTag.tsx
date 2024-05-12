import { theme } from '@src/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const StatusTag = ({ status }) => {
    let tagColor = theme.colors.toggleOnline;

    if (status === 'Online') {
        tagColor = theme.colors.toggleOnline;
    } else if (status === 'Offline') {
        tagColor = theme.colors.toggleOffline;
    }

    return (
        <View style={[styles.tag, { backgroundColor: tagColor }]}>
            <Text style={styles.tagText}>{status}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 5,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center'
    },
    tagText: {
        color: '#0D0E0F',
        fontSize: 13,
        fontWeight: 'bold'
    }
});

export default StatusTag;
