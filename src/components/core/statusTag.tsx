import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const StatusTag = ({ status }) => {
    let tagColor = '#21CA50'; // default color (green)

    // Set different colors based on the status
    if (status === 'Online') {
        tagColor = '#21CA50'; // yellow
    } else if (status === 'Offline') {
        tagColor = '#47ABE9'; // red
    }

    return (
        <View style={[styles.tag, { backgroundColor: tagColor }]}>
            <Text style={styles.tagText}>{status}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        marginLeft: 10
    },
    tagText: {
        color: '#0D0E0F',
        fontSize: 13,
        fontWeight: 'bold'
    }
});

export default StatusTag;
