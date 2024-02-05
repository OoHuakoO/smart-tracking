import { useRecoilState } from '@src/store';
import { toastState } from '@src/store/toast';
import { theme } from '@src/theme';
import { Toast } from '@src/typings/common';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';

const ToastComponent = () => {
    const [toast, setToast] = useRecoilState<Toast>(toastState);
    const onDismissSnackBar = () => setToast({ open: false, text: '' });

    return (
        <View style={styles.container}>
            <Snackbar
                style={{ backgroundColor: theme.colors.success }}
                duration={3000}
                visible={toast?.open}
                onDismiss={onDismissSnackBar}
            >
                <Text variant="bodyLarge" style={styles.text}>
                    {toast?.text}
                </Text>
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    text: {
        color: theme.colors.white
    }
});

export default ToastComponent;
