import { theme } from '@src/theme';
import { LocationSearchData } from '@src/typings/location';
import React, { FC } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modal, Searchbar, Text } from 'react-native-paper';

interface DocumentDialogProp {
    visible: boolean;
    onClose: () => void;
    locationSearch: string;
    listLocation: LocationSearchData[];
    handleSearchLocation: (text: string) => void;
    handleSelectLocation: (location: LocationSearchData) => void;
}

const DocumentDialog: FC<DocumentDialogProp> = (props) => {
    const {
        visible,
        onClose,
        locationSearch,
        listLocation,
        handleSearchLocation,
        handleSelectLocation
    } = props;

    return (
        <Modal visible={visible} onDismiss={onClose}>
            <View style={styles.container}>
                <View style={styles.elementContainer}>
                    <Text variant="titleMedium" style={styles.dialogTitle}>
                        Search Location
                    </Text>
                    <Searchbar
                        placeholder="Search"
                        style={styles.searchBar}
                        value={locationSearch}
                        onChangeText={(text) => handleSearchLocation(text)}
                    />

                    <FlatList
                        style={styles.flatListStyle}
                        data={listLocation}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.listStyle}
                                onPress={() => handleSelectLocation(item)}
                            >
                                <Text variant="bodyLarge">
                                    {item?.location_name}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.location_id.toString()}
                    />

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
        backgroundColor: theme.colors.pureWhite,
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
        borderColor: theme.colors.borderAutocomplete,
        backgroundColor: theme.colors.pureWhite,
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
        backgroundColor: theme.colors.buttonCancel,
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 15,
        alignItems: 'center'
    },
    flatListStyle: { height: 250, marginTop: 30 }
});

export default DocumentDialog;
