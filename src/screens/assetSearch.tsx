import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import AutoComplete from '@src/components/core/autoComplete';
import InputText from '@src/components/core/inputText';
import { GetAssetSearch } from '@src/services/asset';
import { theme } from '@src/theme';
import { AssetData } from '@src/typings/asset';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import React, { FC, useCallback, useState } from 'react';
import {
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
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
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleClearDropdown = useCallback(() => {
        setListCode([]);
    }, []);

    const handleOnChangeSearchCode = useCallback(async (text: string) => {
        try {
            setSearchCode(text);
            if (text !== '') {
                const isOnline = await getOnlineMode();
                if (isOnline) {
                    const response = await GetAssetSearch({
                        page: 1,
                        limit: 10,
                        search_term: { default_code: text }
                    });
                    setListCode(response?.result?.data?.asset);
                }
            } else {
                setListCode([]);
            }
        } catch (err) {
            setVisibleDialog(true);
            setContentDialog('Something went wrong search asset by code');
        }
    }, []);

    const handleOnChangeSearchName = useCallback(async (text: string) => {
        try {
            setSearchName(text);
            if (text !== '') {
                const isOnline = await getOnlineMode();
                if (isOnline) {
                    const response = await GetAssetSearch({
                        page: 1,
                        limit: 10,
                        search_term: { name: text }
                    });
                    setListName(response?.result?.data?.asset);
                }
            } else {
                setListName([]);
            }
        } catch (err) {
            setVisibleDialog(true);
            setContentDialog('Something went wrong search asset by name');
        }
    }, []);

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                handleClearDropdown();
                Keyboard.dismiss();
            }}
        >
            <SafeAreaView style={styles.container}>
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
                    <View style={styles.autoCompleteContainer}>
                        <View style={styles.autoCompleteBoxCode}>
                            <AutoComplete
                                data={listCode}
                                value={searchCode}
                                onChangeText={async (text) => {
                                    handleOnChangeSearchCode(text);
                                }}
                                hideResults={searchCode === ''}
                                flatListProps={{
                                    keyboardShouldPersistTaps: 'always',
                                    keyExtractor: (item: any) => item.asset_id,
                                    renderItem: ({ item }) => (
                                        <TouchableOpacity
                                            style={styles.itemContainer}
                                            onPress={() => {
                                                setSearchCode(
                                                    item.default_code
                                                );
                                                setListCode([]);
                                            }}
                                        >
                                            <Text style={styles.itemText}>
                                                {item.default_code}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    </View>
                    <Text variant="bodyLarge">Name</Text>
                    <View style={styles.autoCompleteContainer}>
                        <View style={styles.autoCompleteBoxName}>
                            <AutoComplete
                                data={listName}
                                value={searchName}
                                onChangeText={async (text) => {
                                    handleOnChangeSearchName(text);
                                }}
                                hideResults={searchName === ''}
                                flatListProps={{
                                    keyboardShouldPersistTaps: 'always',
                                    keyExtractor: (item: any) => item.asset_id,
                                    renderItem: ({ item }) => (
                                        <TouchableOpacity
                                            style={styles.itemContainer}
                                            onPress={() => {
                                                setSearchName(item.name);
                                                setListName([]);
                                            }}
                                        >
                                            <Text style={styles.itemText}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    </View>

                    <Text variant="bodyLarge">Location</Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />

                    <Text variant="bodyLarge">Status</Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />

                    <Text variant="bodyLarge">Catagory</Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />
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
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerInput: {
        marginHorizontal: 25
    },
    autoCompleteContainer: {
        position: 'relative',
        flex: 1,
        paddingTop: 50,
        marginTop: 10
    },
    autoCompleteBoxCode: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 2
    },
    autoCompleteBoxName: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    textSearchAsset: {
        fontWeight: 'bold',
        marginBottom: 15
    },
    itemContainer: {
        marginVertical: 5,
        marginLeft: 10
    },
    itemText: {
        fontSize: 15,
        margin: 2
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
    }
});
export default AssetSearch;
