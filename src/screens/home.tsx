import React, { FC, memo } from 'react';
import { SafeAreaView } from 'react-native';

import { Navigation } from '@src/typings/navigattion';

interface HomeScreenProps {
    navigation: Navigation;
}

const HomeScreen: FC<HomeScreenProps> = () => {
    // const {navigation} = props;

    return <SafeAreaView />;
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

export default memo(HomeScreen);
