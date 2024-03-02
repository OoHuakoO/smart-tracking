import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import Autocomplete, {
    AutocompleteInputProps
} from 'react-native-autocomplete-input';

interface AutoCompleteProps extends AutocompleteInputProps<any> {}

const AutoComplete: FC<AutoCompleteProps> = (props) => {
    const { ...otherProps } = props;
    return (
        <Autocomplete
            autoCorrect={false}
            inputContainerStyle={styles.inputContainer}
            style={styles.core}
            {...otherProps}
        />
    );
};

const styles = StyleSheet.create({
    core: {
        color: theme.colors.black,
        borderRadius: 10,
        paddingLeft: 10,
        borderColor: theme.colors.borderAutocomplete,
        borderWidth: 1,
        backgroundColor: theme.colors.pureWhite
    },
    inputContainer: {
        borderWidth: 0,
        margin: 0
    }
});

export default AutoComplete;
