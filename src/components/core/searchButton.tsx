import { theme } from '@src/theme';
import React, { FC, memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { isTablet } from 'react-native-device-info';
import ActionButton from './actionButton';

interface SearchButtonProps {
    handlePress: () => void;
}

const SearchButton: FC<SearchButtonProps> = (props) => {
    const { handlePress } = props;
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.5}
        >
            <ActionButton
                icon={'magnify'}
                size={isTablet ? "medium" : "small"}
                backgroundColor={theme.colors.white}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        zIndex: 2
    }
});

export default memo(SearchButton);
