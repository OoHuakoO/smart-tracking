import React, { ComponentProps, FC } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

type FabProps = ComponentProps<typeof FAB> & {
    size?: string;
    icon: string;
};

const ActionButton: FC<FabProps> = (props) => {
    const { size, icon } = props;
    return (
        <FAB
            style={styles.fab}
            icon={icon}
            onPress={() => console.log('Pressed')}
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
