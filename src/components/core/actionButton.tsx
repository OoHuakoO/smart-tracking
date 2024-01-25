import { theme } from '@src/theme';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

type FABSize = 'small' | 'medium' | 'large';
interface ActionButtonProps {
    size?: FABSize;
    icon: string;
}

const ActionButton: FC<ActionButtonProps> = (props) => {
    const { size, icon } = props;
    return (
        <FAB
            color={theme.colors.textWhitePrimary}
            style={styles.fab}
            icon={icon}
            size={size}
        />
    );
};

const styles = StyleSheet.create({
    fab: {
        borderRadius: 25,
        backgroundColor: '#4499CE'
    }
});

export default ActionButton;
