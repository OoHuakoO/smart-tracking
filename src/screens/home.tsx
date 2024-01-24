import React, { FC } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';

import {
    faBoxesStacked,
    faDownload,
    faFile,
    faFlag,
    faLocationDot,
    faUpload
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ImageSlider from '@src/components/core/imagesSlider';
import { theme } from '@src/theme';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

type HomeScreenProps = NativeStackScreenProps<PrivateStackParamsList, 'Home'>;

const HomeScreen: FC<HomeScreenProps> = () => {
    // const { navigation } = props;

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <IconButton
                    icon="camera"
                    iconColor={theme.colors.textBody}
                    size={20}
                    onPress={() => console.log('Pressed')}
                />
                <Text variant="displayMedium" style={styles.textHeader}>
                    Welcome
                </Text>
            </View>
            <ImageSlider />
            <View>
                <Text variant="headlineSmall" style={styles.textMenu}>
                    Menu
                </Text>
            </View>
            <View style={styles.menu}>
                <View style={styles.containerMenu}>
                    <FontAwesomeIcon
                        icon={faFile}
                        size={45}
                        style={styles.iconStyle}
                    />
                </View>
                <View style={styles.containerMenu}>
                    <FontAwesomeIcon
                        icon={faLocationDot}
                        size={45}
                        style={styles.iconStyle}
                    />
                </View>
                <View style={styles.containerMenu}>
                    <FontAwesomeIcon
                        icon={faBoxesStacked}
                        size={45}
                        style={styles.iconStyle}
                    />
                </View>
            </View>

            <View style={styles.menu}>
                <View style={styles.containerMenu}>
                    <FontAwesomeIcon
                        icon={faFlag}
                        size={45}
                        style={styles.iconStyle}
                    />
                </View>
                <View style={styles.containerMenu}>
                    <FontAwesomeIcon
                        icon={faUpload}
                        size={45}
                        style={styles.iconStyle}
                    />
                </View>
                <View style={styles.containerMenu}>
                    <FontAwesomeIcon
                        icon={faDownload}
                        size={45}
                        style={styles.iconStyle}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 20
    },
    textHeader: {
        width: '100%',
        color: theme.colors.textPrimary,
        fontWeight: '700',
        textAlign: 'left',
        marginBottom: 15
    },
    textMenu: {
        marginTop: 15,
        fontWeight: 'bold'
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
    },
    menu: {
        display: 'flex',
        flexDirection: 'row',
        gap: 25,
        margin: 15
    }
});

export default HomeScreen;
