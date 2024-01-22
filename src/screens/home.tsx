import React, { FC } from 'react';
import { SafeAreaView } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ImageSlider from '@src/components/core/imagesSlider';
import { PrivateStackParamsList } from '@src/typings/navigation';
import { Paragraph } from 'react-native-paper';

type HomeScreenProps = NativeStackScreenProps<PrivateStackParamsList, 'Home'>;

const HomeScreen: FC<HomeScreenProps> = () => {
    // const {navigation} = props;

    return (
        <SafeAreaView>
            <Paragraph>Test</Paragraph>
            <ImageSlider />
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
