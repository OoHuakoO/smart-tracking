import { SOMETHING_WENT_WRONG, WARNING } from '@src/constant';
import { theme } from '@src/theme';
import React, { FC, memo } from 'react';
import { StyleSheet } from 'react-native';
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
                <Dialog.Title style={styles.dialogTitle}>
                    <Text style={styles.dialogTitle}>
                        {textTitle || WARNING}
                    </Text>
                </Dialog.Title>
                <Dialog.Content>
                    <Text style={styles.dialogContent}>
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
                            <Button
                                style={styles.dialogActionCancel}
                                onPress={handleClose}
                            >
                                <Text style={styles.textActionCancel}>
                                    Cancel
                                </Text>
                            </Button>
                        )}

                        <Button
                            style={styles.dialogActionConfirm}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.textActionConfirm}>
                                Confirm
                            </Text>
                        </Button>
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
        fontFamily: 'DMSans-Bold',
        fontSize: 22
    },
    dialogContent: {
        fontFamily: 'DMSans-Regular',
        fontSize: 16
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
