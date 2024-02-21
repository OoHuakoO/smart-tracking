import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modal, Searchbar, Text } from 'react-native-paper';

interface DocumentDialogProp {
    visible: boolean;
    onClose: () => void;
    pageNavigate: () => void;
}

const DocumentDialog: FC<DocumentDialogProp> = (props) => {
    const { visible, onClose, pageNavigate } = props;

    return (
        <Modal visible={visible}>
            <View style={styles.container}>
                <View style={styles.elementContainer}>
                    <Text variant="titleMedium" style={styles.dialogTitle}>
                        Search Location
                    </Text>
                    <Searchbar
                        placeholder="Search"
                        style={styles.searchBar}
                        value=""
                    />

                    <View style={styles.searchList}>
                        <TouchableOpacity
                            style={styles.listStyle}
                            onPress={pageNavigate}
                        >
                            <Text variant="bodyLarge">H0-10th</Text>
                        </TouchableOpacity>
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
        borderRadius: 10
    },
    searchList: {},
    listStyle: {
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        paddingVertical: 15
    },
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
