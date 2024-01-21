import React, { FC, memo, useState } from 'react';

import DialogWithIcon from '@src/components/core/dialog';
import InputText from '@src/components/core/inputText';
import StatusTag from '@src/components/core/statusTag';
import { theme } from '@src/theme';
import { Navigation } from '@src/typings/navigattion';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface SettingScreenProps {
    navigation: Navigation;
}

type ButtonVisibility = {
    [key: string]: boolean | undefined;
};

const SettingScreen: FC<SettingScreenProps> = () => {
    const [visible, setVisible] = React.useState<ButtonVisibility>({});

    const _toggleDialog = (name: string) => () =>
        setVisible({ ...visible, [name]: !visible[name] });

    const _getVisible = (name: string) => !!visible[name];

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
                <InputText
                    placeholder="Setting 1"
                    value={settingValues.input6}
                    onChangeText={(text) => handleInputChange('input6', text)}
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
                <InputText
                    placeholder="Setting 2"
                    value={settingValues.input6}
                    onChangeText={(text) => handleInputChange('input6', text)}
                />
                <InputText
                    placeholder="Setting 3"
                    value={settingValues.input6}
                    onChangeText={(text) => handleInputChange('input6', text)}
                />
                <InputText
                    placeholder="Setting 4"
                    value={settingValues.input6}
                    onChangeText={(text) => handleInputChange('input6', text)}
                />
                <InputText
                    placeholder="Setting 5"
                    value={settingValues.input6}
                    onChangeText={(text) => handleInputChange('input6', text)}
                />
                <InputText
                    placeholder="Setting 6"
                    value={settingValues.input6}
                    onChangeText={(text) => handleInputChange('input6', text)}
                />
            </View>
            <View style={styles.row}>
                <Button
                    mode="contained-tonal"
                    onPress={_toggleDialog('dialog6')}
                >
                    Close
                </Button>
                <Button
                    mode="contained-tonal"
                    style={styles.button}
                    onPress={() => {
                        handleSaveSettings;
                    }}
                >
                    Save
                </Button>
            </View>
            <DialogWithIcon
                visible={_getVisible('dialog6')}
                close={_toggleDialog('dialog6')}
                titleText="testt jaa"
                contentText="test hiiii"
            />
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
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: 4
    }
});

export default memo(SettingScreen);
