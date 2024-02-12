import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
interface DocumentScreenProp {
    documentTitle: string;
    locationInfo: string;
    dateInfo: string;
    documentStatus: string;
}
const DocumentCard: FC<DocumentScreenProp> = (props) => {
    const { documentTitle, locationInfo, dateInfo, documentStatus } = props;
    let backgroundColor = 'black';
    let borderColor = 'black';
    switch (documentStatus) {
        case 'draft':
            backgroundColor = '#2E67A6';
            borderColor = '#2E67A6';
            break;
        case 'inprogress':
            backgroundColor = '#F8A435';
            borderColor = '#F8A435';
            break;
        case 'done':
            backgroundColor = '#63CA7F';
            borderColor = '#63CA7F';
            break;
        case 'canceled':
            backgroundColor = '#F0787A';
            borderColor = '#F0787A';
            break;
    }

    return (
        <View style={[styles.cardContainer, { borderColor }]}>
            <View style={styles.deleteIconContainer}>
                {documentStatus === 'draft' && (
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
                        Location:{' '}
                    </Text>
                    {locationInfo}
                </Text>
                <Text variant="bodyMedium" style={styles.additionalText}>
                    <Text variant="bodyMedium" style={styles.primitiveText}>
                        Date:{' '}
                    </Text>{' '}
                    {dateInfo}
                </Text>
                <View style={[styles.statusContainer, { backgroundColor }]}>
                    <Text variant="bodyMedium" style={{ color: '#ffff' }}>
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
        width: 370,
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
    }
});

export default DocumentCard;
