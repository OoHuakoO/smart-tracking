import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, RadioButton, Text } from 'react-native-paper';
interface PopupSelectModeCompanyProps {
    visible: boolean;
    modeCompany: string;
    handleChangeModeCompany: (value: string) => void;
    handleClose: () => void;
    handleConfirm: () => void;
}

const PopupSelectModeCompany: FC<PopupSelectModeCompanyProps> = (props) => {
    const {
        visible,
        modeCompany,
        handleClose,
        handleConfirm,
        handleChangeModeCompany
    } = props;

    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={handleClose}
                style={styles.dialogContainer}
            >
                <Dialog.Title>
                    <Text variant="titleLarge" style={styles.dialogTitle}>
                        Select Mode Online/Offline
                    </Text>
                </Dialog.Title>
                <Dialog.Content>
                    <RadioButton.Group
                        onValueChange={(newValue) =>
                            handleChangeModeCompany(newValue)
                        }
                        value={modeCompany}
                    >
                        <View style={styles.rowRadio}>
                            <Text variant="bodyLarge" style={styles.textChoice}>
                                Online
                            </Text>
                            <RadioButton
                                color={theme.colors.buttonConfirm}
                                value="Online"
                            />
                        </View>
                        <View style={styles.rowRadio}>
                            <Text style={styles.textChoice} variant="bodyLarge">
                                Offline
                            </Text>
                            <RadioButton
                                color={theme.colors.buttonConfirm}
                                value="Offline"
                            />
                        </View>
                    </RadioButton.Group>
                </Dialog.Content>

                <Dialog.Actions>
                    <TouchableOpacity onPress={handleClose}>
                        <Button style={styles.dialogActionCancel}>
                            <Text style={styles.text} variant="bodyLarge">
                                Cancel
                            </Text>
                        </Button>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleConfirm}>
                        <Button style={styles.dialogActionConfirm}>
                            <Text style={styles.text} variant="bodyLarge">
                                Confirm
                            </Text>
                        </Button>
                    </TouchableOpacity>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    dialogContainer: {
        backgroundColor: theme.colors.pureWhite,
        padding: 5,
        display: 'flex',
        justifyContent: 'center'
    },
    dialogTitle: {
        fontFamily: 'DMSans-Medium'
    },
    dialogActionCancel: {
        paddingVertical: 2,
        paddingHorizontal: 5,
        backgroundColor: theme.colors.buttonCancel,
        borderRadius: 10
    },
    text: {
        fontFamily: 'DMSans-Medium',
        color: theme.colors.white
    },
    dialogActionConfirm: {
        paddingVertical: 2,
        paddingHorizontal: 5,
        backgroundColor: theme.colors.buttonConfirm,
        borderRadius: 10
    },
    rowRadio: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textChoice: {
        marginRight: 5,
        fontFamily: 'DMSans-Bold'
    }
});

export default PopupSelectModeCompany;
