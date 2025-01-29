import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import { GetBranches, GetBranchSearch } from '@src/services/branch';
import { theme } from '@src/theme';
import { GetBranchData } from '@src/typings/branch';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BranchSearchScreenProps = NativeStackScreenProps<
  PrivateStackParamsList,
  'BranchSelectScreen'
>;

const BranchSelectScreen: FC<BranchSearchScreenProps> = (props) => {
  const { navigation } = props;
  const { top } = useSafeAreaInsets();
  const [listBranch, setListBranch] = useState<GetBranchData[]>([]);
  const [selectBranch, setSelectBranch] = useState<string>('');
  const [isFocusBranch, setIsFocusBranch] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<string>('');
  const [visibleDialog, setVisibleDialog] = useState<boolean>(false);

  const handleCloseDialog = useCallback(() => {
    setVisibleDialog(false);
  }, []);

  const handleOnChangeSelectBranch = useCallback(async (text: string) => {
    try {
      // if (text !== '') {
      const isOnline = await getOnlineMode();
      if (isOnline) {
        const response = await GetBranchSearch({
          page: 1,
          limit: 10,
          search_term: {
            name: text
          }
        });
        setListBranch(response?.result?.data);
        // } else {
        //   const db = await getDBConnection();
        //   const filter = {
        //     name: text,
        //     code: text
        //   };
        //   const listLocationDB = await getLocationSuggestion(
        //     db,
        //     filter
        //   );
        //   setListBranch(listLocationDB);
        // }
      }
    } catch (err) {
      console.log(err);
      setVisibleDialog(true);
      setContentDialog('Something went wrong search location');
    }
  }, []);

  const renderItemBranch = (item: GetBranchData) => {
    return (
      <View style={styles.dropdownItem}>
        <Text style={styles.dropdownItemText} variant="bodyLarge">
          [{item?.branch_code}] {item?.branch_name}
        </Text>
      </View>
    );
  };

  const handleInitFetch = useCallback(async () => {
    try {
      const isOnline = await getOnlineMode();
      // if (isOnline) {
      const responseBranch = await GetBranches({
        page: 1,
        limit: 10
      });
      setListBranch(responseBranch?.result?.data);
      // } else {
      //   const db = await getDBConnection();
      //   const listLocationDB = await getLocations(db);
      //   setListBranch(listLocationDB);
      // }
    } catch (err) {
      console.log(err);
      setVisibleDialog(true);
    }
  }, []);

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

  return (
    <SafeAreaView style={[styles.container, { marginTop: top }]}>
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
        value={selectBranch}
        onFocus={() => setIsFocusBranch(true)}
        onBlur={() => setIsFocusBranch(false)}
        onChange={(item) => {
          setSelectBranch(item?.branch_name);
        }}
        onChangeText={(text) => handleOnChangeSelectBranch(text)}
        searchQuery={handleSearchQuery}
        renderItem={renderItemBranch}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonApply}
          onPress={() =>
            navigation.navigate('BranchSelectScreen', {
              branchSelect: selectBranch,
              onGoBack: (code: string) => {
                setSelectBranch(code);
                navigation.goBack();
              }
            })
          }
        >
          <Text variant="bodyLarge" style={styles.buttonText}>
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
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
    fontFamily: 'DMSans-Bold',
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
