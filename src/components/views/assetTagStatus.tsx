import { USE_STATE_ASSET_NORMAL_EN, USE_STATE_ASSET_TH } from '@src/constant';
import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface AssetTagStatusProps {
    status: string | number;
}

const AssetTagStatus: FC<AssetTagStatusProps> = ({ status }) => {
    let backgroundColor = theme.colors.documentDone;
    switch (status) {
        case USE_STATE_ASSET_TH.Damaged:
            backgroundColor = theme.colors.documentCancel;
            break;
        case USE_STATE_ASSET_TH.Repair:
            backgroundColor = theme.colors.documentCheck;
            break;
        case USE_STATE_ASSET_NORMAL_EN:
            backgroundColor = theme.colors.documentDone;
            break;
        case USE_STATE_ASSET_TH.Normal:
            backgroundColor = theme.colors.documentDone;
            break;
        default:
            backgroundColor = theme.colors.primary;
            break;
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text variant="titleMedium" style={styles.statusText}>
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
        shadowColor: theme.colors.black,
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
