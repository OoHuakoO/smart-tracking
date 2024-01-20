import React, { FC, memo, useState } from 'react';

import { theme } from '@src/theme';
import { Navigation } from '@src/typings/navigattion';
import { Button, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';

interface SettingScreenProps {
    navigation: Navigation;
}

const SettingScreen: FC<SettingScreenProps> = () => {
    const [settingValues, setSettingValues] = useState({
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        input6: ''
    });

    const handleInputChange = (name, value) => {
        setSettingValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleCancelSettings = () => {
        // Add your logic to save the settings (e.g., send to server, store in AsyncStorage)
        console.log('Cancel Settings :', settingValues);
    };

    const handleSaveSettings = () => {
        // Add your logic to save the settings (e.g., send to server, store in AsyncStorage)
        console.log('Saving settings:', settingValues);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text variant="headlineLarge" style={styles.textHeader}>
                Document
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Setting 1"
                value={settingValues.input1}
                onChangeText={(text) => handleInputChange('input1', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Setting 2"
                value={settingValues.input2}
                onChangeText={(text) => handleInputChange('input2', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Setting 3"
                value={settingValues.input3}
                onChangeText={(text) => handleInputChange('input3', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Setting 4"
                value={settingValues.input4}
                onChangeText={(text) => handleInputChange('input4', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Setting 5"
                value={settingValues.input5}
                onChangeText={(text) => handleInputChange('input5', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Setting 6"
                value={settingValues.input6}
                onChangeText={(text) => handleInputChange('input6', text)}
            />
            <View style={styles.button}>
                <Button title="Cancel" onPress={handleCancelSettings} />
                <Button title="Save" onPress={handleSaveSettings} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    textHeader: {
        color: theme.colors.textPrimary,
        fontWeight: '700'
    },
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        height: 70,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        width: '100%',
        borderRadius: 20
    },
    button: {
        display: 'flex',
        flexDirection: 'row'
    }
});

export default memo(SettingScreen);
