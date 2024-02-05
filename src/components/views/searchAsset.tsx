import { theme } from '@src/theme';
import React, { FC, memo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Drawer, DrawerSectionProps, Text } from 'react-native-paper';
import ActionButton from '../core/actionButton';
import InputText from '../core/inputText';

interface DrawerAssetProps extends DrawerSectionProps {
    handleClose: () => void;
}

const SearchAsset: FC<DrawerAssetProps> = (props) => {
    const { handleClose } = props;
    return (
        <Drawer.Section showDivider={false}>
            <ScrollView>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={handleClose}
                    style={styles.closeButton}
                >
                    <ActionButton
                        icon={'close'}
                        size="small"
                        backgroundColor={theme.colors.white}
                    />
                </TouchableOpacity>
                <View style={{ marginHorizontal: 25 }}>
                    <Text
                        variant="displaySmall"
                        style={{ fontWeight: 'bold', marginBottom: 15 }}
                    >
                        Search Asset
                    </Text>
                    <Text variant="bodyLarge">Code</Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />

                    <Text variant="bodyLarge">Name</Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />

                    <Text variant="bodyLarge">Location</Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />

                    <Text variant="bodyLarge">Status</Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />

                    <Text variant="bodyLarge">Catagory</Text>
                    <InputText
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                { backgroundColor: '#FF6C6C' }
                            ]}
                            onPress={() => console.log('Button 1 Pressed')}
                        >
                            <Text
                                variant="bodyLarge"
                                style={{
                                    color: theme.colors.white,
                                    fontWeight: '600'
                                }}
                            >
                                Clear
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                { backgroundColor: '#386BA9' }
                            ]}
                            onPress={() => console.log('Button 2 Pressed')}
                        >
                            <Text
                                variant="bodyLarge"
                                style={{
                                    color: theme.colors.white,
                                    fontWeight: '600'
                                }}
                            >
                                Apply
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Drawer.Section>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16
    },
    navigationContainer: {
        backgroundColor: '#ecf0f1'
    },
    closeButton: {
        marginVertical: 20,
        alignSelf: 'flex-end',
        marginRight: 15
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16
    }
});

export default memo(SearchAsset);
