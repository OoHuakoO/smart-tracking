import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC, useEffect, useRef } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { Camera, CameraApi, CameraType } from 'react-native-camera-kit';

type DocumentScanAssetProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'DocumentScanAsset'
>;

const DocumentScanAsset: FC<DocumentScanAssetProps> = (props) => {
    const cameraRef = useRef<CameraApi>(null);
    const { navigation, route } = props;

    useEffect(() => {
        const onBackPress = () => {
            navigation.goBack();
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
        <View style={styles.screen}>
            <View style={styles.cameraContainer}>
                <Camera
                    ref={cameraRef}
                    style={styles.cameraPreview}
                    cameraType={CameraType.Back}
                    zoomMode="off"
                    focusMode="on"
                    laserColor="red"
                    frameColor="white"
                    scanBarcode
                    showFrame
                    onReadCode={(event) => {
                        route?.params?.onGoBack(
                            event.nativeEvent.codeStringValue
                        );
                        navigation.goBack();
                    }}
                />
            </View>
        </View>
    );
};

export default DocumentScanAsset;

const styles = StyleSheet.create({
    screen: {
        height: '100%',
        backgroundColor: theme.colors.black
    },
    cameraContainer: {
        justifyContent: 'center',
        flex: 1
    },
    cameraPreview: {
        height: '80%',
        width: '100%'
    }
});
