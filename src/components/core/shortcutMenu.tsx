import {
    faBoxesStacked,
    faDownload,
    faFile,
    faFlag,
    faLocationDot,
    faUpload
} from '@fortawesome/free-solid-svg-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import Menu from './menu';

interface ShortcutMenuProps
    extends NativeStackScreenProps<PrivateStackParamsList, 'Home'> {
    handleDownload: () => void;
}

const ShortcutMenu: FC<ShortcutMenuProps> = (props) => {
    const { navigation, handleDownload } = props;

    return (
        <View style={styles.container}>
            <View>
                <Text variant="headlineSmall" style={styles.textMenu}>
                    Menu
                </Text>
            </View>
            <View style={styles.menu}>
                <Menu
                    icon={faFile}
                    menuName={'Document'}
                    menuPage={() => navigation.navigate('Document')}
                />
                <Menu
                    icon={faLocationDot}
                    menuName={'Location'}
                    menuPage={() => navigation.navigate('Location')}
                />
                <Menu
                    icon={faBoxesStacked}
                    menuName={'Asset'}
                    menuPage={() => navigation.navigate('Assets')}
                />
                <Menu
                    icon={faFlag}
                    menuName={'Report'}
                    menuPage={() => navigation.navigate('Report')}
                />
                <Menu
                    icon={faUpload}
                    menuName={'Upload'}
                    menuPage={handleDownload}
                />
                <Menu
                    icon={faDownload}
                    menuName={'Download'}
                    menuPage={handleDownload}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textMenu: {
        marginTop: 15,
        fontWeight: 'bold'
    },
    menu: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        gap: 20,
        height: hp('25%'),
        width: wp('90%')
    }
});

export default ShortcutMenu;
