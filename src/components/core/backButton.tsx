import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { FC, memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface BackButtonProps {
    handlePress: () => void;
    color: string;
    size: number;
}

const BackButton: FC<BackButtonProps> = (props) => {
    const { handlePress, color, size } = props;
    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View>
                <FontAwesomeIcon size={size} color={color} icon={faAngleLeft} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 20
    },
    image: {
        width: 24,
        height: 24
    }
});

export default memo(BackButton);
