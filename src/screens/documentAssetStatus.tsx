import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import DocumentAssetStatusCard from '@src/components/views/documentAssetStatusCard';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native-paper';

import {
    BackHandler,
    FlatList,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import {
    RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND,
    RESPONSE_PUT_DOCUMENT_SUCCESS,
    STATE_DOCUMENT_NAME,
    STATE_DOCUMENT_VALUE
} from '@src/constant';
import { getAsset } from '@src/db/asset';
import { getDBConnection } from '@src/db/config';
import {
    getDocumentLine,
    getTotalDocumentLine,
    removeDocumentLineByAssetId
} from '@src/db/documentLineOffline';
import { updateDocument } from '@src/db/documentOffline';
import { insertReportAssetNotFound } from '@src/db/reportAssetNotFound';
import { removeReportDocumentLineByCode } from '@src/db/reportDocumentLine';
import {
    DeleteDocumentLine,
    GetDocumentById,
    UpdateDocument
} from '@src/services/document';
import { documentState, useRecoilValue, useSetRecoilState } from '@src/store';
import { DocumentState } from '@src/typings/common';
import { DocumentAssetData } from '@src/typings/document';
import { getOnlineMode, handleMapMovementStateEN } from '@src/utils/common';
import { parseDateString } from '@src/utils/time-manager';
import LinearGradient from 'react-native-linear-gradient';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

type DocumentAssetStatusScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentAssetStatus'
>;

const DocumentAssetStatusScreen: FC<DocumentAssetStatusScreenProps> = (
    props
) => {
    const { navigation, route } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
    const [totalAssetDocument, setTotalAssetDocument] = useState<number>(0);
    const [listAssetDocument, setListAssetDocument] = useState<
        DocumentAssetData[]
    >([]);
    const [idAsset, setIdAsset] = useState<number>(0);
    const [codeAsset, setCodeAsset] = useState<string>('');
    const documentValue = useRecoilValue<DocumentState>(documentState);
    const setDocument = useSetRecoilState<DocumentState>(documentState);
    const isFocused = useIsFocused();

    const colorStateTag = useMemo((): string => {
        switch (documentValue?.state) {
            case STATE_DOCUMENT_NAME.Draft:
                return theme.colors.documentDraft;
            case STATE_DOCUMENT_NAME.Check:
                return theme.colors.documentCheck;
            case STATE_DOCUMENT_NAME.Done:
                return theme.colors.documentDone;
            case STATE_DOCUMENT_NAME.Cancel:
                return theme.colors.documentCancel;
            default:
                return theme.colors.documentDraft;
        }
    }, [documentValue?.state]);

    const clearStateDialog = useCallback(() => {
        setVisibleDialog(false);
        setTitleDialog('');
        setContentDialog('');
        setShowCancelDialog(false);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setVisibleDialog(false);
    }, []);

    const handleFetchDocumentById = useCallback(async () => {
        try {
            setLoading(true);
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const response = await GetDocumentById(documentValue?.id);
                if (response?.error) {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong fetch document');
                }
                response?.result?.data?.asset?.assets?.map((item) => {
                    item.state = handleMapMovementStateEN(item?.state);
                    item.date_check = parseDateString(item?.date_check);
                });
                setTotalAssetDocument(
                    response?.result?.data?.asset?.assets?.length
                );
                setListAssetDocument(response?.result?.data?.asset?.assets);
            } else {
                const db = await getDBConnection();
                const filter = {
                    tracking_id: documentValue?.id
                };
                const sort = {
                    date_check: true
                };
                const listDocumentDB = await getDocumentLine(db, filter, sort);
                listDocumentDB?.map((item) => {
                    item.state = handleMapMovementStateEN(item?.state);
                    item.date_check = parseDateString(item?.date_check);
                });
                const totalDocumentLine = await getTotalDocumentLine(
                    db,
                    filter
                );
                setTotalAssetDocument(totalDocumentLine);
                setListAssetDocument(listDocumentDB);
            }
            setLoading(false);
        } catch (err) {
            clearStateDialog();
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch document');
        }
    }, [clearStateDialog, documentValue?.id]);

    const handleOpenDialogConfirmRemoveAsset = useCallback(
        (id: number, code: string) => {
            clearStateDialog();
            setVisibleDialog(true);
            setTitleDialog('Confirm');
            setContentDialog('Do you want to remove this asset ?');
            setShowCancelDialog(true);
            setIdAsset(id);
            setCodeAsset(code);
        },
        [clearStateDialog]
    );

    const handleOpenDialogConfirmCancelDocument = useCallback(() => {
        clearStateDialog();
        setVisibleDialog(true);
        setTitleDialog('Confirm Cancel');
        setShowCancelDialog(true);
        setContentDialog('Do you want to cancel this document ?');
    }, [clearStateDialog]);

    const handleOpenDialogResetToDraftDocument = useCallback(() => {
        clearStateDialog();
        setVisibleDialog(true);
        setTitleDialog('Confirm Reset to Draft');
        setShowCancelDialog(true);
        setContentDialog('Do you want to reset to draft this document ?');
    }, [clearStateDialog]);

    const handleCancelDocument = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            const documentObj = {
                id: documentValue?.id,
                state: STATE_DOCUMENT_NAME.Cancel,
                location: documentValue?.location,
                location_id: documentValue?.location_id
            };
            if (isOnline) {
                const response = await UpdateDocument({
                    document_data: {
                        id: documentValue?.id,
                        state: STATE_DOCUMENT_VALUE.Cancel
                    }
                });
                if (
                    response?.result?.message === RESPONSE_PUT_DOCUMENT_SUCCESS
                ) {
                    clearStateDialog();
                    setDocument(documentObj);
                } else {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog('Something went wrong cancel document');
                }
            } else {
                const db = await getDBConnection();
                await updateDocument(db, documentObj);
                clearStateDialog();
                setDocument(documentObj);
            }
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong cancel document');
        }
    }, [
        clearStateDialog,
        documentValue?.id,
        documentValue?.location,
        documentValue?.location_id,
        setDocument
    ]);

    const handleResetToDraft = useCallback(async () => {
        try {
            const isOnline = await getOnlineMode();
            const documentObj = {
                id: documentValue?.id,
                state: STATE_DOCUMENT_NAME.Draft,
                location: documentValue?.location,
                location_id: documentValue?.location_id
            };
            if (isOnline) {
                const response = await UpdateDocument({
                    document_data: {
                        id: documentValue?.id,
                        state: STATE_DOCUMENT_VALUE.Draft
                    }
                });
                if (
                    response?.result?.message === RESPONSE_PUT_DOCUMENT_SUCCESS
                ) {
                    clearStateDialog();
                    setDocument(documentObj);
                } else {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog(
                        'Something went wrong reset to draft document'
                    );
                }
            } else {
                const db = await getDBConnection();
                await updateDocument(db, documentObj);
                clearStateDialog();
                setDocument(documentObj);
            }
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong reset to draft document');
        }
    }, [
        clearStateDialog,
        documentValue?.id,
        documentValue?.location,
        documentValue?.location_id,
        setDocument
    ]);

    const handleRemoveAsset = useCallback(async () => {
        try {
            clearStateDialog();
            const isOnline = await getOnlineMode();
            if (isOnline) {
                const response = await DeleteDocumentLine({
                    asset_tracking_id: documentValue?.id,
                    asset_ids: [{ id: idAsset }]
                });
                if (
                    response?.result?.message ===
                    RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND
                ) {
                    clearStateDialog();
                    setVisibleDialog(true);
                    setContentDialog(
                        'Something went wrong asset data not found'
                    );
                    return;
                }
            } else {
                const filter = {
                    default_code: codeAsset
                };
                const db = await getDBConnection();
                await removeDocumentLineByAssetId(db, idAsset);
                await removeReportDocumentLineByCode(db, codeAsset);
                const asset = await getAsset(db, filter);
                if (asset?.length > 0) {
                    await insertReportAssetNotFound(db, [
                        {
                            default_code: asset[0]?.default_code,
                            name: asset[0]?.name,
                            category: asset[0]?.category,
                            location: asset[0]?.location,
                            use_state: asset[0]?.use_state
                        }
                    ]);
                }
            }
            setListAssetDocument((prev) => {
                const listAssetFilter = prev.filter(
                    (item) => item?.asset_id !== idAsset
                );
                setTotalAssetDocument(listAssetFilter.length);
                return listAssetFilter;
            });
            await handleFetchDocumentById();
        } catch (err) {
            clearStateDialog();
            setVisibleDialog(true);
            setContentDialog('Something went wrong remove asset');
        }
    }, [
        clearStateDialog,
        codeAsset,
        documentValue?.id,
        handleFetchDocumentById,
        idAsset
    ]);

    const handleConfirmDialog = useCallback(async () => {
        switch (titleDialog) {
            case 'Confirm':
                await handleRemoveAsset();
                break;
            case 'Confirm Reset to Draft':
                await handleResetToDraft();
                break;
            case 'Confirm Cancel':
                await handleCancelDocument();
                break;
            default:
                handleCloseDialog();
                break;
        }
    }, [
        handleCancelDocument,
        handleCloseDialog,
        handleRemoveAsset,
        handleResetToDraft,
        titleDialog
    ]);

    useEffect(() => {
        handleFetchDocumentById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    useEffect(() => {
        const onBackPress = () => {
            navigation.replace('Document');
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
        <SafeAreaView style={styles.container}>
            <AlertDialog
                textTitle={titleDialog}
                textContent={contentDialog}
                visible={visibleDialog}
                showCloseDialog={showCancelDialog}
                handleClose={handleCloseDialog}
                handleConfirm={handleConfirmDialog}
            />

            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#2C86BF', '#2C86BF', '#8DC4E6']}
                style={styles.topSectionList}
            >
                <View style={styles.backToPrevious}>
                    <BackButton
                        handlePress={() => navigation.replace('Document')}
                    />
                </View>
                {documentValue?.state === STATE_DOCUMENT_NAME.Draft && (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.resetCancel}
                        onPress={handleOpenDialogConfirmCancelDocument}
                    >
                        <Text variant="bodySmall" style={styles.textCancel}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                )}

                {(documentValue?.state === STATE_DOCUMENT_NAME.Cancel ||
                    documentValue?.state === STATE_DOCUMENT_NAME.Check) && (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.resetCheck}
                        onPress={handleOpenDialogResetToDraftDocument}
                    >
                        <Text variant="bodySmall" style={styles.textReset}>
                            Reset to Draft
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={styles.containerText}>
                    <Text variant="headlineLarge" style={styles.textHeader}>
                        Document : {documentValue?.id || '-'}
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        Location: {documentValue?.location || '-'}
                    </Text>
                    <View
                        style={[
                            styles.statusIndicator,
                            { backgroundColor: colorStateTag }
                        ]}
                    >
                        <Text variant="labelSmall" style={styles.statusText}>
                            {documentValue?.state || STATE_DOCUMENT_NAME.Draft}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <Text variant="bodyLarge" style={styles.textTotalDocument}>
                    Total Asset : {totalAssetDocument}
                </Text>
                <FlatList
                    data={listAssetDocument}
                    style={styles.flatListStyle}
                    renderItem={({ item }) => (
                        <View style={styles.wrapDetailList}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() =>
                                    navigation.navigate('DocumentAssetDetail', {
                                        assetData: item,
                                        routeBefore: route?.name
                                    })
                                }
                                style={styles.searchButton}
                            >
                                <DocumentAssetStatusCard
                                    assetId={item?.asset_id}
                                    imageSource={item?.image}
                                    assetCode={item?.code}
                                    assetName={item?.name}
                                    assetStatus={item?.use_state}
                                    assetMovement={item?.state}
                                    assetDate={item?.date_check}
                                    documentStatus={documentValue?.state}
                                    handleRemoveAsset={
                                        handleOpenDialogConfirmRemoveAsset
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.asset_id.toString()}
                    onRefresh={() => console.log('refreshing')}
                    refreshing={loading}
                />
            </View>
            {documentValue?.state === STATE_DOCUMENT_NAME.Draft && (
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate('DocumentCreate');
                    }}
                >
                    <ActionButton icon="plus" color={theme.colors.white} />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topSectionList: {
        height: hp('45%'),
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
    resetCancel: {
        position: 'absolute',
        right: 15,
        top: 30,
        borderWidth: 2,
        borderColor: theme.colors.documentCancel,
        backgroundColor: theme.colors.white,
        borderRadius: 25,
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    resetCheck: {
        position: 'absolute',
        right: 15,
        top: 30,
        borderWidth: 2,
        borderColor: theme.colors.documentCheck,
        backgroundColor: theme.colors.white,
        borderRadius: 25,
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    statusIndicator: {
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 25,
        marginTop: 10,
        flexDirection: 'row'
    },
    statusText: {
        color: theme.colors.pureWhite
    },
    containerText: {
        marginHorizontal: 20
    },
    textHeader: {
        color: theme.colors.pureWhite,
        fontSize: RFPercentage(4),
        fontWeight: '700',
        marginBottom: 5
    },
    textDescription: {
        fontFamily: 'Sarabun-Regular',
        color: theme.colors.pureWhite
    },
    listSection: {
        flex: 1,
        height: hp('100%'),
        width: wp('100%'),
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: '52%'
    },
    wrapDetailList: {
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        marginTop: 20,
        marginBottom: 5
    },

    textTotalDocument: {
        marginLeft: 20,
        marginTop: 20,
        fontWeight: '700',
        fontSize: 15,
        marginBottom: 20
    },
    button: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0
    },

    saveButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'center'
    },

    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16
    },

    textReset: {
        fontWeight: 'bold',
        color: theme.colors.documentCheck
    },
    textCancel: {
        fontWeight: 'bold',
        color: theme.colors.documentCancel
    },
    flatListStyle: {
        marginBottom: 30
    },
    searchButton: {
        zIndex: 2
    }
});

export default DocumentAssetStatusScreen;
