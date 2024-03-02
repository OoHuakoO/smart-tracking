import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import { GetAssetSearch } from '@src/services/asset';
import { GetLocationSearch } from '@src/services/location';
import { theme } from '@src/theme';
import { AssetData } from '@src/typings/asset';
import { LocationSearchData } from '@src/typings/location';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import React, { FC, useCallback, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { Text } from 'react-native-paper';

type AssetsSearchScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'AssetSearch'
>;

const AssetSearch: FC<AssetsSearchScreenProps> = (props) => {
    const { navigation } = props;
    const [listCode, setListCode] = useState<AssetData[]>([]);
    const [searchCode, setSearchCode] = useState<string>('');
    const [listName, setListName] = useState<AssetData[]>([]);
    const [searchName, setSearchName] = useState<string>('');
    const [listLocation, setListLocation] = useState<LocationSearchData[]>([]);
    const [searchLocation, setSearchLocation] = useState<string>('');
    const [isFocusCode, setIsFocusCode] = useState<boolean>(false);
    const [isFocusName, setIsFocusName] = useState<boolean>(false);
    const [isFocusLocation, setIsFocusLocation] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleOnChangeSearchCode = useCallback(async (text: string) => {
        try {
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const response = await GetAssetSearch({
                    page: 1,
                    limit: 10,
                    search_term: { default_code: text }
                });
                setListCode(response?.result?.data?.asset);
            }
        } catch (err) {
            setVisibleDialog(true);
            setContentDialog('Something went wrong search asset by code');
        }
    }, []);

    const handleOnChangeSearchName = useCallback(async (text: string) => {
        try {
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const response = await GetAssetSearch({
                    page: 1,
                    limit: 10,
                    search_term: { name: text }
                });
                setListName(response?.result?.data?.asset);
            }
        } catch (err) {
            setVisibleDialog(true);
            setContentDialog('Something went wrong search asset by name');
        }
    }, []);

    const handleOnChangeSearchLocation = useCallback(async (text: string) => {
        try {
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const response = await GetLocationSearch({
                    page: 1,
                    limit: 10,
                    search_term: text
                });
                setListLocation(response?.result?.data?.locations);
            }
        } catch (err) {
            setVisibleDialog(true);
            setContentDialog('Something went wrong search location');
        }
    }, []);

    const renderItemCode = (item: AssetData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    {item?.default_code}
                </Text>
            </View>
        );
    };

    const renderItemName = (item: AssetData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    {item?.name}
                </Text>
            </View>
        );
    };

    const renderItemLocation = (item: LocationSearchData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    {item?.location_name}
                </Text>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <AlertDialog
                    textContent={contentDialog}
                    visible={visibleDialog}
                    handleClose={handleCloseDialog}
                    handleConfirm={handleCloseDialog}
                />
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => navigation.goBack()}
                    style={styles.closeButton}
                >
                    <ActionButton
                        icon={'close'}
                        size="small"
                        backgroundColor={theme.colors.white}
                    />
                </TouchableOpacity>
                <View style={styles.containerInput}>
                    <Text variant="displaySmall" style={styles.textSearchAsset}>
                        Search Asset
                    </Text>
                    <Text variant="bodyLarge">Code</Text>
                    <Dropdown
                        style={[
                            styles.dropdown,
                            isFocusCode && styles.dropdownSelect
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={listCode}
                        search
                        maxHeight={300}
                        labelField="default_code"
                        valueField="default_code"
                        placeholder={'Select Code'}
                        searchPlaceholder="Search"
                        value={searchCode}
                        onFocus={() => setIsFocusCode(true)}
                        onBlur={() => setIsFocusCode(false)}
                        onChange={(item) => {
                            setSearchCode(item?.default_code);
                        }}
                        onChangeText={(text) => handleOnChangeSearchCode(text)}
                        renderItem={renderItemCode}
                    />
                    <Text variant="bodyLarge">Name</Text>
                    <Dropdown
                        style={[
                            styles.dropdown,
                            isFocusName && styles.dropdownSelect
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={listName}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="name"
                        placeholder={'Select Name'}
                        searchPlaceholder="Search"
                        value={searchName}
                        onFocus={() => setIsFocusName(true)}
                        onBlur={() => setIsFocusName(false)}
                        onChange={(item) => {
                            setSearchName(item?.name);
                        }}
                        onChangeText={(text) => handleOnChangeSearchName(text)}
                        renderItem={renderItemName}
                    />
                    <Text variant="bodyLarge">Location</Text>

                    <Dropdown
                        style={[
                            styles.dropdown,
                            isFocusLocation && styles.dropdownSelect
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={listLocation}
                        search
                        maxHeight={300}
                        labelField="location_name"
                        valueField="location_name"
                        placeholder={'Select Location'}
                        searchPlaceholder="Search"
                        value={searchLocation}
                        onFocus={() => setIsFocusLocation(true)}
                        onBlur={() => setIsFocusLocation(false)}
                        onChange={(item) => {
                            setSearchLocation(item?.location_name);
                        }}
                        onChangeText={(text) =>
                            handleOnChangeSearchLocation(text)
                        }
                        renderItem={renderItemLocation}
                    />

                    <Text variant="bodyLarge">Status</Text>

                    <Text variant="bodyLarge">Catagory</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.buttonClear}
                            onPress={() => console.log('Button 1 Pressed')}
                        >
                            <Text variant="bodyLarge" style={styles.buttonText}>
                                Clear
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonApply}
                            onPress={() => console.log('Button 2 Pressed')}
                        >
                            <Text variant="bodyLarge" style={styles.buttonText}>
                                Apply
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerInput: {
        marginHorizontal: 25
    },
    textSearchAsset: {
        fontWeight: 'bold',
        marginBottom: 15
    },
    navigationContainer: {
        backgroundColor: '#ecf0f1'
    },
    closeButton: {
        marginVertical: 20,
        alignSelf: 'flex-end',
        marginRight: 15
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    buttonApply: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        backgroundColor: theme.colors.buttonConfirm
    },
    buttonClear: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#FF6C6C'
    },
    buttonText: {
        color: theme.colors.white,
        fontWeight: '600'
    },
    dropdown: {
        height: 50,
        borderColor: theme.colors.borderAutocomplete,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        color: theme.colors.black
    },
    dropdownSelect: {
        borderColor: theme.colors.buttonConfirm
    },
    dropdownItem: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dropdownItemText: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.black,
        fontFamily: 'DMSans-Regular'
    },
    icon: {
        marginRight: 5
    },
    placeholderStyle: {
        fontFamily: 'DMSans-Regular',
        fontSize: 16,
        color: theme.colors.textBody
    },
    selectedTextStyle: {
        fontSize: 16,
        color: theme.colors.black,
        fontFamily: 'DMSans-Regular'
    },
    iconStyle: {
        width: 20,
        height: 20
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: theme.colors.black,
        fontFamily: 'DMSans-Regular'
    }
});
export default AssetSearch;
