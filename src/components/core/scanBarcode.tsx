import React, { useEffect } from 'react'; // Import useEffect
import { StyleSheet, View } from 'react-native'; // Import StyleSheet
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    useCodeScanner
} from 'react-native-vision-camera';

export default function ScanBarcode() {
    // Corrected function name to start with uppercase
    const { hasPermission, requestPermission } = useCameraPermission();

    const device = useCameraDevice('back');

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes: any) => {
            console.log(`Scanned ${codes.value} codes!`);
        }
    });

    useEffect(() => {
        // Use useEffect directly inside the component
        requestPermission();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (device == null) {
        return <View>Device not found</View>;
    }

    return (
        <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
        />
    );
}
