import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import { getAsset } from '@src/db/asset';
import { getCategory } from '@src/db/category';
import { getDBConnection } from '@src/db/config';
import { getUseStatus } from '@src/db/useStatus';
import { GetAssetSearch } from '@src/services/asset';
import { GetAssets, GetCategory, GetUseStatus } from '@src/services/downloadDB';
import { theme } from '@src/theme';
import {
    AssetData,
    CategoryData,
    UseStatusData
} from '@src/typings/downloadDB';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { Text } from 'react-native-paper';

type LocationAssetSearchProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'LocationAssetSearch'
>;

const LocationAssetSearch: FC<LocationAssetSearchProps> = (props) => {
    const { navigation, route } = props;
    const [listAsset, setListAsset] = useState<AssetData[]>([]);
    const [searchCode, setSearchCode] = useState<string>('');
    const [listUseState, setListUseState] = useState<UseStatusData[]>([]);
    const [searchUseState, setSearchUseState] = useState<string>('');
    const [listCategory, setListCategory] = useState<CategoryData[]>([]);
    const [searchCategory, setSearchCategory] = useState<string>('');
    const [isFocusAsset, setIsFocusAsset] = useState<boolean>(false);
    const [isFocusUseState, setIsFocusUseState] = useState<boolean>(false);
    const [isFocusCategory, setIsFocusCategory] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleInitAsset = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const responseAsset = await GetAssets({
                    page: 1,
                    limit: 10
                });
                setListAsset(responseAsset?.result?.data?.asset);
            } else {
                const db = await getDBConnection();
                const listAssetDB = await getAsset(db);
                setListAsset(listAssetDB);
            }
        } catch (err) {
            setVisibleDialog(true);
        }
    }, []);

    const handleOnChangeSearchAsset = useCallback(
        async (text: string) => {
            try {
                if (text !== '') {
                    const isOnline = await getOnlineMode();
                    if (isOnline) {
                        const response = await GetAssetSearch({
                            page: 1,
                            limit: 10,
                            search_term: {
                                or: { default_code: text, name: text }
                            }
                        });

                        setListAsset(response?.result?.data?.asset);
                    } else {
                        const db = await getDBConnection();
                        const filter = {
                            default_code: text
                        };
                        const listAssetDB = await getAsset(db, filter);
                        setListAsset(listAssetDB);
                    }
                } else {
                    handleInitAsset();
                }
            } catch (err) {
                setVisibleDialog(true);
                setContentDialog('Something went wrong search asset');
            }
        },
        [handleInitAsset]
    );

    const renderItemAsset = (item: AssetData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    [{item?.default_code}] {item?.name}
                </Text>
            </View>
        );
    };

    const renderItemUseState = (item: UseStatusData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    {item?.name}
                </Text>
            </View>
        );
    };

    const renderItemCategory = (item: CategoryData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    [{item?.category_code}] {item?.category_name}
                </Text>
            </View>
        );
    };

    const handleSearchQuery = (): boolean => {
        return true;
    };

    const handleSearchCategoryQuery = (
        keyword: string,
        label: string
    ): boolean => {
        const categories = listCategory.filter((item) =>
            item.category_name.includes(label)
        );

        if (categories.length === 0) {
            return false;
        }

        return (
            categories[0].category_code.includes(keyword) ||
            categories[0].category_name.includes(keyword)
        );
    };

    const handleInitDropdown = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const [responseAsset, responseUseStatus, responseCategory] =
                    await Promise.all([
                        GetAssets({
                            page: 1,
                            limit: 10
                        }),

                        GetUseStatus({ page: 1, limit: 1000 }),
                        GetCategory({ page: 1, limit: 1000 })
                    ]);
                setListAsset(responseAsset?.result?.data?.asset);

                setListUseState(responseUseStatus?.result?.data.data);
                setListCategory(responseCategory?.result?.data.asset);
            } else {
                const db = await getDBConnection();
                const [listUseStatusDB, listCategoryDB, listAssetDB] =
                    await Promise.all([
                        getUseStatus(db, 1, 1000),
                        getCategory(db, 1, 1000),

                        getAsset(db)
                    ]);

                setListAsset(listAssetDB);
                setListUseState(listUseStatusDB);
                setListCategory(listCategoryDB);
            }
        } catch (err) {
            setVisibleDialog(true);
        }
    }, []);
    const handleClearInput = useCallback(() => {
        setSearchCode('');
        setSearchUseState('');
        setSearchCategory('');
    }, []);

    useEffect(() => {
        handleInitDropdown();
    }, [handleInitDropdown]);

    return (
        <ScrollView style={styles.container}>
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
                <Text variant="bodyLarge">Asset</Text>

                <Dropdown
                    style={[
                        styles.dropdown,
                        isFocusAsset && styles.dropdownSelect
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={listAsset}
                    search
                    maxHeight={300}
                    labelField="name"
                    valueField="default_code"
                    placeholder={'Select Asset'}
                    searchPlaceholder="Search"
                    value={searchCode}
                    onFocus={() => setIsFocusAsset(true)}
                    onBlur={() => setIsFocusAsset(false)}
                    onChange={(item) => {
                        setSearchCode(item?.default_code);
                    }}
                    onChangeText={(text) => handleOnChangeSearchAsset(text)}
                    searchQuery={handleSearchQuery}
                    renderItem={renderItemAsset}
                />
                <Text variant="bodyLarge">Use State</Text>

                <Dropdown
                    style={[
                        styles.dropdown,
                        isFocusUseState && styles.dropdownSelect
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={listUseState}
                    maxHeight={300}
                    labelField="name"
                    valueField="name"
                    placeholder={'Select UseState'}
                    value={searchUseState}
                    onFocus={() => setIsFocusUseState(true)}
                    onBlur={() => setIsFocusUseState(false)}
                    onChange={(item) => {
                        setSearchUseState(item?.name);
                    }}
                    renderItem={renderItemUseState}
                />

                <Text variant="bodyLarge">Catagory</Text>

                <Dropdown
                    style={[
                        styles.dropdown,
                        isFocusCategory && styles.dropdownSelect
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={listCategory}
                    search
                    searchPlaceholder="Search"
                    labelField="category_name"
                    valueField="category_name"
                    placeholder={'Select Category'}
                    value={searchCategory}
                    onFocus={() => setIsFocusCategory(true)}
                    onBlur={() => setIsFocusCategory(false)}
                    onChange={(item) => {
                        setSearchCategory(item?.category_name);
                    }}
                    searchQuery={handleSearchCategoryQuery}
                    renderItem={renderItemCategory}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonClear}
                        onPress={() => handleClearInput()}
                    >
                        <Text variant="bodyLarge" style={styles.buttonText}>
                            Clear
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonApply}
                        onPress={() =>
                            navigation.navigate('LocationListAsset', {
                                assetSearch: {
                                    default_code: searchCode,
                                    use_state: searchUseState,
                                    'category_id.name': searchCategory
                                },
                                LocationData: route?.params?.LocationData
                            })
                        }
                    >
                        <Text variant="bodyLarge" style={styles.buttonText}>
                            Apply
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        backgroundColor: theme.colors.buttonCancel
    },
    buttonText: {
        color: theme.colors.white,
        fontWeight: '600'
    },
    dropdown: {
        height: 50,
        borderColor: theme.colors.borderAutocomplete,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: theme.colors.blackGray,
        marginVertical: 8
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
        color: theme.colors.blackGray,
        fontFamily: 'DMSans-Regular'
    },
    placeholderStyle: {
        fontFamily: 'DMSans-Regular',
        fontSize: 16,
        color: theme.colors.textBody
    },
    selectedTextStyle: {
        fontSize: 16,
        color: theme.colors.blackGray,
        fontFamily: 'DMSans-Regular'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: theme.colors.blackGray,
        fontFamily: 'DMSans-Regular'
    }
});
export default LocationAssetSearch;
