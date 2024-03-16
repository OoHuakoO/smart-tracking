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
    STATE_DOCUMENT_NAME,
    USE_STATE_ASSET,
    USE_STATE_ASSET_NORMAL_EN
} from '@src/constant';
import { GetDocumentById } from '@src/services/document';
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
    const [contentDialog, setContentDialog] = useState<string>('');
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [totalAssetDocument, setTotalAssetDocument] = useState<number>(0);
    const [listAssetDocument, setListAssetDocument] = useState<
        DocumentAssetData[]
    >([]);

    let backgroundColor = 'black';
    let documentStatus = STATE_DOCUMENT_NAME.Draft;

    switch (route?.params?.state) {
        case STATE_DOCUMENT_NAME.Draft:
            backgroundColor = '#2E67A6';
            break;
        case STATE_DOCUMENT_NAME.Check:
            backgroundColor = '#F8A435';
            break;
        case STATE_DOCUMENT_NAME.Done:
            backgroundColor = '#63CA7F';
            break;
        case STATE_DOCUMENT_NAME.Cancel:
            backgroundColor = '#F0787A';
            break;
    }

    const handleMapStateValue = useCallback((state: string): string => {
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
                const response = await GetDocumentById(route?.params?.id);
                response?.result?.data?.asset?.assets?.map((item) => {
                    if (item?.use_state === USE_STATE_ASSET_NORMAL_EN) {
                        item.use_state = USE_STATE_ASSET.Normal;
                    }
                    item.state = handleMapStateValue(item?.state);
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
    }, [handleMapStateValue, route?.params?.id]);

    useEffect(() => {
        handleFetchDocumentById();
    }, [handleFetchDocumentById]);

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
                        handlePress={() => navigation.navigate('Document')}
                    />
                </View>
                {route?.params?.state === STATE_DOCUMENT_NAME.Cancel && (
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
                        Document : {route?.params?.id}
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        Location: {route?.params?.location}
                    </Text>
                    <View style={[styles.statusIndicator, { backgroundColor }]}>
                        <Text variant="labelSmall" style={styles.statusText}>
                            {route?.params?.state}
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
                    renderItem={({ item }) => (
                        <View style={styles.wrapDetailList}>
                            <DocumentAssetStatusCard
                                imageSource={item?.image}
                                assetCode={item?.code}
                                assetName={item?.name}
                                assetStatus={item?.use_state}
                                assetMovement={item?.state}
                                assetDate={item?.date_check}
                                documentStatus={route?.params?.state}
                            />
                        </View>
                    )}
                    keyExtractor={(item) => item.asset_id.toString()}
                    onRefresh={() => console.log('refreshing')}
                    refreshing={loading}
                />
                {documentStatus === STATE_DOCUMENT_NAME.Draft && (
                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                )}
            </View>
            {documentStatus === STATE_DOCUMENT_NAME.Draft && (
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.button}
                    onPress={() => navigation.navigate('DocumentCreateAsset')}
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
        borderColor: '#F0787A',
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
        color: '#FFFFFF'
    },
    containerText: {
        marginHorizontal: 20
    },
    textHeader: {
        color: '#FFFFFF',
        fontSize: RFPercentage(4),
        fontWeight: '700',
        marginBottom: 5
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
        backgroundColor: '#2983BC',
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
        color: '#F0787A'
    }
});
export default DocumentAssetStatusScreen;
