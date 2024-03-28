import BackButton from '@src/components/core/backButton';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';

// import CameraScreen
import { CameraScreen } from 'react-native-camera-kit';

const CameraScan = () => {
    const [isPermitted, setIsPermitted] = useState(false);
    const [captureImages, setCaptureImages] = useState([]);

    // const requestCameraPermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.CAMERA,
    //             {
    //                 title: 'Camera Permission',
    //                 message: 'App needs camera permission',
    //                 buttonPositive: 'OK' // Add this property
    //             }
    //         );
    //         // If CAMERA Permission is granted
    //         return granted === PermissionsAndroid.RESULTS.GRANTED;
    //     } catch (err) {
    //         console.warn(err);
    //         return false;
    //     }
    // };

    // const requestExternalWritePermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //             {
    //                 title: 'External Storage Write Permission',
    //                 message: 'App needs write permission',
    //                 buttonPositive: 'OK'
    //             }
    //         );
    //         // If WRITE_EXTERNAL_STORAGE Permission is granted
    //         return granted === PermissionsAndroid.RESULTS.GRANTED;
    //     } catch (err) {
    //         console.warn(err);
    //         alert('Write permission err');
    //     }
    //     return false;
    // };

    // const requestExternalReadPermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //             {
    //                 title: 'Read Storage Permission',
    //                 message: 'App needs Read Storage Permission',
    //                 buttonPositive: 'OK'
    //             }
    //         );
    //         // If READ_EXTERNAL_STORAGE Permission is granted
    //         return granted === PermissionsAndroid.RESULTS.GRANTED;
    //     } catch (err) {
    //         console.warn(err);
    //         alert('Read permission err');
    //     }
    //     return false;
    // };

    // const openCamera = async () => {
    //     if (Platform.OS === 'android') {
    //         if (await requestCameraPermission()) {
    //             if (await requestExternalWritePermission()) {
    //                 if (await requestExternalReadPermission()) {
    //                     setIsPermitted(true);
    //                 } else alert('READ_EXTERNAL_STORAGE permission denied');
    //             } else alert('WRITE_EXTERNAL_STORAGE permission denied');
    //         } else alert('CAMERA permission denied');
    //     } else {
    //         setIsPermitted(true);
    //     }
    // };

    const clickOpenCamera = () => {
        setIsPermitted(true);
    };

    const onBottomButtonPressed = (event) => {
        const images = JSON.stringify(event.captureImages);
        if (event.type === 'left') {
            setIsPermitted(false);
        } else if (event.type === 'right') {
            setIsPermitted(false);
            // Parse the JSON string into an array
            setCaptureImages(JSON.parse(images));
        } else {
            Alert.alert(
                event.type,
                images,
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false }
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {isPermitted ? (
                <View style={{ flex: 1 }}>
                    <CameraScreen
                        // Buttons to perform action done and cancel
                        actions={{
                            rightButtonText: 'Done',
                            leftButtonText: 'Cancel'
                        }}
                        onBottomButtonPressed={(event) =>
                            onBottomButtonPressed(event)
                        }
                        // flashImages={{
                        //     // Flash button images
                        //     on: require('./assets/fl'),
                        //     off: require('./assets/flashoff.png'),
                        //     auto: require('./assets/flashauto.png')
                        // }}
                        // captureButtonImage={require('./assets/capture.png')}
                        scanBarcode={true}
                        showFrame={true}
                        onReadCode={(event) =>
                            console.log(event.nativeEvent.codeStringValue)
                        }
                        frameColor="white"
                    />
                </View>
            ) : (
                <View style={styles.container}>
                    <Text>{captureImages}</Text>
                    {/* <TouchableHighlight onPress={openCamera}>
                        <Text>Open Camera</Text>
                    </TouchableHighlight> */}
                    <BackButton handlePress={clickOpenCamera} />
                </View>
            )}
        </SafeAreaView>
    );
};

export default CameraScan;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    titleText: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    textStyle: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        marginTop: 16
    }
});
