import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DrawerAsset from '@src/components/core/drawer';
import { PrivateStackParamsList } from '@src/typings/navigation';
import React, { FC } from 'react';
import { View } from 'react-native';

type AssetsSearchScreenProps = NativeStackScreenProps<
    PrivateStackParamsList,
    'AssetSearch'
>;

const AssetSearch: FC<AssetsSearchScreenProps> = (props) => {
    const { navigation } = props;
    return (
        <View>
            <DrawerAsset
                handleClose={() => navigation.navigate('Assets')}
                children={''}
            />
        </View>
    );
};

export default AssetSearch;
