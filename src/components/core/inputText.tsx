import { theme } from '@src/theme';
import React, { memo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = React.ComponentProps<typeof TextInput> & {
    errorText?: string;
    placeholder?: string;
};

const InputText = ({ errorText, placeholder }: Props) => (
    <View style={styles.container}>
        <TextInput style={styles.input} placeholder={placeholder} />
        {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
);

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
