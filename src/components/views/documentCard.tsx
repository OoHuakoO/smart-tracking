import { STATE_DOCUMENT_NAME } from '@src/constant';
import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
interface DocumentScreenProp {
    documentTitle: string;
    locationInfo: string;
    dateInfo: string;
    documentStatus: string;
    online: boolean;
    id: number;
    isSyncOdoo: boolean;
}
const DocumentCard: FC<DocumentScreenProp> = (props) => {
    const {
        documentTitle,
        locationInfo,
        dateInfo,
        documentStatus,
        online,
        isSyncOdoo
    } = props;
    let backgroundColor = theme.colors.black;
    let borderColor = theme.colors.black;
    let backgroundColorSyncOdoo = theme.colors.borderAutocomplete;

    switch (documentStatus) {
        case STATE_DOCUMENT_NAME.Draft:
            backgroundColor = '#2E67A6';
            borderColor = '#2E67A6';
            break;
        case STATE_DOCUMENT_NAME.Check:
            backgroundColor = '#F8A435';
            borderColor = '#F8A435';
            break;
        case STATE_DOCUMENT_NAME.Done:
            backgroundColor = '#63CA7F';
            borderColor = '#63CA7F';
            break;
        case STATE_DOCUMENT_NAME.Cancel:
            backgroundColor = '#F0787A';
            borderColor = '#F0787A';
            break;
    }

    switch (isSyncOdoo) {
        case true:
            backgroundColorSyncOdoo = '#63CA7F';
            break;

        default:
            backgroundColorSyncOdoo = theme.colors.borderAutocomplete;
            break;
    }

    return (
        <View style={[styles.cardContainer, { borderColor }]}>
            <View style={styles.textContainer}>
                <Text variant="titleMedium" style={styles.documentTitle}>
                    {documentTitle}
                </Text>
                <Text variant="bodyMedium" style={styles.additionalText}>
                    Location : {locationInfo}
                </Text>
                <Text variant="bodyMedium" style={styles.additionalText}>
                    Date : {dateInfo}
                </Text>
                <View style={styles.rowStatus}>
                    <View style={[styles.statusContainer, { backgroundColor }]}>
                        <Text
                            variant="bodyMedium"
                            style={styles.documentStatusText}
                        >
                            {documentStatus}
                        </Text>
                    </View>
                    {!online && (
                        <View
                            style={[
                                styles.statusContainer,
                                { backgroundColor: backgroundColorSyncOdoo }
                            ]}
                        >
                            <Text
                                variant="bodyMedium"
                                style={styles.documentStatusText}
                            >
                                {isSyncOdoo ? 'Sync Odoo' : 'Not Sync Odoo'}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        width: wp('90%'),
        height: 130,
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 15,
        shadowColor: '#000',
        borderWidth: 2,
        borderLeftWidth: 8,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 1
    },
    textContainer: {
        marginLeft: 20
    },
    documentTitle: {
        fontFamily: 'DMSans-Bold',
        color: '#404040',
        marginBottom: 5
    },
    additionalText: {
        fontSize: 14,
        color: theme.colors.additionalText
    },
    statusContainer: {
        marginTop: 5,
        alignSelf: 'flex-start',
        paddingVertical: 2,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'flex-start',
        marginRight: 10
    },
    deleteIconContainer: {
        position: 'absolute',
        right: 10,
        top: 10,
        padding: 10,
        backgroundColor: theme.colors.white,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: theme.colors.documentCancel
    },
    documentStatusText: {
        color: '#ffffff'
    },
    rowStatus: {
        marginTop: 3,
        flexDirection: 'row'
    }
});

export default DocumentCard;
