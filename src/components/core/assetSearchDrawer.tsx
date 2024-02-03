import ActionButton from '@src/components/core/actionButton';
import InputText from '@src/components/core/inputText';
import { theme } from '@src/theme';
import React, { useRef } from 'react';
import {
  DrawerLayoutAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AssetSearchDrawer = (props) => {
    const { navigation } = props;
    const drawer = useRef<DrawerLayoutAndroid>(null);

    const navigationView = () => (
        <SafeAreaView style={[styles.container, styles.navigationContainer]}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('Assets')}
                style={styles.closeButton}
            >
                <ActionButton
                    icon={'close'}
                    size="small"
                    backgroundColor={theme.colors.white}
                />
            </TouchableOpacity>
            <Text style={styles.title}>Search Asset</Text>
            <Text style={styles.searchTitle}>Email</Text>
            <InputText
                returnKeyType="next"
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            {/* Name Input */}
            <Text style={styles.searchTitle}>Name</Text>
            <InputText
                returnKeyType="next"
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            {/* Location Input */}
            <Text style={styles.searchTitle}>Location</Text>
            <InputText
                returnKeyType="next"
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            {/* Status Input */}
            <Text style={styles.searchTitle}>Status</Text>
            <InputText
                returnKeyType="next"
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            {/* Category Input */}
            <Text style={styles.searchTitle}>Catagory</Text>
            <InputText
                returnKeyType="next"
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#FF6C6C' }]}
                    onPress={() => console.log('Button 1 Pressed')}
                >
                    <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#386BA9' }]}
                    onPress={() => console.log('Button 2 Pressed')}
                >
                    <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    return (
        <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={400}
            drawerPosition={'left'}
            renderNavigationView={navigationView}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={styles.searchButton}
                onPress={() => console.log('Asset search')}
            >
                <ActionButton
                    icon={'magnify'}
                    size="medium"
                    backgroundColor={theme.colors.white}
                />
            </TouchableOpacity>
        </DrawerLayoutAndroid>
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
        alignSelf: 'flex-end', // Align to the right
        borderRadius: 20 // Make it rounded
    },
    title: {
        marginTop: 20,
        color: '#404040',
        fontWeight: 'bold',
        fontSize: 34
    },
    paragraph: {
        padding: 16,
        fontSize: 15,
        textAlign: 'center'
    },
    searchTitle: {
        color: '#404040',
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'left',
        marginTop: 12
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40
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
    },
    searchButton: {
        zIndex: 2
    }
});

export default AssetSearchDrawer;
