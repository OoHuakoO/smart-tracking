import React, { ComponentProps, FC } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, MD3Colors, Portal, Text } from 'react-native-paper';

type DialogWithIconProps = ComponentProps<typeof Dialog> & {
    visible: boolean;
    close: () => void;
    titleText?: string;
    contentText?: string;
};

const DialogWithIcon: FC<DialogWithIconProps> = (props) => {
    const { visible, close, titleText, contentText } = props;
    return (
        <Portal>
            <Dialog onDismiss={close} visible={visible}>
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
