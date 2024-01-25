import { theme } from '@src/theme';
import React, { forwardRef, memo } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View
} from 'react-native';

interface InputTextProps extends TextInputProps {
    errorText?: string;
    placeholder?: string;
}

const InputText = forwardRef<TextInput, InputTextProps>((props, ref) => {
    const { placeholder, errorText } = props;
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                {...props}
                ref={ref}
            />
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 70,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 5,
        paddingHorizontal: 10,
        width: '100%',
        borderRadius: 20
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4
    }
});

export default memo(InputText);
