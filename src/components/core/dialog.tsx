import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, MD3Colors, Portal, Text } from 'react-native-paper';

const DialogWithIcon = ({
    visible,
    close,
    titleText,
    contentText
}: {
    visible: boolean;
    close: () => void;
    titleText: string;
    contentText: string;
}) => {
    return (
        <Portal>
            <Dialog onDismiss={close} visible={visible}>
                {/* <Dialog.Icon icon="alert" /> */}
                <Dialog.Title style={styles.title}>{titleText}</Dialog.Title>
                <Dialog.Content>
                    <Text>{contentText}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={close} color={MD3Colors.error50}>
                        Disagree
                    </Button>
                    <Button onPress={close}>Agree</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'left'
    }
});
export default DialogWithIcon;
