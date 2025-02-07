import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import BackButton from '@src/components/core/backButton';
import SearchButton from '@src/components/core/searchButton';
import DocumentCard from '@src/components/views/documentCard';
import DocumentDialog from '@src/components/views/documentDialog';
import { STATE_DOCUMENT_NAME } from '@src/constant';
import { getDBConnection } from '@src/db/config';
import { removeDocumentLineOfflineByTrackingID } from '@src/db/documentLineOffline';
import {
    getDocumentOffline,
    getTotalDocument,
    insertDocumentOfflineData,
    removeDocumentOffline,
    removeDocumentOfflineByID
} from '@src/db/documentOffline';
import { getLocationSuggestion, getLocations } from '@src/db/location';
import { CreateDocument, GetDocumentSearch } from '@src/services/document';
import { GetLocation } from '@src/services/downloadDB';
import { GetLocationSearch } from '@src/services/location';
import { BranchState, documentState, loginState } from '@src/store';
import { theme } from '@src/theme';
import { DocumentState, LoginState } from '@src/typings/common';
import { DocumentData, SearchDocument } from '@src/typings/document';
import { LocationSearchData } from '@src/typings/location';
import { PrivateStackParamsList } from '@src/typings/navigation';
import {
    getOnlineMode,
    handleMapDocumentStateName,
    handleMapDocumentStateValue,
    removeKeyEmpty
} from '@src/utils/common';
import { parseDateString, parseDateStringTime } from '@src/utils/time-manager';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    BackHandler,
    Dimensions,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecoilValue, useSetRecoilState } from 'recoil';

type DocumentScreenProp = NativeStackScreenProps<
    PrivateStackParamsList,
    'Document'
>;

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768 && height >= 768;

const DocumentScreen: FC<DocumentScreenProp> = (props) => {
    const { navigation, route } = props;
    const { top } = useSafeAreaInsets();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [countTotalDocument, setCountDocument] = useState<number>(0);
    const [listDocument, setListDocument] = useState<DocumentData[]>([]);
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [stopFetchMore, setStopFetchMore] = useState<boolean>(true);
    const loginValue = useRecoilValue<LoginState>(loginState);
    const [page, setPage] = useState<number>(1);
    const [online, setOnline] = useState<boolean>(false);
    const [locationSearch, setLocationSearch] = useState<string>('');
    const [listLocation, setListLocation] = useState<LocationSearchData[]>([]);
    const setDocument = useSetRecoilState<DocumentState>(documentState);
    const [idDocument, setIdDocument] = useState<number>(0);
    const branchValue = useRecoilValue(BranchState);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const clearStateDialog = useCallback(() => {
        setVisibleDialog(false);
        setTitleDialog('');
        setContentDialog('');
        setShowCancelDialog(false);
    }, []);

    const toggleDialog = useCallback(() => {
        setDialogVisible(!dialogVisible);
    }, [dialogVisible]);

    const handleOpenDialogConfirmRemoveDocument = useCallback(
        (id: number) => {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog('Confirm');
            setContentDialog('Do you want to remove this document ?');
            setShowCancelDialog(true);
            setIdDocument(id);
        },
        [clearStateDialog]
    );

    const handleOpenDialogConfirmRemoveAllDocument = useCallback(() => {
        clearStateDialog();
        setVisibleDialog(true);
        setTitleDialog('Confirm Remove All');
        setContentDialog(
            'Please verify if there are any documents that have not yet been uploaded, as this action will delete all documents.'
        );
        setShowCancelDialog(true);
    }, [clearStateDialog]);

    const handleFetchLocation = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            setOnline(isOnline);
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
                setListLocation(response?.result?.data?.assets);
            } else {
                const db = await getDBConnection();
                const listLocationDB = await getLocations(db);
                setListLocation(listLocationDB);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch location');
        }
    }, []);

    const handleSearchLocation = useCallback(
        async (text: string) => {
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
                        setListLocation(response?.result?.data?.assets);
                    } else {
                        const db = await getDBConnection();
                        const filter = {
                            default_code: text,
                            name: text
                        };
                        const listLocationDB = await getLocationSuggestion(
                            db,
                            filter
                        );
                        setListLocation(listLocationDB);
                    }
                } else {
                    await handleFetchLocation();
                }
            } catch (err) {
                console.log(err);
                setLoading(false);
                setVisibleDialog(true);
                setContentDialog('Something went wrong search location');
            }
        },
        [handleFetchLocation]
    );

    const handleFetchDocument = useCallback(async () => {
        try {
            setLoading(true);
            const isOnline = await getOnlineMode();

            const documentSearch: SearchDocument = removeKeyEmpty(
                route?.params?.documentSearch
            ) as SearchDocument;

            if (isOnline) {
                const response = await GetDocumentSearch({
                    page: 1,
                    limit: 10,
                    search_term: {
                        and: {
                            ...{
                                ...documentSearch,
                                state: handleMapDocumentStateName(
                                    documentSearch?.state
                                )
                            },
                            user_id: loginValue?.uid
                        }
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
                const sort = {
                    date_order: true
                };
                const db = await getDBConnection();
                const listDocumentDB = await getDocumentOffline(
                    db,
                    documentSearch,
                    sort
                );
                listDocumentDB?.map((item) => {
                    item.date_order = parseDateString(item?.date_order);
                });
                const totalDocument = await getTotalDocument(
                    db,
                    documentSearch
                );

                setCountDocument(totalDocument);
                setListDocument(listDocumentDB);
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
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
                const documentSearch: SearchDocument = removeKeyEmpty(
                    route?.params?.documentSearch
                ) as SearchDocument;
                if (isOnline) {
                    const response = await GetDocumentSearch({
                        page: page + 1,
                        limit: 10,
                        search_term: {
                            and: {
                                ...{
                                    ...documentSearch,
                                    state: handleMapDocumentStateName(
                                        documentSearch?.state
                                    )
                                },
                                user_id: loginValue?.uid
                            }
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
                    const sort = {
                        date_order: true
                    };
                    const db = await getDBConnection();
                    const listDocumentDB = await getDocumentOffline(
                        db,
                        documentSearch,
                        sort,
                        page + 1
                    );
                    listDocumentDB?.map((item) => {
                        item.date_order = parseDateString(item?.date_order);
                    });
                    setListDocument([...listDocument, ...listDocumentDB]);
                }
            }
            setPage(page + 1);
            setLoading(false);
        } catch (err) {
            console.log(err);
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
                        name: 'Draft Tracking',
                        state: STATE_DOCUMENT_NAME.Draft,
                        location: location?.location_name,
                        location_id: location?.location_id
                    };
                    setDocument(documentObj);
                } else {
                    const db = await getDBConnection();
                    const documentInsert = {
                        state: STATE_DOCUMENT_NAME.Draft,
                        location: location?.location_name,
                        location_id: location?.location_id
                    };
                    await insertDocumentOfflineData(
                        db,
                        documentInsert as DocumentData
                    );
                    const sort = {
                        date_order: true
                    };
                    const listDocumentDB = await getDocumentOffline(
                        db,
                        null,
                        sort
                    );
                    const documentObj = {
                        id:
                            listDocumentDB?.length > 0
                                ? listDocumentDB[0]?.id
                                : 1,
                        state: STATE_DOCUMENT_NAME.Draft,
                        location: location?.location_name,
                        location_id: location?.location_id
                    };
                    setDocument(documentObj);
                }
                toggleDialog();
                navigation.navigate('DocumentAssetStatus');
                await handleFetchDocument();
                await handleFetchLocation();
            } catch (err) {
                console.log(err);
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

    const handleRemoveAllDocument = useCallback(async () => {
        try {
            clearStateDialog();
            const db = await getDBConnection();
            const listDocumentDB = await getDocumentOffline(db, null);
            listDocumentDB.map(async (item) => {
                await removeDocumentLineOfflineByTrackingID(db, item?.id);
            });
            await removeDocumentOffline(db);
            await handleFetchDocument();
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong remove document');
        }
    }, [clearStateDialog, handleFetchDocument]);

    const handleRemoveDocument = useCallback(async () => {
        try {
            clearStateDialog();
            const db = await getDBConnection();
            await removeDocumentOfflineByID(db, idDocument);
            await removeDocumentLineOfflineByTrackingID(db, idDocument);
            await handleFetchDocument();
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong remove document');
        }
    }, [clearStateDialog, handleFetchDocument, idDocument]);

    const handleConfirmDialog = useCallback(async () => {
        switch (titleDialog) {
            case 'Confirm':
                await handleRemoveDocument();
                break;
            case 'Confirm Remove All':
                await handleRemoveAllDocument();
                break;
            default:
                clearStateDialog();
                break;
        }
    }, [
        clearStateDialog,
        handleRemoveAllDocument,
        handleRemoveDocument,
        titleDialog
    ]);

    useEffect(() => {
        handleFetchDocument();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route?.params?.documentSearch]);

    useEffect(() => {
        handleFetchLocation();
    }, [handleFetchLocation]);

    useEffect(() => {
        const onBackPress = () => {
            navigation.navigate('Home');
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
                textTitle={titleDialog}
                textContent={contentDialog}
                visible={visibleDialog}
                handleClose={handleCloseDialog}
                handleConfirm={handleConfirmDialog}
                showCloseDialog={showCancelDialog}
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
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        Branch : {branchValue?.branchName}
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
                {!online && countTotalDocument > 0 && (
                    <TouchableOpacity
                        onPress={() =>
                            handleOpenDialogConfirmRemoveAllDocument()
                        }
                        style={styles.buttonDeleteAll}
                    >
                        <Text variant="bodyLarge" style={styles.textDeleteAll}>
                            Delete All
                        </Text>
                    </TouchableOpacity>
                )}

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
                                        name: item?.name,
                                        state: item?.state,
                                        location: item?.location,
                                        location_id: item?.location_id
                                    };
                                    setDocument(documentObj);
                                    navigation.navigate('DocumentAssetStatus');
                                }}
                            >
                                <DocumentCard
                                    online={online}
                                    documentTitle={
                                        online
                                            ? `${item?.name} - ${item?.id}`
                                            : `Document ${item?.id}`
                                    }
                                    locationInfo={item?.location}
                                    dateInfo={item?.date_order}
                                    documentStatus={item?.state}
                                    id={item?.id}
                                    handleRemoveDocument={
                                        handleOpenDialogConfirmRemoveDocument
                                    }
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
        height: '35%',
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
        fontFamily: 'DMSans-Bold',
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
        marginTop: isTablet ? '30%' : '50%'
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
        fontFamily: 'DMSans-Bold',
        fontSize: 15,
        marginBottom: 5
    },
    textDeleteAll: {
        fontFamily: 'DMSans-Bold',
        fontSize: 14,
        color: theme.colors.error
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
    },
    buttonDeleteAll: {
        backgroundColor: theme.colors.background,
        width: 100,
        borderRadius: 15,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 20,
        borderWidth: 2,
        borderColor: theme.colors.error
    }
});

export default DocumentScreen;
