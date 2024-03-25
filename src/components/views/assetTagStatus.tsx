import {
    MOVEMENT_ASSET_NORMAL_TH,
    USE_STATE_ASSET_NORMAL_EN,
    USE_STATE_ASSET_TH
} from '@src/constant';
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
        case USE_STATE_ASSET_TH.Damaged:
            backgroundColor = '#F0787A';
            break;
        case USE_STATE_ASSET_TH.Repair:
            backgroundColor = '#F8A435';
            break;
        case USE_STATE_ASSET_NORMAL_EN:
            backgroundColor = '#63CA7F';
            break;
        case USE_STATE_ASSET_TH.Normal:
            backgroundColor = '#63CA7F';
            break;
        default:
            backgroundColor = '#2983BC';
            break;
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text variant="titleMedium" style={styles.statusText}>
                สถานะ :{' '}
                {status === USE_STATE_ASSET_NORMAL_EN
                    ? MOVEMENT_ASSET_NORMAL_TH
                    : status}
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
        fontFamily: 'Sarabun-Bold',
        color: theme.colors.white,
        fontSize: 16
    }
});

export default AssetTagStatus;
