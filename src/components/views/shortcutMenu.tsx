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
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Menu from '../core/menu';

interface ShortcutMenuProps
    extends NativeStackScreenProps<PrivateStackParamsList, 'Home'> {
    handleDownload: () => void;
    handleUpload: () => void;
    online?: boolean;
}

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768 && height >= 768;
const isSmallMb = width < 400;

const ShortcutMenu: FC<ShortcutMenuProps> = (props) => {
    const { navigation, handleDownload, handleUpload, online } = props;

    return (
        <View>
            <View>
                <Text variant={isTablet ? "headlineLarge" : isSmallMb ? 'titleLarge' : "titleLarge"} style={styles.textMenu}>
                    Menu
                </Text>
            </View>
            <View style={styles.menuContainer}>
                <View style={styles.menuBox}>
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
                    {!online && (
                        <>
                            <Menu
                                icon={faUpload}
                                menuName={'Upload'}
                                menuPage={handleUpload}
                            />
                            <Menu
                                icon={faDownload}
                                menuName={'Download'}
                                menuPage={handleDownload}
                            />
                        </>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textMenu: {
        marginTop: isSmallMb ? 5 : 15,
        fontFamily: 'DMSans-Bold'
    },
    menuContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        width: '100%'
    },
    menuBox: {
        gap: 20,
        display: 'flex',
        flexDirection: 'row',
        width: '90%',
        flexWrap: 'wrap',
        marginLeft: 25
    }
});

export default ShortcutMenu;
