import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import DocumentAssetStatusCard from '@src/components/views/documentAssetStatusCard';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native-paper';

import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import ActionButton from '@src/components/core/actionButton';
import AlertDialog from '@src/components/core/alertDialog';
import {
    MOVEMENT_ASSET,
    MOVEMENT_ASSET_EN,
    RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND,
    STATE_DOCUMENT_NAME
} from '@src/constant';
import { DeleteDocumentLine, GetDocumentById } from '@src/services/document';
import {
    documentAssetListState,
    documentState,
    useRecoilValue,
    useSetRecoilState
} from '@src/store';
import { DocumentState } from '@src/typings/common';
import { DocumentAssetData } from '@src/typings/document';
import { getOnlineMode } from '@src/utils/common';
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
    const [totalAssetDocument, setTotalAssetDocument] = useState<number>(0);
    const [listAssetDocument, setListAssetDocument] = useState<
        DocumentAssetData[]
    >([]);
    const [idAsset, setIdAsset] = useState<number>(0);
    const documentValue = useRecoilValue<DocumentState>(documentState);
    const setDocumentAssetList = useSetRecoilState<DocumentAssetData[]>(
        documentAssetListState
    );

    let backgroundColor = theme.colors.documentDraft;

    switch (documentValue?.state) {
        case STATE_DOCUMENT_NAME.Draft:
            backgroundColor = theme.colors.documentDraft;
            break;
        case STATE_DOCUMENT_NAME.Check:
            backgroundColor = theme.colors.documentCheck;
            break;
        case STATE_DOCUMENT_NAME.Done:
            backgroundColor = theme.colors.documentDone;
            break;
        case STATE_DOCUMENT_NAME.Cancel:
            backgroundColor = theme.colors.documentCancel;
            break;
        default:
            backgroundColor = theme.colors.documentDraft;
            break;
    }

    const handleMapMovementStateValue = useCallback((state: string): string => {
        switch (state) {
            case MOVEMENT_ASSET.Normal:
                return MOVEMENT_ASSET_EN.Normal;
            case MOVEMENT_ASSET.New:
                return MOVEMENT_ASSET_EN.New;
            case MOVEMENT_ASSET.Transfer:
                return MOVEMENT_ASSET_EN.Transfer;
            default:
                return MOVEMENT_ASSET_EN.Normal;
        }
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
                response?.result?.data?.asset?.assets?.map((item) => {
                    item.state = handleMapMovementStateValue(item?.state);
                    item.date_check = parseDateString(item?.date_check);
                });
                setTotalAssetDocument(
                    response?.result?.data?.asset?.assets?.length
                );
                setListAssetDocument(response?.result?.data?.asset?.assets);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setVisibleDialog(true);
            setContentDialog('Something went wrong fetch document');
        }
    }, [documentValue?.id, handleMapMovementStateValue]);

    const clearStateDialog = useCallback(() => {
        setVisibleDialog(false);
        setTitleDialog('');
        setContentDialog('');
    }, []);

    const handleOpenDialogConfirmRemoveAsset = useCallback((id: number) => {
        setVisibleDialog(true);
        setTitleDialog('Confirm');
        setContentDialog('Do you want to remove this asset ?');
        setIdAsset(id);
    }, []);

    const handleRemoveAsset = useCallback(async () => {
        try {
            clearStateDialog();
            const response = await DeleteDocumentLine({
                asset_tracking_id: documentValue?.id,
                asset_ids: [{ id: idAsset }]
            });
            if (
                response?.result?.message ===
                RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND
            ) {
                setVisibleDialog(true);
                setContentDialog('Something went Asset data not found');
                return;
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
    }, [clearStateDialog, documentValue?.id, handleFetchDocumentById, idAsset]);

    const handleConfirmDialog = useCallback(async () => {
        switch (titleDialog) {
            case 'Confirm':
                await handleRemoveAsset();
                break;
            default:
                handleCloseDialog();
                break;
        }
    }, [handleCloseDialog, handleRemoveAsset, titleDialog]);

    useEffect(() => {
        handleFetchDocumentById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route?.params?.isReFresh]);

    return (
        <SafeAreaView style={styles.container}>
            <AlertDialog
                textTitle={titleDialog}
                textContent={contentDialog}
                visible={visibleDialog}
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
                        handlePress={() => navigation.navigate('Document')}
                    />
                </View>
                {documentValue?.state === STATE_DOCUMENT_NAME.Cancel && (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.resetCancel}
                    >
                        <Text variant="bodySmall" style={styles.textReset}>
                            Reset to Inprogress
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
                    <View style={[styles.statusIndicator, { backgroundColor }]}>
                        <Text variant="labelSmall" style={styles.statusText}>
                            {documentValue?.state || STATE_DOCUMENT_NAME.Draft}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <Text variant="bodyLarge" style={styles.textTotalDocument}>
                    Total Document : {totalAssetDocument}
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
                {/* {documentStatus === STATE_DOCUMENT_NAME.Draft && (
                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                )} */}
            </View>
            {documentValue?.state === STATE_DOCUMENT_NAME.Draft && (
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate('DocumentCreate');
                        setDocumentAssetList(listAssetDocument);
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
