import React, { FC, memo } from 'react';
import { Dialog, DialogProps, Portal, Text } from 'react-native-paper';

interface AlertDialogProps extends DialogProps {
    visible: boolean;
    titleText: string;
    textContent: string;
    handleClose: () => void;
}

const AlertDialog: FC<AlertDialogProps> = (props) => {
    const { visible, titleText, textContent, handleClose } = props;
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={handleClose}>
                <Dialog.Title>{titleText}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{textContent}</Text>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
};

export default memo(AlertDialog);
