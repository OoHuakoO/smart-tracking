import SearchDocument from '@src/components/core/searchDocument';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const Document = () => {
    return (
        <View>
            <Text variant="displayLarge">Document</Text>
            <SearchDocument />
        </View>
    );
};

export default Document;
