/* eslint-disable react-native/no-inline-styles */
import React, { FC, useCallback, useEffect, useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '@src/components/core/backButton';
import { theme } from '@src/theme';
import { PublicStackParamsList } from '@src/typings/navigation';
import {
    BackHandler,
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type PasswordSettingScreenProps = NativeStackScreenProps<
    PublicStackParamsList,
    'Setting'
>;
const { width } = Dimensions.get('window');
const dialPadSize = width * 0.2;
const dialPadTextSize = dialPadSize * 0.4;

const PasswordSettingScreen: FC<PasswordSettingScreenProps> = (props) => {
    const { navigation } = props;
    const dialPadContent = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '<'];
    const pinLength = 5;
    const pinContainerSize = width / 2.5;
    const pinSize = pinContainerSize / pinLength;
    const [code, setCode] = useState<(string | number)[]>([]);
    const [isError, setIsError] = useState<boolean>(false);

    const handleChangePassword = useCallback(
        (item: string | number) => {
            setIsError(false);
            const codeString = code.join('') + item.toString();
            const codeNumber = parseInt(codeString, 10);
            if (item === '<') {
                setCode((prev) => prev.slice(0, -1));
            } else {
                if (code.length === pinLength - 1) {
                    const now = new Date();
                    const day = now.getDate();
                    const month = now.getMonth() + 1;
                    const year = now.getFullYear();
                    const sumCalculate = (day + month + year) * 5435;
                    let password = sumCalculate
                        .toString()
                        .slice(0, -1)
                        .slice(-5);
                    if (codeNumber === parseInt(password, 10)) {
                        navigation.navigate('Setting');
                    } else {
                        setIsError(true);
                        setCode([]);
                        return;
                    }
                }
                setCode((prev) => [...prev, item]);
            }
        },
        [code, navigation]
    );

    useEffect(() => {
        const onBackPress = () => {
            navigation.navigate('Login');
            return true;
        };
        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        return () => {
            subscription.remove();
        };
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backToPrevious}>
                <BackButton handlePress={() => navigation.navigate('Login')} />
            </View>
            <Text style={styles.pinText} variant="headlineSmall">
                Input PIN
            </Text>
            <Text style={styles.pinSubText} variant="titleMedium">
                Enter your secure five digit code
            </Text>

            <View style={styles.dialPadPinContainer}>
                {Array(pinLength)
                    .fill(null)
                    .map((_, index) => {
                        const item = dialPadContent[index];
                        const isSelected =
                            typeof item === 'number' &&
                            code[index] !== undefined;
                        return (
                            <View
                                key={index}
                                style={{
                                    width: pinSize,
                                    height: pinSize,
                                    borderRadius: pinSize / 2,
                                    overflow: 'hidden',
                                    margin: 5
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            borderRadius: pinSize / 2,
                                            borderColor: isError
                                                ? theme.colors.error
                                                : theme.colors.white
                                        },
                                        styles.pinContentContainer
                                    ]}
                                >
                                    {isSelected && (
                                        <View
                                            style={[
                                                {
                                                    borderRadius: pinSize / 2
                                                },
                                                styles.pinContent
                                            ]}
                                        />
                                    )}
                                </View>
                            </View>
                        );
                    })}
            </View>

            <FlatList
                data={dialPadContent}
                numColumns={3}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            disabled={item === ''} // make the empty space on the dialpad content unclickable
                            onPress={() => {
                                handleChangePassword(item);
                            }}
                        >
                            <View
                                style={[
                                    {
                                        borderColor:
                                            item !== '' && theme.colors.white,
                                        borderWidth: item !== '' ? 1 : 0
                                    },
                                    styles.dialPadContainer
                                ]}
                            >
                                <Text
                                    style={[
                                        { fontSize: dialPadTextSize },
                                        styles.dialPadText
                                    ]}
                                >
                                    {item}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundPassword,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    backToPrevious: {
        marginBottom: 20,
        marginHorizontal: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch'
    },
    dialPadPinContainer: {
        flexDirection: 'row',
        marginBottom: 30,
        alignItems: 'flex-end'
    },
    pinContentContainer: {
        flex: 1,
        backgroundColor: theme.colors.backgroundPassword,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    },
    pinContent: {
        backgroundColor: theme.colors.white,
        width: '100%',
        height: '100%'
    },
    pinText: {
        color: theme.colors.white
    },
    pinSubText: {
        color: theme.colors.white,
        marginVertical: 30
    },
    dialPadContainer: {
        width: dialPadSize,
        height: dialPadSize,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 50
    },
    dialPadText: {
        color: theme.colors.white,
        fontSize: dialPadTextSize,
        fontFamily: 'DMSans-Light'
    }
});

export default PasswordSettingScreen;
