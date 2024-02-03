import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface AssetTagStatusProps {
    status: string;
}

const AssetTagStatus: FC<AssetTagStatusProps> = ({ status }) => {
    let backgroundColor = '#63CA7F';

    switch (status) {
        case 'ชำรุด':
            backgroundColor = '#F0787A';
            break;
        case 'รอส่งซ่อม':
            backgroundColor = '#F8A435';
            break;
        case 'ปกติ':
            backgroundColor = '#63CA7F';
            break;
        default:
            backgroundColor = '#2983BC';
            break;
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text variant="titleLarge" style={styles.statusText}>
                สถานะ : {status}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '80%',
        height: 35,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
    statusText: {
        fontFamily: 'Sarabun',
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.white
    }
});

export default AssetTagStatus;
