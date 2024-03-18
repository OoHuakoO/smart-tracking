import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { FC } from 'react';
import { Button, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modal } from 'react-native-paper';

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
        <Modal visible={visible}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} activeOpacity={0.5}>
                        <FontAwesomeIcon icon={faXmark} size={25} />
                    </TouchableOpacity>
                </View>
                <View style={styles.wraper}>
                    <Button
                        title="Choose from Device"
                        onPress={handleImageSelection}
                    />
                    <Button
                        title="Open Camera"
                        onPress={handleCameraLaunchAndClose}
                    />
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
        backgroundColor: 'white',
        zIndex: 1,
        justifyContent: 'center'
    },
    header: {
        alignSelf: 'flex-end',
        marginRight: 20
    },
    wraper: {
        padding: 25,
        gap: 20
    }
});

export default PopUpDialog;
