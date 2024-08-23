import { theme } from '@src/theme';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
const { width, height } = Dimensions.get('window');
const isTablet = width >= 768 && height >= 768;
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
        paddingHorizontal: isTablet ? 10 : 4,
        paddingVertical: isTablet ? 10 : 4,
        borderRadius: 5,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center'
    },
    tagText: {
        color: '#0D0E0F',
        fontSize: isTablet ? 20 : 13,
        fontFamily: 'DMSans-Bold'
    }
});

export default StatusTag;
