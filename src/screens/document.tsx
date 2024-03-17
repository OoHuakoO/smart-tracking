import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import DocumentCard from '@src/components/views/documentCard';
import DocumentDialog from '@src/components/views/documentDialog';
import SearchButton from '@src/components/views/searchButton';
import { STATE_DOCUMENT_NAME, STATE_DOCUMENT_VALUE } from '@src/constant';
import { CreateDocument, GetDocumentSearch } from '@src/services/document';
import { GetLocationSearch } from '@src/services/location';
import { loginState } from '@src/store';
import { theme } from '@src/theme';
import { LoginState } from '@src/typings/common';
import { DocumentData } from '@src/typings/document';
import { LocationSearchData } from '@src/typings/location';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { getOnlineMode } from '@src/utils/common';
import { parseDateString } from '@src/utils/time-manager';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { useRecoilValue } from 'recoil';

type DocumentScreenProp = NativeStackScreenProps<
    PrivateStackParamsList,
    'Document'
>;

const DocumentScreen: FC<DocumentScreenProp> = (props) => {
    const { navigation } = props;
    const [dialogVisible, setDialogVisible] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [countTotalDocument, setCountDocument] = useState<number>(0);
    const [listDocument, setListDocument] = useState<DocumentData[]>([]);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [stopFetchMore, setStopFetchMore] = useState<boolean>(true);
    const loginValue = useRecoilValue<LoginState>(loginState);
    const [page, setPage] = useState<number>(1);
    const [online, setLogin] = useState<boolean>(false);
    const [locationSearch, setLocationSearch] = useState<string>('');
    const [listLocation, setListLocation] = useState<LocationSearchData[]>([]);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const toggleDialog = useCallback(() => {
        setDialogVisible(!dialogVisible);
    }, [dialogVisible]);

    const handleMapStateValue = useCallback((state: string): string => {
        switch (state) {
            case STATE_DOCUMENT_VALUE.Draft:
                return STATE_DOCUMENT_NAME.Draft;
            case STATE_DOCUMENT_VALUE.Check:
                return STATE_DOCUMENT_NAME.Check;
            case STATE_DOCUMENT_VALUE.Done:
                return STATE_DOCUMENT_NAME.Done;
            case STATE_DOCUMENT_VALUE.Cancel:
                return STATE_DOCUMENT_NAME.Cancel;
            default:
                return STATE_DOCUMENT_NAME.Draft;
        }
    }, []);

    const handleSearchLocation = useCallback(async (text: string) => {
        try {
            setLocationSearch(text);
            const response = await GetLocationSearch({
                page: 1,
                limit: 10,
                search_term: text
            });
            if (response?.error) {
                setLoading(false);
                setVisibleDialog(true);
                setContentDialog('Something went wrong fetch location');
                return;
            }
            setListLocation(response?.result?.data?.locations);
        } catch (err) {
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch location');
        }
    }, []);

    const handleFetchLocation = useCallback(async () => {
        try {
            const response = await GetLocationSearch({
                page: 1,
                limit: 10,
                search_term: ''
            });
            if (response?.error) {
                setLoading(false);
                setVisibleDialog(true);
                setContentDialog('Something went wrong fetch location');
                return;
            }
            setListLocation(response?.result?.data?.locations);
        } catch (err) {
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch location');
        }
    }, []);

    const handleFetchDocument = useCallback(async () => {
        try {
            setLoading(true);
            const isOnline = await getOnlineMode();
            setLogin(isOnline);

            if (isOnline) {
                const response = await GetDocumentSearch({
                    page: 1,
                    limit: 10,
                    search_term: {
                        owner_id: loginValue?.uid
                    }
                });
                response?.result?.data?.documents?.map((item) => {
                    item.state = handleMapStateValue(item?.state);
                    item.date_order = parseDateString(item?.date_order);
                });
                const totalPagesDocument = response?.result?.data?.total;
                setCountDocument(totalPagesDocument);
                setListDocument(response?.result?.data?.documents);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch document');
        }
    }, [handleMapStateValue, loginValue?.uid]);

    const handleOnEndReached = async () => {
        try {
            setLoading(true);
            if (!stopFetchMore) {
                const isOnline = await getOnlineMode();
                if (isOnline) {
                    const response = await GetDocumentSearch({
                        page: page + 1,
                        limit: 10,
                        search_term: {
                            owner_id: loginValue?.uid
                        }
                    });
                    response?.result?.data?.documents?.map((item) => {
                        item.state = handleMapStateValue(item?.state);
                        item.date_order = parseDateString(item?.date_order);
                    });
                    setListDocument([
                        ...listDocument,
                        ...response?.result?.data?.documents
                    ]);
                }
            }
            setPage(page + 1);
            setLoading(false);
        } catch (err) {
            setStopFetchMore(true);
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch more asset');
        }
    };

    const handleSelectLocation = useCallback(
        async (location: LocationSearchData) => {
            try {
                const response = await CreateDocument({
                    location_id: location?.location_id,
                    asset_ids: []
                });
                if (response?.error) {
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong fetch location');
                    return;
                }
                toggleDialog();
                navigation.navigate('DocumentAssetStatus', {
                    id: response?.result?.asset_tracking_id,
                    state: STATE_DOCUMENT_NAME.Draft,
                    location: location?.location_name
                });
                await handleFetchDocument();
                await handleFetchLocation();
            } catch (err) {
                setVisibleDialog(true);
                setContentDialog('Something went wrong fetch location');
            }
        },
        [handleFetchDocument, handleFetchLocation, navigation, toggleDialog]
    );

    useEffect(() => {
        handleFetchDocument();
    }, [handleFetchDocument]);

    useEffect(() => {
        handleFetchLocation();
    }, [handleFetchLocation]);

    return (
        <SafeAreaView style={styles.container}>
            <AlertDialog
                textContent={contentDialog}
                visible={visibleDialog}
                handleClose={handleCloseDialog}
                handleConfirm={handleCloseDialog}
            />
            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#2C86BF', '#2C86BF', '#8DC4E6']}
                style={styles.topSectionList}
            >
                <View style={styles.backToPrevious}>
                    <BackButton
                        handlePress={() => navigation.navigate('Home')}
                    />
                </View>
                <View style={styles.containerText}>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        Document
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        เอกสารการตรวจนับทั้งหมด
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <View style={styles.searchButtonWrap}>
                    <SearchButton
                        handlePress={() => navigation.navigate('Home')}
                    />
                </View>
                <Text variant="bodyLarge" style={styles.textTotalDocument}>
                    Total Document : {countTotalDocument}
                </Text>
                <FlatList
                    style={styles.flatListStyle}
                    data={listDocument}
                    renderItem={({ item }) => (
                        <View style={styles.wrapDetailList}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() =>
                                    navigation.navigate('DocumentAssetStatus', {
                                        id: item?.id,
                                        state: item?.state,
                                        location: item?.location
                                    })
                                }
                            >
                                <DocumentCard
                                    online={online}
                                    documentTitle={`Document ${item?.id}`}
                                    locationInfo={item?.location}
                                    dateInfo={item?.date_order}
                                    documentStatus={item?.state}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    onRefresh={() => console.log('refreshing')}
                    refreshing={loading}
                    onEndReached={handleOnEndReached}
                    onEndReachedThreshold={0.5}
                    onScrollBeginDrag={() => setStopFetchMore(false)}
                />
            </View>
            <DocumentDialog
                locationSearch={locationSearch}
                visible={dialogVisible}
                onClose={toggleDialog}
                handleSearchLocation={handleSearchLocation}
                listLocation={listLocation}
                handleSelectLocation={handleSelectLocation}
            />
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.Button}
                onPress={toggleDialog}
            >
                <ActionButton icon="plus" color={theme.colors.white} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topSectionList: {
        height: hp('30%'),
        width: wp('100%'),
        position: 'absolute',
        display: 'flex'
    },
    backToPrevious: {
        marginVertical: 15,
        marginHorizontal: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch'
    },
    containerText: {
        marginHorizontal: 20
    },
    textHeader: {
        color: '#FFFFFF',
        fontWeight: '700',
        marginBottom: 10
    },
    textDescription: {
        fontFamily: 'Sarabun-Regular',
        color: '#FFFFFF'
    },
    listSection: {
        flex: 1,
        height: hp('30%'),
        width: wp('100%'),
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: '50%'
    },
    wrapDetailList: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    searchButtonWrap: {
        position: 'absolute',
        right: 25,
        top: -20
    },
    searchButton: {
        zIndex: 2
    },
    textTotalDocument: {
        marginLeft: 20,
        marginTop: 20,
        fontWeight: '700',
        fontSize: 15,
        marginBottom: 20
    },
    drawer: {
        width: '80%' // Adjust the width as needed
    },
    Button: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    },
    flatListStyle: {
        marginBottom: 30
    }
});

export default DocumentScreen;
