import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Dialog, Portal, ProgressBar, Text } from 'react-native-paper';
interface PopupDocumentDoneOdooProps {
    visible: boolean;
    listTrackingID: number[];
    showProgressBar: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
}

const PopupDocumentDoneOdoo: FC<PopupDocumentDoneOdooProps> = (props) => {
    const {
        visible,
        listTrackingID,
        showProgressBar,
        handleClose,
        handleConfirm
    } = props;

    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={handleClose}
                style={styles.dialogContainer}
                dismissable={false}
            >
                <Dialog.Title>
                    <Text variant="titleLarge">
                        Found Document Done On Odoo
                    </Text>
                </Dialog.Title>
                <Dialog.Content>
                    <Text variant="titleMedium" style={styles.dialogContent}>
                        Documents are done / check can't be edited anymore. Want
                        to create new ones?
                    </Text>
                    <Text variant="titleMedium" style={styles.documentText}>
                        Document : {listTrackingID?.join(', ')}
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
                )}
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
    dialogContent: {
        marginBottom: 10
    },
    documentText: {
        color: theme.colors.documentDraft,
        fontFamily: 'DMSans-Bold'
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
    progressBar: {
        width: '80%',
        alignSelf: 'center',
        marginBottom: 30
    }
});

export default PopupDocumentDoneOdoo;
