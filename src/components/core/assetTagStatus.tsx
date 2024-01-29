import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface AssetTagStatusProps {}

const AssetTagStatus: FC<AssetTagStatusProps> = () => {
    return (
        <View style={styles.container}>
            <Text variant="titleLarge">สถานะ: รอส่งซ่อม</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '80%',
        height: 35,
        backgroundColor: 'green',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default AssetTagStatus;
