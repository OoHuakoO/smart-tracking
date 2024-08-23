import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

interface ReportButtonProps {
    handlePress: () => void;
    buttonText: string;
}
const ReportAssetStatusButton: FC<ReportButtonProps> = (props) => {
    const { handlePress, buttonText } = props;
    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <Text variant="bodyLarge" style={styles.buttonText}>
                {buttonText}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 170,
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#53ACE4',
        paddingVertical: 20
    },
    buttonText: {
        fontFamily: 'DMSans-Bold',
        color: theme.colors.white
    }
});

export default ReportAssetStatusButton;
