import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SearchAsset from '@src/components/core/searchAsset';
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
            <SearchAsset
                handleClose={() => navigation.navigate('Assets')}
                children={''}
            />
        </View>
    );
};

export default AssetSearch;
