import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { STATE_DOCUMENT_NAME } from '@src/constant';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
interface DocumentScreenProp {
    documentTitle: string;
    locationInfo: string;
    dateInfo: string;
    documentStatus: string;
    online: boolean;
}
const DocumentCard: FC<DocumentScreenProp> = (props) => {
    const { documentTitle, locationInfo, dateInfo, documentStatus, online } =
        props;
    let backgroundColor = 'black';
    let borderColor = 'black';
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

    return (
        <View style={[styles.cardContainer, { borderColor }]}>
            <View style={styles.deleteIconContainer}>
                {documentStatus === STATE_DOCUMENT_NAME.Draft && !online && (
                    <TouchableOpacity
                        onPress={() => console.log('Delete')}
                        activeOpacity={0.5}
                    >
                        <FontAwesomeIcon icon={faTrash} color="#F0787A" />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.documentTitle}>{documentTitle}</Text>
                <Text variant="bodyMedium" style={styles.additionalText}>
                    <Text variant="bodyMedium" style={styles.primitiveText}>
                        Location : {''}
                    </Text>
                    {locationInfo}
                </Text>
                <Text variant="bodyMedium" style={styles.additionalText}>
                    <Text variant="bodyMedium" style={styles.primitiveText}>
                        Date : {''}
                    </Text>
                    {dateInfo}
                </Text>
                <View style={[styles.statusContainer, { backgroundColor }]}>
                    <Text
                        variant="bodyMedium"
                        style={styles.documentStatusText}
                    >
                        {documentStatus}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        width: wp('90%'),
        height: 120,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#404040',
        marginBottom: 5
    },
    additionalText: {
        fontSize: 14,
        color: '#777'
    },
    primitiveText: {
        color: '#50555C',
        fontWeight: '600'
    },
    statusContainer: {
        marginTop: 5,
        alignSelf: 'flex-start',
        paddingVertical: 2,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'flex-start'
    },
    deleteIconContainer: {
        position: 'absolute',
        right: 20,
        top: 15
    },
    documentStatusText: {
        color: '#ffffff'
    }
});

export default DocumentCard;
