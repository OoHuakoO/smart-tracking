import { Navigation } from '@src/typings/navigattion';
import React, { FC } from 'react';
import { SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
interface HomeScreenProps {
    navigation: Navigation;
}

const HomeScreen: FC<HomeScreenProps> = () => {
    // const {navigation} = props;

    return (
        <SafeAreaView>
            <Text variant="headlineLarge">Home</Text>
        </SafeAreaView>
    );
};

// const styles = StyleSheet.create({
//   forgotPassword: {
//     width: '100%',
//     alignItems: 'flex-end',
//     marginBottom: 24,
//   },
//   row: {
//     flexDirection: 'row',
//     marginTop: 4,
//   },
//   label: {
//     color: theme.colors.secondary,
//   },
//   link: {
//     fontWeight: 'bold',
//     color: theme.colors.primary,
//   },
// });

export default HomeScreen;
