import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlertDialog from '@src/components/core/alertDialog';
import { WARNING } from '@src/constant';
import {
    getBranch,
    getBranchSuggestion,
    insertBranchData
} from '@src/db/branch';
import { getDBConnection } from '@src/db/config';
import { GetBranches, GetBranchSearch } from '@src/services/branch';
import { BranchState } from '@src/store';
import { theme } from '@src/theme';
import { GetBranchData } from '@src/typings/branch';
import { BranchStateProps } from '@src/typings/common';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    BackHandler,
    LogBox,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecoilState } from 'recoil';

type BranchSearchScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'BranchSelectScreen'
>;

const BranchSelectScreen: FC<BranchSearchScreenProps> = (props) => {
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state'
    ]);
    const { navigation, route } = props;
    const { top } = useSafeAreaInsets();
    const [listBranch, setListBranch] = useState<GetBranchData[]>([]);
    const [isFocusBranch, setIsFocusBranch] = useState<boolean>(false);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [typeDialog, setTypeDialog] = useState<string>('warning');
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [disableCloseDialog, setDisableCloseDialog] =
        useState<boolean>(false);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);

    const [branchState, setBranchState] =
        useRecoilState<BranchStateProps>(BranchState);
    const [selectBranchId, setSelectBranchId] = useState<number>(
        branchState?.branchId
    );
    const [selectBranchName, setSelectBranchName] = useState<string>(
        branchState?.branchName
    );

    const clearStateDialog = useCallback(() => {
        setVisibleDialog(false);
        setTitleDialog('');
        setContentDialog('');
        setDisableCloseDialog(false);
        setTypeDialog('warning');
        setShowProgressBar(false);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleOnChangeSelectBranch = useCallback(
        async (text: string) => {
            try {
                const isOnline = await getOnlineMode();
                if (isOnline) {
                    const response = await GetBranchSearch({
                        page: 1,
                        limit: 1000,
                        search_term: {
                            or: { name: text }
                        },
                        branch_id: 0
                    });
                    setListBranch(response?.result?.data?.assets);
                } else {
                    const db = await getDBConnection();
                    const filter = {
                        branch_code: text,
                        branch_name: text
                    };
                    const listLocationDB = await getBranchSuggestion(
                        db,
                        filter
                    );
                    setListBranch(listLocationDB);
                }
            } catch (err) {
                console.log(err);
                clearStateDialog();
                setVisibleDialog(true);
                setTitleDialog(WARNING);
                setContentDialog(`Something went search branch`);
                setTypeDialog('warning');
            }
        },
        [clearStateDialog]
    );

    const handleInitFetch = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const responseBranch = await GetBranches({
                    page: 1,
                    limit: 1000
                });
                setListBranch(responseBranch?.result?.data?.assets);
            } else {
                const db = await getDBConnection();
                const listBranchDB = await getBranch(db, 1, 1000);
                if (listBranchDB?.length === 0) {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setDisableCloseDialog(true);
                    setTitleDialog('Branch Not Found');
                    setContentDialog('Please download the branch data');
                    setTypeDialog('branch');
                    return;
                }
                setListBranch(listBranchDB);
            }
        } catch (err) {
            console.log(err);
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog(WARNING);
            setContentDialog(`Something went wrong get branch`);
            setTypeDialog('warning');
        }
    }, [clearStateDialog]);

    const handleConfirmBranch = useCallback(async () => {
        setShowProgressBar(true);
        const db = await getDBConnection();
        const responseBranch = await GetBranches({
            page: 1,
            limit: 1000
        });
        await insertBranchData(db, responseBranch?.result?.data?.assets);
        await handleInitFetch();
        clearStateDialog();
    }, [clearStateDialog, handleInitFetch]);

    const handleConfirmDialog = useCallback(async () => {
        switch (typeDialog) {
            case 'branch':
                await handleConfirmBranch();
                break;
            default:
                clearStateDialog();
                break;
        }
    }, [clearStateDialog, handleConfirmBranch, typeDialog]);

    const handleSelectBranch = useCallback(async () => {
        const selectBranch = {
            branchId: selectBranchId,
            branchName: selectBranchName
        };
        setBranchState(selectBranch);
        await AsyncStorage.setItem('Branch', JSON.stringify(selectBranch));
        route?.params?.onGoBack(selectBranchId);
        navigation.goBack();
    }, [
        selectBranchId,
        selectBranchName,
        setBranchState,
        route?.params,
        navigation
    ]);

    const handleSearchQuery = (): boolean => {
        return true;
    };

    useEffect(() => {
        handleInitFetch();
    }, [handleInitFetch]);

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

    const renderItemBranch = (item: GetBranchData) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText} variant="bodyLarge">
                    [{item?.branch_code}] {item?.branch_name}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { marginTop: top }]}>
            <AlertDialog
                textTitle={titleDialog}
                textContent={contentDialog}
                visible={visibleDialog}
                handleClose={handleCloseDialog}
                disableClose={disableCloseDialog}
                handleConfirm={handleConfirmDialog}
                showProgressBar={showProgressBar}
            />

            <Text variant="displaySmall" style={styles.textSelectBranch}>
                Select Branch
            </Text>

            <Text variant="bodyLarge">Branch</Text>

            <Dropdown
                style={[
                    styles.dropdown,
                    isFocusBranch && styles.dropdownSelect
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={listBranch}
                search
                maxHeight={300}
                labelField="branch_name"
                valueField="branch_name"
                placeholder={'Select Branch'}
                searchPlaceholder="Search"
                value={selectBranchName}
                onFocus={() => setIsFocusBranch(true)}
                onBlur={() => setIsFocusBranch(false)}
                onChange={(item) => {
                    setSelectBranchName(item?.branch_name);
                    setSelectBranchId(item?.branch_id);
                }}
                onChangeText={(text) => handleOnChangeSelectBranch(text)}
                searchQuery={handleSearchQuery}
                renderItem={renderItemBranch}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    disabled={!selectBranchId}
                    style={[
                        styles.buttonApply,
                        {
                            backgroundColor: selectBranchId
                                ? theme.colors.buttonConfirm
                                : theme.colors.borderAutocomplete
                        }
                    ]}
                    onPress={() => handleSelectBranch()}
                >
                    <Text variant="bodyLarge" style={styles.buttonText}>
                        Apply
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
    textSelectBranch: {
        fontFamily: 'DMSans-Bold',
        marginBottom: 15,
        marginTop: 50
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
        fontFamily: 'DMSans-Bold'
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
export default BranchSelectScreen;
