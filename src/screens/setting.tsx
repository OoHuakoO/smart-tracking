import React, { FC, memo, useState } from 'react';

import StatusTag from '@src/components/core/statusTag';
import { theme } from '@src/theme';
import { Navigation } from '@src/typings/navigattion';
import {
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    View
} from 'react-native';
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

    const handleSaveSettings = () => {
        // Add your logic to save the settings (e.g., send to server, store in AsyncStorage)
        console.log('Saving settings:', settingValues);
    };

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View>
                <Text variant="headlineLarge" style={styles.textHeader}>
                    Document
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Setting 1"
                    value={settingValues.input1}
                    onChangeText={(text) => handleInputChange('input1', text)}
                />
            </View>
            <View>
                <Text variant="headlineLarge" style={styles.textHeader}>
                    Odoo Config
                </Text>
                <View style={styles.modeSection}>
                    <View style={styles.statusTag}>
                        <Text variant="bodyLarge">Mode</Text>
                        <StatusTag status={'Online'} />
                    </View>
                    <View>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                </View>
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
            </View>
            <View style={styles.button}>
                <Button
                    title="Cancel"
                    onPress={() =>
                        Alert.alert('Do you want to save this actions.')
                    }
                />
                <Button title="Save" onPress={handleSaveSettings} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    textHeader: {
        width: '100%',
        color: theme.colors.textPrimary,
        fontWeight: '700',
        textAlign: 'left',
        marginBottom: 15
    },
    container: {
        flex: 1,
        padding: 16
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
    modeSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    statusTag: {
        display: 'flex',
        flexDirection: 'row'
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default memo(SettingScreen);
