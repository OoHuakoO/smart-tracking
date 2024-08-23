import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import InputText from '@src/components/core/inputText';
import { getCategory } from '@src/db/category';
import { getDBConnection } from '@src/db/config';
import { getLocationSuggestion, getLocations } from '@src/db/location';
import { getUseStatus } from '@src/db/useStatus';
import {
    GetCategory,
    GetLocation,
    GetUseStatus
} from '@src/services/downloadDB';
import { GetLocationSearch } from '@src/services/location';
import { theme } from '@src/theme';
import {
    AssetData,
    CategoryData,
    LocationData,
    UseStatusData
} from '@src/typings/downloadDB';
import { LocationSearchData } from '@src/typings/location';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    BackHandler,
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
    const [listLocation, setListLocation] = useState<LocationData[]>([]);
    const [searchLocation, setSearchLocation] = useState<string>('');
    const [listUseState, setListUseState] = useState<UseStatusData[]>([]);
    const [searchUseState, setSearchUseState] = useState<string>('');
    const [listCategory, setListCategory] = useState<CategoryData[]>([]);
    const [searchCategory, setSearchCategory] = useState<string>('');
    const [isFocusLocation, setIsFocusLocation] = useState<boolean>(false);
    const [isFocusUseState, setIsFocusUseState] = useState<boolean>(false);
    const [isFocusCategory, setIsFocusCategory] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const form = useForm<AssetData>({});

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleOnChangeSearchLocation = useCallback(async (text: string) => {
        try {
            if (text !== '') {
                const isOnline = await getOnlineMode();
                if (isOnline) {
                    const response = await GetLocationSearch({
                        page: 1,
                        limit: 1000,
                        search_term: {
                            or: { name: text, default_code: text }
                        }
                    });
                    setListLocation(response?.result?.data?.assets);
                } else {
                    const db = await getDBConnection();
                    const filter = {
                        name: text,
                        code: text
                    };
                    const listLocationDB = await getLocationSuggestion(
                        db,
                        filter
                    );
                    setListLocation(listLocationDB);
                }
            }
        } catch (err) {
            console.log(err);
            setVisibleDialog(true);
            setContentDialog('Something went wrong search location');
        }
    }, []);

    const renderItemLocation = (item: LocationSearchData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    [{item?.location_code}] {item?.location_name}
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
        const categories = listCategory?.filter((item) =>
            item?.category_name?.includes(label)
        );

        if (categories?.length === 0) {
            return false;
        }

        return (
            categories[0]?.category_code?.includes(keyword) ||
            categories[0]?.category_name?.includes(keyword)
        );
    };

    const handleClearInput = useCallback(() => {
        form.reset({ name: '' });
        setSearchLocation('');
        setSearchUseState('');
        setSearchCategory('');
    }, [form]);

    const handleSearchAsset = async (data: AssetData) => {
        navigation.navigate('Assets', {
            assetSearch: {
                name: data.name,
                'location_id.name': searchLocation,
                use_state: searchUseState,
                'category_id.name': searchCategory
            }
        });
    };

    const handleInitDropdown = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const [responseLocation, responseUseStatus, responseCategory] =
                    await Promise.all([
                        GetLocation({
                            page: 1,
                            limit: 1000
                        }),
                        GetUseStatus({ page: 1, limit: 1000 }),
                        GetCategory({ page: 1, limit: 1000 })
                    ]);

                setListLocation(responseLocation?.result?.data?.assets);
                setListUseState(responseUseStatus?.result?.data.data);
                setListCategory(responseCategory?.result?.data.asset);
            } else {
                const db = await getDBConnection();
                const [listUseStatusDB, listCategoryDB, listLocationDB] =
                    await Promise.all([
                        getUseStatus(db, 1, 1000),
                        getCategory(db, 1, 1000),
                        getLocations(db, null, 1, 1000)
                    ]);
                setListLocation(listLocationDB);
                setListUseState(listUseStatusDB);
                setListCategory(listCategoryDB);
            }
        } catch (err) {
            console.log(err);
            setVisibleDialog(true);
        }
    }, []);

    useEffect(() => {
        handleInitDropdown();
    }, [handleInitDropdown]);

    useEffect(() => {
        const onBackPress = () => {
            navigation.goBack();
            return true;
        };
        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        return () => {
            subscription.remove();
        };
    }, [navigation]);

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
                <Text variant="bodyLarge" style={styles.assetSearch}>
                    Asset
                </Text>
                <Controller
                    name="name"
                    defaultValue=""
                    control={form?.control}
                    render={({ field }) => (
                        <InputText
                            {...field}
                            placeholder="Search Asset"
                            borderColor="#828282"
                            onChangeText={(value) => field?.onChange(value)}
                        />
                    )}
                />
                <Text variant="bodyLarge" style={styles.locationSearch}>
                    Location
                </Text>
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
                    onChangeText={(text) => handleOnChangeSearchLocation(text)}
                    searchQuery={handleSearchQuery}
                    renderItem={renderItemLocation}
                />

                <Text variant="bodyLarge">Use Status</Text>

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
                    placeholder={'Select Use Status'}
                    value={searchUseState}
                    onFocus={() => setIsFocusUseState(true)}
                    onBlur={() => setIsFocusUseState(false)}
                    onChange={(item) => {
                        setSearchUseState(item?.name);
                    }}
                    renderItem={renderItemUseState}
                />

                <Text variant="bodyLarge">Category</Text>

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
                        onPress={form?.handleSubmit(handleSearchAsset)}
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
    assetSearch: {
        marginBottom: 8
    },
    locationSearch: {
        marginTop: -12
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
export default AssetSearch;
