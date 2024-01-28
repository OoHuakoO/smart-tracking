import {
    faBoxesStacked,
    faDownload,
    faFile,
    faFlag,
    faLocationDot,
    faUpload
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import Menu from './menu';

const ShortcutMenu = () => {
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
                    menuPage={() => console.log('Press Menu1')}
                />
                <Menu
                    icon={faLocationDot}
                    menuName={'Location'}
                    menuPage={() => console.log('Press Menu2')}
                />
                <Menu
                    icon={faBoxesStacked}
                    menuName={'Asset'}
                    menuPage={() => console.log('Press Menu2')}
                />
                <Menu
                    icon={faFlag}
                    menuName={'Report'}
                    menuPage={() => console.log('Press Menu4')}
                />
                <Menu
                    icon={faUpload}
                    menuName={'Upload'}
                    menuPage={() => console.log('Press Menu5')}
                />
                <Menu
                    icon={faDownload}
                    menuName={'Download'}
                    menuPage={() => console.log('Press Menu6')}
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
