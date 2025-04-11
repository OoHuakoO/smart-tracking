import { theme } from '@src/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';

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
        paddingHorizontal: isTablet() ? 20 : 15,
        paddingVertical: isTablet() ? 10 : 5,
        borderRadius: 15,
        marginLeft: 0,
        justifyContent: 'center'
    },
    tagText: {
        color: '#0D0E0F',
        fontSize: isTablet() ? 20 : 15,
        fontFamily: 'DMSans-Bold'
    }
});

export default StatusTag;
