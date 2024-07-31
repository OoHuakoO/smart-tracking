import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, RadioButton, Text } from 'react-native-paper';
interface PopupDeviceLoginProps {
    visible: boolean;
    modeDeviceLogin: string;
    handleChangeModeDeviceLogin: (value: string) => void;
    handleClose: () => void;
    handleConfirm: () => void;
}

const PopupDeviceLogin: FC<PopupDeviceLoginProps> = (props) => {
    const {
        visible,
        modeDeviceLogin,
        handleClose,
        handleConfirm,
        handleChangeModeDeviceLogin
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
                        User Login Another Device
                    </Text>
                </Dialog.Title>
                <Dialog.Content>
                    <RadioButton.Group
                        onValueChange={(newValue) =>
                            handleChangeModeDeviceLogin(newValue)
                        }
                        value={modeDeviceLogin}
                    >
                        <Text variant="titleMedium">
                            Your user is currently logged in on another device.
                        </Text>
                        <Text variant="titleMedium" style={styles.textQuestion}>
                            Would you like to proceed with the login?
                        </Text>
                        <View style={styles.rowRadio}>
                            <Text variant="bodyLarge" style={styles.textChoice}>
                                Yes (Logout other device)
                            </Text>
                            <RadioButton
                                color={theme.colors.buttonConfirm}
                                value="Yes"
                            />
                        </View>
                        <View style={styles.rowRadio}>
                            <Text style={styles.textChoice} variant="bodyLarge">
                                No
                            </Text>
                            <RadioButton
                                color={theme.colors.buttonConfirm}
                                value="No"
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
    textQuestion: {
        marginTop: 20,
        marginBottom: 20,
        fontFamily: 'DMSans-Medium'
    },
    textChoice: {
        marginRight: 5,
        fontFamily: 'DMSans-Bold'
    }
});

export default PopupDeviceLogin;
