import React from 'react';
import { TextInput } from 'react-native';

export type Props = React.ComponentProps<typeof TextInput> & {
    errorText?: string;
    placeholder?: string;
};
