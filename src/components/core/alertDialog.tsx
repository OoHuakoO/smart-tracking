import { SOMETHING_WENT_WRONG, WARNING } from '@src/constant';
import { theme } from '@src/theme';
import React, { FC, memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Dialog, Portal, ProgressBar, Text } from 'react-native-paper';
interface AlertDialogProps {
    visible: boolean;
    textTitle?: string;
    textContent?: string;
    disableClose?: boolean;
    showCloseDialog?: boolean;
    showProgressBar?: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
}

const AlertDialog: FC<AlertDialogProps> = (props) => {
    const {
        visible,
        textTitle,
        textContent,
        handleClose,
        disableClose,
        showCloseDialog,
        showProgressBar,
        handleConfirm
    } = props;
    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={handleClose}
                style={styles.dialogContainer}
                {...(disableClose && { dismissable: false })}
            >
                <Dialog.Title>
                    <Text variant="titleLarge" style={styles.dialogTitle}>
                        {textTitle || WARNING}
                    </Text>
                </Dialog.Title>
                <Dialog.Content>
                    <Text variant="titleMedium">
                        {textContent || SOMETHING_WENT_WRONG}
                    </Text>
                </Dialog.Content>
                {showProgressBar ? (
                    <ProgressBar
                        indeterminate
                        color={theme.colors.primary}
                        style={styles.progressBar}
                    />
                ) : (
                    <Dialog.Actions>
                        {showCloseDialog && (
                            <TouchableOpacity onPress={handleClose}>
                                <Button style={styles.dialogActionCancel}>
                                    <Text
                                        style={styles.textActionCancel}
                                        variant="bodyLarge"
                                    >
                                        Cancel
                                    </Text>
                                </Button>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={handleConfirm}>
                            <Button style={styles.dialogActionConfirm}>
                                <Text
                                    style={styles.textActionConfirm}
                                    variant="bodyLarge"
                                >
                                    Confirm
                                </Text>
                            </Button>
                        </TouchableOpacity>
                    </Dialog.Actions>
                )}
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    dialogContainer: {
        backgroundColor: 'white',
        padding: 5,
        display: 'flex',
        justifyContent: 'center'
    },
    dialogTitle: {
        fontWeight: 'bold'
    },

    dialogActionCancel: {
        paddingVertical: 2,
        paddingHorizontal: 5,
        backgroundColor: theme.colors.buttonCancel,
        borderRadius: 10
    },
    textActionCancel: {
        fontFamily: 'DMSans-Medium',
        color: theme.colors.white
    },
    dialogActionConfirm: {
        paddingVertical: 2,
        paddingHorizontal: 5,
        backgroundColor: theme.colors.buttonConfirm,
        borderRadius: 10
    },
    textActionConfirm: {
        fontFamily: 'DMSans-Medium',
        color: theme.colors.white
    },
    progressBar: {
        width: '80%',
        alignSelf: 'center',
        marginBottom: 30
    }
});

export default memo(AlertDialog);
