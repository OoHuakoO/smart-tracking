import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import InputText from '@src/components/core/inputText';
import { getDBConnection } from '@src/db/config';
import { getLocations } from '@src/db/location';
import { GetLocationSearch } from '@src/services/location';
import { theme } from '@src/theme';
import { State } from '@src/typings/document';
import { LocationSearchData } from '@src/typings/location';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import { parseDateString, parseMonthDateString } from '@src/utils/time-manager';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import { Dropdown } from 'react-native-element-dropdown';
import { Text } from 'react-native-paper';

type DocumentSearchScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentSearch'
>;

const DocumentSearchScreen: FC<DocumentSearchScreenProps> = (props) => {
    const { navigation } = props;
    const [listLocation, setListLocation] = useState<LocationSearchData[]>([]);
    const [searchLocation, setSearchLocation] = useState<string>('');
    const [searchState, setSearchState] = useState<string>('');
    const [isFocusLocation, setIsFocusLocation] = useState<boolean>(false);
    const [isFocusState, setIsFocusState] = useState<boolean>(false);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [dateStart, setDateStart] = useState<Date>(null);
    const [dateEnd, setDateEnd] = useState<Date>(null);
    const [openDateStart, setOpenStart] = useState<boolean>(false);
    const [openDateEnd, setOpenEnd] = useState<boolean>(false);
    const stateList: State[] = [
        { label: 'Draft', value: 'draft' },
        { label: 'Check', value: 'open' },
        { label: 'Done', value: 'done' },
        { label: 'Cancelled', value: 'cancel' }
    ];

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
                        limit: 10,
                        search_term: text
                    });
                    setListLocation(response?.result?.data?.locations);
                } else {
                    const db = await getDBConnection();
                    const filter = {
                        name: text
                    };
                    const listLocationDB = await getLocations(db, filter);
                    const listLocationSearch = listLocationDB.map((item) => {
                        return {
                            location_id: item?.asset_location_id,
                            location_name: item?.name
                        };
                    });
                    setListLocation(listLocationSearch);
                }
            }
        } catch (err) {
            setVisibleDialog(true);
            setContentDialog('Something went wrong search location');
        }
    }, []);

    const renderItemLocation = (item: LocationSearchData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    {item?.location_name}
                </Text>
            </View>
        );
    };

    const renderItemUseState = (item: State) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    {item?.label}
                </Text>
            </View>
        );
    };

    const handleInitDropdown = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const responseLocation = await GetLocationSearch({
                    page: 1,
                    limit: 10
                });
                setListLocation(responseLocation?.result?.data?.locations);
            }
        } catch (err) {
            setVisibleDialog(true);
        }
    }, []);

    const handleClearInput = useCallback(() => {
        setSearchLocation('');
        setSearchState('');
        setDateStart(null);
        setDateEnd(null);
    }, []);

    useEffect(() => {
        handleInitDropdown();
    }, [handleInitDropdown]);

    return (
        <View style={styles.container}>
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

            <Text variant="displaySmall" style={styles.textSearchAsset}>
                Search Document
            </Text>

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
                onChangeText={(text) => handleOnChangeSearchLocation(text)}
                renderItem={renderItemLocation}
            />

            <Text variant="bodyLarge">State</Text>
            <Dropdown
                style={[styles.dropdown, isFocusState && styles.dropdownSelect]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={stateList}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Select State'}
                value={searchState}
                onFocus={() => setIsFocusState(true)}
                onBlur={() => setIsFocusState(false)}
                onChange={(item) => {
                    setSearchState(item?.value);
                }}
                renderItem={renderItemUseState}
            />

            <Text variant="bodyLarge">Start From</Text>

            <TouchableOpacity
                onPress={() => {
                    setOpenStart(true);
                    setDateStart(new Date());
                    setDateEnd(null);
                }}
            >
                <InputText
                    placeholder="Date"
                    value={
                        dateStart ? parseDateString(dateStart.toString()) : null
                    }
                    readOnly
                />
            </TouchableOpacity>

            {openDateStart && (
                <DatePicker
                    modal
                    mode="date"
                    open={openDateStart}
                    date={dateStart}
                    onConfirm={(date) => {
                        setOpenStart(false);
                        setDateStart(date);
                    }}
                    onCancel={() => {
                        setOpenStart(false);
                    }}
                />
            )}

            <Text variant="bodyLarge">End Date</Text>

            <TouchableOpacity
                onPress={() => {
                    setOpenEnd(true);
                    setDateEnd(new Date());
                }}
            >
                <InputText
                    placeholder="Date"
                    value={dateEnd ? parseDateString(dateEnd.toString()) : null}
                    readOnly
                />
            </TouchableOpacity>

            {openDateEnd && (
                <DatePicker
                    modal
                    mode="date"
                    open={openDateEnd}
                    date={dateEnd}
                    minimumDate={dateStart}
                    onConfirm={(date) => {
                        setOpenEnd(false);
                        setDateEnd(date);
                    }}
                    onCancel={() => {
                        setOpenEnd(false);
                    }}
                />
            )}

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
                        navigation.navigate('Document', {
                            documentSearch: {
                                location: searchLocation,
                                state: searchState,
                                start_date: dateStart
                                    ? parseMonthDateString(dateStart.toString())
                                    : null,
                                end_date: dateEnd
                                    ? parseMonthDateString(dateEnd.toString())
                                    : null
                            }
                        })
                    }
                >
                    <Text variant="bodyLarge" style={styles.buttonText}>
                        Apply
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20
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
        borderRadius: 10,
        paddingHorizontal: 10,
        color: theme.colors.textBody,
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
        color: theme.colors.black,
        fontFamily: 'DMSans-Regular'
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
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: theme.colors.black,
        fontFamily: 'DMSans-Regular'
    }
});
export default DocumentSearchScreen;