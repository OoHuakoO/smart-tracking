import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ActionButton from '@src/components/core/actionButton';
import BackButton from '@src/components/core/backButton';
import DocumentDialog from '@src/components/core/documentDialog';
import DocumentCard from '@src/components/views/documentCard';
import SearchButton from '@src/components/views/searchButton';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
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

type DocumentScreenProp = NativeStackScreenProps<
    PrivateStackParamsList,
    'Document'
>;

const DocumentScreen: FC<DocumentScreenProp> = (props) => {
    const { navigation } = props;
    const [dialogVisible, setDialogVisible] = useState(false);
    const toggleDialog = () => {
        setDialogVisible(!dialogVisible);
    };

    return (
        <SafeAreaView style={styles.container}>
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
                <ScrollView>
                    <Text variant="bodyLarge" style={styles.textTotalDocument}>
                        Total Document : 3
                    </Text>
                    <View style={styles.wrapDetailList}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                                navigation.navigate('DocumentAssetStatus')
                            }
                        >
                            <DocumentCard
                                documentTitle={'Document Draft'}
                                locationInfo={'H0-10th'}
                                dateInfo={'01/01/2567'}
                                documentStatus={'draft'}
                            />
                        </TouchableOpacity>
                        <DocumentCard
                            documentTitle={'Document 001'}
                            locationInfo={'H0-11th'}
                            dateInfo={'01/01/2567'}
                            documentStatus={'inprogress'}
                        />
                        <DocumentCard
                            documentTitle={'Document 002'}
                            locationInfo={'H0-12th'}
                            dateInfo={'01/01/2567'}
                            documentStatus={'done'}
                        />
                        <DocumentCard
                            documentTitle={'Document 004'}
                            locationInfo={'H0-12th'}
                            dateInfo={'01/01/2567'}
                            documentStatus={'canceled'}
                        />
                    </View>
                </ScrollView>
            </View>
            <DocumentDialog
                visible={dialogVisible}
                onClose={toggleDialog}
                pageNavigate={() => navigation.navigate('DocumentCreate')}
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
        marginVertical: 25,
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
        gap: 15,
        marginTop: 20,
        marginBottom: 5
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
        fontSize: 15
    },
    drawer: {
        width: '80%' // Adjust the width as needed
    },
    Button: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    }
});

export default DocumentScreen;
