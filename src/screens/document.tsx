import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import SearchButton from '@src/components/core/searchButton';
import DocumentCard from '@src/components/views/documentCard';
import DocumentDialog from '@src/components/views/documentDialog';
import { STATE_DOCUMENT_NAME } from '@src/constant';
import { getDBConnection } from '@src/db/config';
import {
    getDocument,
    getTotalDocument,
    insertDocumentData
} from '@src/db/document';
import { getLocations } from '@src/db/location';
import { CreateDocument, GetDocumentSearch } from '@src/services/document';
import { GetLocation } from '@src/services/downloadDB';
import { GetLocationSearch } from '@src/services/location';
import { documentState, loginState } from '@src/store';
import { theme } from '@src/theme';
import { DocumentState, LoginState } from '@src/typings/common';
import { DocumentData } from '@src/typings/document';
import { LocationSearchData } from '@src/typings/location';
import { PrivateStackParamsList } from '@src/typings/navigation';
import {
    getOnlineMode,
    handleMapDocumentStateValue,
    removeKeyEmpty
} from '@src/utils/common';
import { parseDateString, parseDateStringTime } from '@src/utils/time-manager';
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
import { useRecoilValue, useSetRecoilState } from 'recoil';

type DocumentScreenProp = NativeStackScreenProps<
    PrivateStackParamsList,
    'Document'
>;

const DocumentScreen: FC<DocumentScreenProp> = (props) => {
    const { navigation, route } = props;
    const [dialogVisible, setDialogVisible] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [countTotalDocument, setCountDocument] = useState<number>(0);
    const [listDocument, setListDocument] = useState<DocumentData[]>([]);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [stopFetchMore, setStopFetchMore] = useState<boolean>(true);
    const loginValue = useRecoilValue<LoginState>(loginState);
    const [page, setPage] = useState<number>(1);

    const [locationSearch, setLocationSearch] = useState<string>('');
    const [listLocation, setListLocation] = useState<LocationSearchData[]>([]);
    const setDocument = useSetRecoilState<DocumentState>(documentState);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const toggleDialog = useCallback(() => {
        setDialogVisible(!dialogVisible);
    }, [dialogVisible]);

    const handleSearchLocation = useCallback(async (text: string) => {
        try {
            setLocationSearch(text);
            const isOnline = await getOnlineMode();
            if (text !== '') {
                if (isOnline) {
                    const response = await GetLocationSearch({
                        page: 1,
                        limit: 10,
                        search_term: {
                            or: { name: text, default_code: text }
                        }
                    });
                    if (response?.error) {
                        setLoading(false);
                        setVisibleDialog(true);
                        setContentDialog(
                            'Something went wrong search location'
                        );
                        return;
                    }
                    setListLocation(response?.result?.data?.locations);
                } else {
                    const db = await getDBConnection();
                    const filter = {
                        name: text
                    };
                    const listLocationDB = await getLocations(db, filter);
                    setListLocation(listLocationDB);
                }
            }
        } catch (err) {
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong search location');
        }
    }, []);

    const handleFetchLocation = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const response = await GetLocation({
                    page: 1,
                    limit: 10
                });
                if (response?.error) {
                    setLoading(false);
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong fetch location');
                    return;
                }
                setListLocation(response?.result?.data?.asset);
            } else {
                const db = await getDBConnection();
                const listLocationDB = await getLocations(db);
                setListLocation(listLocationDB);
            }
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
            const documentSearch = removeKeyEmpty(
                route?.params?.documentSearch
            );
            if (isOnline) {
                const response = await GetDocumentSearch({
                    page: 1,
                    limit: 10,
                    search_term: {
                        and: { ...documentSearch, user_id: loginValue?.uid }
                    }
                });
                response?.result?.data?.documents?.map((item) => {
                    item.state = handleMapDocumentStateValue(item?.state);
                    item.date_order = parseDateString(item?.date_order);
                });
                const totalPagesDocument = response?.result?.data?.total;
                setCountDocument(totalPagesDocument);
                setListDocument(response?.result?.data?.documents);
            } else {
                const db = await getDBConnection();
                const listDocumentDB = await getDocument(db);
                listDocumentDB?.map((item) => {
                    item.state = handleMapDocumentStateValue(item?.state);
                    item.date_order = parseDateString(item?.date_order);
                });
                const totalDocument = await getTotalDocument(db);
                setCountDocument(totalDocument);
                setListDocument(listDocumentDB);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch document');
        }
    }, [loginValue?.uid, route?.params?.documentSearch]);

    const handleOnEndReached = async () => {
        try {
            setLoading(true);
            if (!stopFetchMore) {
                const isOnline = await getOnlineMode();
                const documentSearch = removeKeyEmpty(
                    route?.params?.documentSearch
                );
                if (isOnline) {
                    const response = await GetDocumentSearch({
                        page: page + 1,
                        limit: 10,
                        search_term: {
                            and: { ...documentSearch, user_id: loginValue?.uid }
                        }
                    });
                    response?.result?.data?.documents?.map((item) => {
                        item.state = handleMapDocumentStateValue(item?.state);
                        item.date_order = parseDateString(item?.date_order);
                    });
                    setListDocument([
                        ...listDocument,
                        ...response?.result?.data?.documents
                    ]);
                } else {
                    const db = await getDBConnection();
                    const listDocumentDB = await getDocument(db, page + 1);
                    listDocumentDB?.map((item) => {
                        item.state = handleMapDocumentStateValue(item?.state);
                        item.date_order = parseDateString(item?.date_order);
                    });
                    const totalDocument = await getTotalDocument(db);
                    setCountDocument(totalDocument);
                    setListDocument(listDocumentDB);
                }
            }
            setPage(page + 1);
            setLoading(false);
        } catch (err) {
            setStopFetchMore(true);
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch more document');
        }
    };

    const handleSelectLocation = useCallback(
        async (location: LocationSearchData) => {
            try {
                const isOnline = await getOnlineMode();
                if (isOnline) {
                    const response = await CreateDocument({
                        location_id: location?.location_id,
                        date_order: parseDateStringTime(
                            new Date(Date.now()).toISOString()
                        )
                    });
                    if (response?.error) {
                        setVisibleDialog(true);
                        setContentDialog(
                            'Something went wrong create document'
                        );
                        return;
                    }
                    const documentObj = {
                        id: response?.result?.data?.id,
                        state: STATE_DOCUMENT_NAME.Draft,
                        location: location?.location_name,
                        location_id: location?.location_id
                    };
                    setDocument(documentObj);
                } else {
                    const db = await getDBConnection();
                    const totalDocument = await getTotalDocument(db);
                    const documentObj = {
                        id: totalDocument + 1,
                        state: STATE_DOCUMENT_NAME.Draft,
                        location: location?.location_name,
                        location_id: location?.location_id
                    };
                    await insertDocumentData(db, documentObj as DocumentData);
                    setDocument(documentObj);
                }
                toggleDialog();
                navigation.navigate('DocumentAssetStatus');
                await handleFetchDocument();
                await handleFetchLocation();
            } catch (err) {
                setVisibleDialog(true);
                setContentDialog('Something went wrong create document');
            }
        },
        [
            handleFetchDocument,
            handleFetchLocation,
            navigation,
            setDocument,
            toggleDialog
        ]
    );

    useEffect(() => {
        handleFetchDocument();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route?.params?.documentSearch]);

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
                        handlePress={() =>
                            navigation.navigate('DocumentSearch')
                        }
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
                                onPress={() => {
                                    const documentObj = {
                                        id: item?.id,
                                        state: item?.state,
                                        location: item?.location,
                                        location_id: item?.location_id
                                    };
                                    setDocument(documentObj);
                                    navigation.navigate('DocumentAssetStatus');
                                }}
                            >
                                <DocumentCard
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
        color: theme.colors.pureWhite,
        fontWeight: '700',
        marginBottom: 10
    },
    textDescription: {
        fontFamily: 'Sarabun-Regular',
        color: theme.colors.pureWhite
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
        width: '80%'
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
