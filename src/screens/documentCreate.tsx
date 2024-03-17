import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import Button from '@src/components/core/button';
import AddAssetCard from '@src/components/views/addAssetCard';
import SearchButton from '@src/components/views/searchButton';
import { MOVEMENT_ASSET_NORMAL_TH } from '@src/constant';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

type DocumentCreateProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentCreate'
>;

const DocumentCreateScreen: FC<DocumentCreateProps> = (props) => {
    const { navigation, route } = props;
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
                        handlePress={() =>
                            navigation.navigate('DocumentAssetStatus')
                        }
                    />
                </View>

                <View style={styles.containerText}>
                    <Text variant="headlineSmall" style={styles.textHeader}>
                        Add Asset
                    </Text>
                    <Text variant="headlineSmall" style={styles.textHeader}>
                        Document No: {route?.params?.id}
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        Location:{route?.params?.location}
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Input Or Scan Asset"
                        placeholderTextColor={theme.colors.textBody}
                    />
                    <TouchableOpacity onPress={() => console.log('ok')}>
                        <Button
                            style={styles.dialogActionConfirm}
                            onPress={() => console.log('ok')}
                        >
                            <Text
                                style={styles.textActionConfirm}
                                variant="bodyLarge"
                            >
                                Search
                            </Text>
                        </Button>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchButtonWrap}>
                    <SearchButton
                        handlePress={() =>
                            console.log('search on DocumentCreate')
                        }
                    />
                </View>
                <ScrollView>
                    <Text variant="bodyLarge" style={styles.textTotalDocument}>
                        Total Document : 3
                    </Text>
                    <View style={styles.wrapDetailList}>
                        <AddAssetCard
                            imageSource={require('../../assets/images/img1.jpg')}
                            assetCode="RB0001"
                            assetName="Table"
                            assetStatus={MOVEMENT_ASSET_NORMAL_TH}
                            assetMovement="Normal"
                            assetDate="01/01/2567"
                        />

                        <AddAssetCard
                            imageSource={require('../../assets/images/img2.jpg')}
                            assetCode="RB0001"
                            assetName="Table"
                            assetStatus={MOVEMENT_ASSET_NORMAL_TH}
                            assetMovement="Normal"
                            assetDate="01/01/2567"
                        />

                        <AddAssetCard
                            imageSource={require('../../assets/images/img3.jpg')}
                            assetCode="RB0001"
                            assetName="Table"
                            assetStatus={MOVEMENT_ASSET_NORMAL_TH}
                            assetMovement="Normal"
                            assetDate="01/01/2567"
                        />
                        <TouchableOpacity style={styles.saveButton}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
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
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch'
    },
    searchButtonWrap: {
        position: 'absolute',
        right: 25,
        top: -20
    },

    searchContainer: {
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    },
    statusText: {
        color: '#FFFFFF'
    },
    containerText: {
        marginHorizontal: 20
    },
    textHeader: {
        color: '#FFFFFF',
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
        fontSize: 15
    },

    saveButton: {
        backgroundColor: '#2983BC',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },

    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16
    },
    dialogActionConfirm: {
        paddingVertical: 2,
        backgroundColor: theme.colors.buttonConfirm,
        borderRadius: 10,
        height: 48
    },
    textActionConfirm: {
        fontFamily: 'DMSans-Medium',
        color: theme.colors.white
    },
    input: {
        height: 48,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 10,
        fontFamily: 'DMSans-Bold',
        color: theme.colors.textBody,
        width: '65%',
        marginRight: 10
    }
});
export default DocumentCreateScreen;
