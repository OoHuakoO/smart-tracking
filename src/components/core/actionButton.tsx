import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

type FABSize = 'small' | 'medium' | 'large';
interface ActionButtonProps {
    size?: FABSize;
    icon: string;
    backgroundColor?: string;
    color?: any;
}

const ActionButton: FC<ActionButtonProps> = (props) => {
    const { size, icon, backgroundColor, color } = props;
    return (
        <FAB
            color={color}
            style={[
                styles.fab,
                { backgroundColor: backgroundColor || '#4499CE' }
            ]}
            icon={icon}
            size={size}
        />
    );
};

const styles = StyleSheet.create({
    fab: {
        borderRadius: 25
    }
});

export default ActionButton;
