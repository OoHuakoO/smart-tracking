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
    width?: number;
    borderColor?: string;
}

const InputText = forwardRef<TextInput, InputTextProps>((props, ref) => {
    const { placeholder, errorText, width, borderColor } = props;
    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.input,
                    { width: width || '100%' },
                    { borderColor: borderColor || 'gray' }
                ]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textBody}
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
        height: 48,
        borderColor: theme.colors.borderAutocomplete,
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        fontFamily: 'DMSans-Bold',
        color: theme.colors.textBody
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4
    }
});

export default memo(InputText);
