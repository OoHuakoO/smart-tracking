import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Modal, Text } from 'react-native-paper';

interface PopUpDialogProp {
    visible: boolean;
    onClose: () => void;
    openImagePicker: () => void;
    handleCameraLaunch: () => void;
}

const PopUpDialog: FC<PopUpDialogProp> = (props) => {
    const { visible, onClose, openImagePicker, handleCameraLaunch } = props;
    const handleImageSelection = () => {
        onClose();
        openImagePicker();
    };

    const handleCameraLaunchAndClose = () => {
        onClose();
        handleCameraLaunch();
    };
    return (
        <Modal visible={visible} onDismiss={onClose}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} activeOpacity={0.5}>
                        <FontAwesomeIcon icon={faXmark} size={25} />
                    </TouchableOpacity>
                </View>
                <View style={styles.wraper}>
                    <Button
                        style={styles.button}
                        onPress={handleImageSelection}
                    >
                        <Text style={styles.text} variant="bodyLarge">
                            Choose from Device
                        </Text>
                    </Button>
                    <Button
                        style={styles.button}
                        onPress={handleCameraLaunchAndClose}
                    >
                        <Text style={styles.text} variant="bodyLarge">
                            Open Camera
                        </Text>
                    </Button>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    container: {
        height: 200,
        borderRadius: 20,
        marginHorizontal: 20,
        backgroundColor: theme.colors.pureWhite,
        zIndex: 1,
        justifyContent: 'center'
    },
    header: {
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 20
    },
    wraper: {
        padding: 25,
        gap: 20
    },
    button: {
        paddingVertical: 2,
        paddingHorizontal: 5,
        backgroundColor: theme.colors.buttonConfirm,
        borderRadius: 10
    },
    text: {
        fontFamily: 'DMSans-Medium',
        color: theme.colors.white
    }
});

export default PopUpDialog;
