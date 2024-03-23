import { theme } from '@src/theme';
import React, { FC, memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ActionButton from './actionButton';

interface ScanButtonProps {
    handlePress: () => void;
}

const ScanButton: FC<ScanButtonProps> = (props) => {
    const { handlePress } = props;
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.5}
        >
            <ActionButton
                icon="barcode"
                size="small"
                backgroundColor={theme.colors.white}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 20
    }
});

export default memo(ScanButton);
