import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { theme } from '@src/theme';
import React, { ComponentProps, FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

type MenuProps = ComponentProps<typeof FontAwesomeIcon> & {
    icon: IconProp;
    menuName: string;
    menuPage: () => void;
};

const Menu: FC<MenuProps> = (props) => {
    const { icon, menuName, menuPage } = props;
    return (
        <TouchableOpacity onPress={menuPage}>
            <View style={styles.containerMenuWrap}>
                <View style={styles.containerMenu}>
                    <FontAwesomeIcon
                        icon={icon}
                        size={45}
                        style={styles.iconStyle}
                    />
                </View>
                <View>
                    <Text variant="titleMedium">{menuName}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    containerMenuWrap: {
        alignItems: 'center'
    },
    containerMenu: {
        width: 75,
        height: 85,
        backgroundColor: theme.colors.primary,
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconStyle: {
        color: '#FFFFFF'
    }
});

export default Menu;
