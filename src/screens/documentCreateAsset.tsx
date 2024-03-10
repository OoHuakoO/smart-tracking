import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import InputText from '@src/components/core/inputText';
import PopUpDialog from '@src/components/views/popUpDialog';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
    MediaType,
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

type DocumentCreateAssetProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentCreateAsset'
>;

const DocumentCreateAsset: FC<DocumentCreateAssetProps> = (props) => {
    const { navigation } = props;
    const [selectedImage, setSelectedImage] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const toggleDialog = () => {
        setDialogVisible(!dialogVisible);
    };

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('Image picker error: ', response.errorMessage);
            } else {
                let imageUri = response.assets || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
            }
        });
    };

    const handleCameraLaunch = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000
        };

        launchCamera(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
            } else {
                // Process the captured image
                let imageUri = response.assets || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                console.log(imageUri);
            }
        });
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
                    <BackButton handlePress={() => navigation.goBack()} />
                </View>
                <View style={styles.containerText}>
                    <Text
                        variant="headlineSmall"
                        style={{ color: theme.colors.white, fontWeight: '700' }}
                    >
                        Add Asset
                    </Text>
                    <Text variant="headlineSmall" style={styles.textHeader}>
                        Document No:
                    </Text>
                    <Text variant="bodyLarge" style={styles.textDescription}>
                        Location:
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listSection}>
                <TouchableOpacity
                    style={styles.containerMenu}
                    activeOpacity={0.8}
                    onPress={toggleDialog}
                >
                    <FontAwesomeIcon icon={faCamera} size={34} />
                </TouchableOpacity>

                <View style={styles.inputWraper}>
                    <Text variant="bodyLarge" style={{ fontWeight: '700' }}>
                        Code
                    </Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        borderColor="#828282"
                    />

                    <Text variant="bodyLarge" style={{ fontWeight: '700' }}>
                        Name
                    </Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        borderColor="#828282"
                    />

                    <Text variant="bodyLarge" style={{ fontWeight: '700' }}>
                        Catagory
                    </Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        borderColor="#828282"
                    />

                    <Text variant="bodyLarge" style={{ fontWeight: '700' }}>
                        Status
                    </Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        borderColor="#828282"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#2983BC' }]}
                        onPress={() => console.log('Button 1 Pressed')}
                        activeOpacity={0.8}
                    >
                        <Text
                            variant="bodyLarge"
                            style={{
                                color: theme.colors.white,
                                fontWeight: '600'
                            }}
                        >
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <PopUpDialog
                visible={dialogVisible}
                onClose={toggleDialog}
                openImagePicker={openImagePicker}
                handleCameraLaunch={handleCameraLaunch}
            />
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
        marginTop: '50%',
        marginBottom: 2,
        alignItems: 'center'
    },

    containerMenu: {
        width: 105,
        height: 112,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F1F1',
        marginTop: 25,
        borderRadius: 12
    },

    inputWraper: {
        width: wp('100%'),
        paddingHorizontal: 40
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10
    },

    button: {
        backgroundColor: 'blue',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    }
});

export default DocumentCreateAsset;
