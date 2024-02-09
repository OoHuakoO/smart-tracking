import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modal, Text } from 'react-native-paper';

interface DocumentDialogProp {
    visible: boolean;
    onClose: () => void;
}

const DocumentDialog: FC<DocumentDialogProp> = (props) => {
    const { visible, onClose } = props;

    return (
        <Modal visible={visible}>
            <View style={styles.container}>
                <View style={styles.elementContainer}>
                    <Text variant="titleMedium" style={styles.dialogTitle}>
                        Search Location
                    </Text>
                    {/* <Searchbar placeholder="Search" style={styles.searchBar} /> */}

                    <View style={styles.searchList}>
                        <Text>dddd</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onClose}
                        >
                            <Text
                                variant="bodyMedium"
                                style={{ color: theme.colors.white }}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    container: {
        height: 500,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 12,
        marginHorizontal: 20,
        backgroundColor: 'white',
        zIndex: 1
    },
    elementContainer: {
        padding: 10
    },
    dialogTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
        marginLeft: 10
    },
    searchBar: {
        borderWidth: 1,
        borderColor: '#A1A1A1',
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 10
    },
    searchList: {},
    buttonContainer: {
        marginTop: 20
    },
    button: {
        alignSelf: 'flex-end',
        backgroundColor: '#FF6C6C',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 15,
        alignItems: 'center'
    }
});

export default DocumentDialog;
