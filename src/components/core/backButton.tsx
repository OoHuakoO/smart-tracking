import { theme } from '@src/theme';
import React, { FC, memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ActionButton from './actionButton';

interface BackButtonProps {
    handlePress: () => void;
}

const BackButton: FC<BackButtonProps> = (props) => {
    const { handlePress } = props;
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.5}
        >
            <ActionButton
                icon="chevron-left"
                size={'small'}
                backgroundColor={theme.colors.white}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 20,
        marginVertical: 20
    }
});

export default memo(BackButton);
