import React, { FC } from 'react';
import { Image, SafeAreaView, StatusBar, View } from 'react-native';

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
            <Image
                style={{ width: 100, height: 100 }}
                source={require('./assets/images/download.svg')}
            />
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
    }
});

export default HomeScreen;
