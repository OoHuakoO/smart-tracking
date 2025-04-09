import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { theme } from '@src/theme';
import React, { FC } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

interface MenuProps {
    icon: IconProp;
    menuName: string;
    menuPage: () => void;
}

const { width } = Dimensions.get('window');

const isSmallMb = width < 400;

const Menu: FC<MenuProps> = (props) => {
    const { icon, menuName, menuPage } = props;
    return (
        <TouchableOpacity onPress={menuPage}>
            <View style={styles.containerMenuWrap}>
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#2C86BF', '#2C86BF', '#8DC4E6']}
                    style={styles.gradientBox}
                >
                    <View style={styles.containerMenu}>
                        <FontAwesomeIcon
                            icon={icon}
                            size={isTablet() ? 70 : isSmallMb ? 37 : 45}
                            style={styles.iconStyle}
                        />
                    </View>
                </LinearGradient>
                <View>
                    <Text
                        variant="titleMedium"
                        style={[
                            styles.textMenu,
                            { fontSize: RFPercentage(2.1) }
                        ]}
                    >
                        {menuName}
                    </Text>
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
        width: isTablet() ? wp('19%') : wp('21%'),
        height: isSmallMb || isTablet() ? hp('14%') : hp('12%'),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gradientBox: {
        borderRadius: wp('6%')
    },
    iconStyle: {
        color: theme.colors.white
    },
    textMenu: {
        marginTop: isSmallMb ? 5 : 10,
        fontFamily: 'DMSans-Medium'
    }
});

export default Menu;
