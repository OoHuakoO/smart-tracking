import React, { ComponentProps, FC, memo } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { Modal } from 'react-native-paper';

type AlertDialogProps = ComponentProps<typeof TextInput> & {
    visible: boolean;
    text: string;
    handleClose: () => void;
};

const AlertDialog: FC<AlertDialogProps> = (props) => {
    const { visible, text, handleClose } = props;
    return (
        <Modal
            visible={visible}
            onDismiss={() => handleClose()}
            contentContainerStyle={styles.container}
        >
            <Text>{text}</Text>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 20,
        height: 300,
        width: 300,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default memo(AlertDialog);
